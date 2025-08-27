# /backend/app/services/chatbot.py

import os
import glob
import torch
import pickle
import hashlib
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain.docstore.document import Document
from dotenv import load_dotenv
from pydantic import Field
from guardrails import Guard
import json
from fastapi import HTTPException
from pathlib import Path

from .validators import sanitize_prompt

# load .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

SYSTEM_PROMPT = (
    "You are a cybersecurity education assistant. "
    "Your tasks include:\n"
    "  • Teaching secure coding with OWASP/NIST principles\n"
    "  • Simulating cyber-attack scenarios step-by-step\n"
    "  • Reviewing code for vulnerabilities and recommending fixes\n"
    "  • Assessing learner answers against OWASP Top 10\n"
    "  • Explaining rationale with references to standards\n"
    "Always cite OWASP, NIST, or other authoritative sources. "
    "Never hallucinate or expose internal details. "
    "You must always give references, and only of authoritative sources like OWASP, NIST, or similar. "
)

# Globals
conversation_retrieval_chain = None
embeddings = None
guard = None

cwd = Path.cwd()

if (cwd / "Backend").is_dir():
    # Local machine: prepend "Backend/"
    CYBER_DOCS_PATH = cwd / "Backend" / "data_cyber_docs"
    CACHE_DIR = cwd / "Backend" / "cache"
else:
    # Deployed (e.g. on Render): assume path is directly relative to cwd
    CYBER_DOCS_PATH = cwd / "data_cyber_docs"
    CACHE_DIR = cwd / "cache"

# Create cache directory if it doesn't exist
CACHE_DIR.mkdir(exist_ok=True)
VECTOR_STORE_CACHE_PATH = CACHE_DIR / "vector_store"
DOCS_HASH_FILE = CACHE_DIR / "docs_hash.txt"

def compute_docs_hash() -> str:
    """Compute hash of all cyber docs to detect changes"""
    hash_obj = hashlib.md5()
    
    # Get all doc files
    patterns = (
        glob.glob(os.path.join(CYBER_DOCS_PATH, "**", "*.md"), recursive=True) +
        glob.glob(os.path.join(CYBER_DOCS_PATH, "**", "*.txt"), recursive=True)
    )
    
    # Sort to ensure consistent hashing
    patterns.sort()
    
    for path in patterns:
        # Include file path and modification time in hash
        stat = os.stat(path)
        hash_obj.update(f"{path}:{stat.st_mtime}".encode('utf-8'))
        
        # Also include file content hash
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_obj.update(chunk)
    
    return hash_obj.hexdigest()

def is_cache_valid() -> bool:
    """Check if cached vector store is still valid"""
    if not VECTOR_STORE_CACHE_PATH.exists():
        return False
    
    if not DOCS_HASH_FILE.exists():
        return False
    
    try:
        with open(DOCS_HASH_FILE, 'r') as f:
            cached_hash = f.read().strip()
        
        current_hash = compute_docs_hash()
        return cached_hash == current_hash
    except Exception as e:
        print(f"[is_cache_valid] Error checking cache: {e}")
        return False

def save_docs_hash():
    """Save current docs hash to cache"""
    current_hash = compute_docs_hash()
    with open(DOCS_HASH_FILE, 'w') as f:
        f.write(current_hash)

init_llm()

def load_cyber_corpus() -> List[str]:
    corpus = []
    patterns = (
        glob.glob(os.path.join(CYBER_DOCS_PATH, "**", "*.md"), recursive=True) +
        glob.glob(os.path.join(CYBER_DOCS_PATH, "**", "*.txt"), recursive=True)
    )
    print(f"[load_cyber_corpus] Found {len(patterns)} docs")
    for path in patterns:
        with open(path, "r", encoding="utf-8") as f:
            corpus.append(f.read())
    return corpus

def load_cached_vector_store():
    """Load vector store from cache if available"""
    try:
        store = Chroma(
            persist_directory=str(VECTOR_STORE_CACHE_PATH),
            embedding_function=embeddings
        )
        print("[load_cached_vector_store] Successfully loaded cached vector store")
        return store
    except Exception as e:
        print(f"[load_cached_vector_store] Error loading cache: {e}")
        return None

def save_vector_store_cache(store):
    """Save vector store to cache"""
    try:
        # Chroma automatically persists when persist_directory is set
        save_docs_hash()
        print("[save_vector_store_cache] Successfully saved vector store to cache")
    except Exception as e:
        print(f"[save_vector_store_cache] Error saving cache: {e}")

def build_fresh_vector_store():
    """Build a new vector store from documents"""
    print("[build_fresh_vector_store] Creating new vector store...")
    
    docs = [Document(page_content=d) for d in load_cyber_corpus()]
    
    # Create new vector store with persistence
    store = Chroma.from_documents(
        docs, 
        embedding=embeddings,
        persist_directory=str(VECTOR_STORE_CACHE_PATH)
    )
    
    # Save the hash for future cache validation
    save_vector_store_cache(store)
    
    return store

def process_prompt(db, user_id: str, prompt: str) -> str:
    """
    1. Sanitize the prompt to prevent injection attacks
    2. Load user's chat_history from MongoDB
    3. Build context + system prompt
    4. Query RetrievalQA
    5. Guardrails validation
    6. Append to chat_history and update user record
    """
    prompt = sanitize_prompt(prompt)
    # in process_prompt(), right after sanitize_prompt
    guard_pre = guard.parse(json.dumps({"generated_output": prompt}))
    print(f"[process_prompt] guard_pre.validation_passed={guard_pre.validation_passed}")
    if not guard_pre.validation_passed:
        # if our simple "generated_output" field doesn't pass (e.g. profanity),
        # we can reject or modify before continuing.
        raise HTTPException(status_code=400, detail="Prompt failed guardrails pre-check.")

    global conversation_retrieval_chain

    # 0) If user explicitly requests to clear history:
    if prompt.strip().upper() == "CLEAR_HISTORY":
        # Wipe out their chat_history array
        res = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"chat_history": []}}
        )
        # You could also log res.raw_result here if you like.
        return "✅ Your chat history has been cleared."

    # 1) fetch or build chain
    if conversation_retrieval_chain is None:
        build_retrieval_chain()

    # 2) load user history
    user_obj = db.users.find_one({"_id": ObjectId(user_id)})
    history = user_obj.get("chat_history", [])

    # 3) assemble context (last 10 turns)
    ctx = ""
    for turn in history[-10:]:
        role = "User" if turn["sender"] == "user" else "Assistant"
        ctx += f"{role}: {turn['message']}\n"
    

    full_prompt = f"{SYSTEM_PROMPT}\n{ctx}User: {prompt}"

    # 4) call LLM
    result = conversation_retrieval_chain({"query": full_prompt})
    raw_answer = result.get("result", "")

    # 5) guardrails
    try:
        parsed = guard.parse(raw_answer)
        print("[process_prompt] Guardrails parsed")

        # If it parsed & validated, great
        if parsed.validation_passed and parsed.validated_output:
            answer = parsed.validated_output["generated_output"]
            print("[process_prompt] Guardrails validated output:", answer[:20])
        else:
            # Fallback: wrap raw_answer in JSON matching your rail
            wrapper = json.dumps({"generated_output": raw_answer})
            print("[process_prompt] Guardrails wrapping raw answer into JSON:", wrapper[:20])
            reparsed = guard.parse(wrapper)
            # Now validated_output must exist
            answer = reparsed.validated_output["generated_output"]
            print("[process_prompt] Guardrails reparsed output:", answer[:20])

    except Exception as e:
        print("[process_prompt] guard.parse error:", e)
        # As a last resort just use the raw text
        answer = raw_answer

    # 6) persist back to user document
    entry_user = {"sender": "user", "message": prompt, "timestamp": datetime.utcnow()}
    entry_bot  = {"sender": "bot",  "message": answer, "timestamp": datetime.utcnow()}
    update_result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"chat_history": {"$each": [entry_user, entry_bot]}}}
    )

    return answer
