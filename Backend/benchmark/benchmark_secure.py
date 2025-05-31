# Backend/benchmark/benchmark_secure.py

import os
import glob
import json
import torch
import re
import difflib
import numpy as np
from typing import Optional, List, Dict, Tuple, Union, Set, Any
from collections import defaultdict
from datetime import datetime
import time
from bson import ObjectId
from fastapi import HTTPException
from pydantic import Field
from dotenv import load_dotenv

from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms.base import LLM
from guardrails import Guard
from google import genai

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# ---------------------------------------
# 1) Load environment variables
# ---------------------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

# ---------------------------------------
# 2) System prompt (identical to chatbot.py)
# ---------------------------------------
SYSTEM_PROMPT = (
    "You are a cybersecurity education assistant. "
    "Your tasks include:\n"
    "  • Teaching secure coding with OWASP/NIST principles\n"
    "  • Simulating cyber-attack scenarios step-by-step\n"
    "  • Reviewing code for vulnerabilities and recommending fixes\n"
    "  • Assessing learner answers against OWASP Top 10\n"
    "  • Explaining rationale with references to standards\n"
    "Always cite OWASP, NIST, or other authoritative sources. "
    "Never hallucinate or expose internal details."
)

# ---------------------------------------
# 3) Globals for retrieval chain & guardrails
# ---------------------------------------
CYBER_DOCS_PATH = os.getenv("CYBER_DOCS_PATH", "Backend/data_cyber_docs")
conversation_retrieval_chain = None
embeddings = None
guard = None

# ---------------------------------------
# 4) GeminiLLM wrapper (same as chatbot.py)
# ---------------------------------------
class GeminiLLM(LLM):
    model_name: str = Field(...)
    max_tokens: int = Field(default=500)
    temperature: float = Field(default=0.1)
    api_key: str = Field(...)
    system_prompt: str = Field(
    "You are a cybersecurity education assistant. "
    "Your tasks include:\n"
    "  • Teaching secure coding with OWASP/NIST principles\n"
    "  • Simulating cyber-attack scenarios step-by-step\n"
    "  • Reviewing code for vulnerabilities and recommending fixes\n"
    "  • Assessing learner answers against OWASP Top 10\n"
    "  • Explaining rationale with references to standards\n"
    "Always cite OWASP, NIST, or other authoritative sources. "
    "Never hallucinate or expose internal details."
)

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        client = genai.Client(api_key=self.api_key)
        try:
            resp = client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return resp.text
        except Exception as e:
            print("[GeminiLLM] API error:", e)
            return f"Error during Gemini API call: {e}"

    @property
    def _llm_type(self) -> str:
        return "gemini_llm"

    @property
    def _identifying_params(self) -> dict:
        return {
            "model_name": self.model_name,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "system_prompt": self.system_prompt
        }


# ---------------------------------------
# 5) Initialize embeddings & guardrails (mirror chatbot.py)
# ---------------------------------------
def init_llm():
    global embeddings, guard
    os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY

    print("[benchmark_secure:init_llm] Initializing embeddings and guardrails")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": DEVICE}
    )

    spec = "Backend/rails/security_education_guardrails.rail"
    print(f"[benchmark_secure:init_llm] Loading Guardrails spec from {spec}")
    guard = Guard.from_rail(spec)
    print("[benchmark_secure:init_llm] Guardrails loaded:", bool(guard))

    os.environ.pop("GEMINI_API_KEY", None)


# Auto‐init on import
init_llm()
semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
stemmer = PorterStemmer()
stop_words = set(stopwords.words('english'))

# ---------------------------------------
# 6) Build the RetrievalQA chain (mirror chatbot.py)
# ---------------------------------------
def load_cyber_corpus() -> List[str]:
    """
    Load all .md and .txt files under CYBER_DOCS_PATH into a list of document texts.
    """
    patterns = (
        glob.glob(os.path.join(CYBER_DOCS_PATH, "**", "*.md"), recursive=True) +
        glob.glob(os.path.join(CYBER_DOCS_PATH, "**", "*.txt"), recursive=True)
    )
    print(f"[benchmark_secure:load_cyber_corpus] Found {len(patterns)} docs")
    corpus = []
    for path in patterns:
        with open(path, "r", encoding="utf-8") as f:
            corpus.append(f.read())
    return corpus


def build_retrieval_chain():
    """
    Build (or rebuild) the RetrievalQA chain over the cybersecurity corpus.
    """
    global conversation_retrieval_chain
    from langchain.docstore.document import Document

    print("[benchmark_secure:build_retrieval_chain] Building RAG chain")
    docs = [Document(page_content=d) for d in load_cyber_corpus()]

    store = Chroma.from_documents(docs, embedding=embeddings)
    conversation_retrieval_chain = RetrievalQA.from_chain_type(
        llm=GeminiLLM(
            model_name="gemini-2.5-flash-preview-05-20",
            api_key=GEMINI_API_KEY,
            max_tokens=600,
            temperature=0.1
        ),
        chain_type="stuff",
        retriever=store.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 6, "lambda_mult": 0.25}
        ),
        return_source_documents=False
    )
    print("[benchmark_secure:build_retrieval_chain] Chain ready")

# ---------------------------------------
# 7) Load the JSONL dataset
# ---------------------------------------
def load_jsonl_dataset(path: str) -> List[Dict]:
    """
    Each non-empty line in the file should be a valid JSON object with keys:
      - 'id', 'category', 'instruction', 'input', 'thought', 'output'
    This function skips blank lines or any lines that fail JSON parsing.
    """
    data = []
    print(f"[benchmark_secure:load_jsonl_dataset] Loading JSONL from {path}")
    with open(path, "r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, start=1):
            raw = line.strip()
            if not raw:
                continue
            try:
                obj = json.loads(raw)
                data.append(obj)
            except json.JSONDecodeError as e:
                print(f"[benchmark_secure:load_jsonl_dataset] Skipping invalid JSON at line {lineno}: {e}")
                continue

    print(f"[benchmark_secure:load_jsonl_dataset] Successfully loaded {len(data)} entries")
    return data

# ---------------------------------------
# 8) Helper: Extract JSON substring from fenced markdown
# ---------------------------------------
def extract_json(text: str) -> str:
    """
    If text contains triple-backtick fences, find the first '{' and last '}' and return that slice.
    Otherwise return the original text.
    """
    if "```" in text:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start : end + 1]
    return text

def preprocess_text(text: str) -> str:
    """Advanced text preprocessing for semantic comparison"""
    # Convert to lowercase and remove extra whitespace
    text = re.sub(r'\s+', ' ', text.lower().strip())
    
    # Remove special characters but keep important punctuation
    text = re.sub(r'[^\w\s\-\.]', ' ', text)
    
    # Tokenize and remove stopwords
    tokens = word_tokenize(text)
    tokens = [stemmer.stem(token) for token in tokens if token not in stop_words and len(token) > 2]
    
    return ' '.join(tokens)

def semantic_similarity(text1: str, text2: str) -> float:
    """Compute semantic similarity using sentence transformers"""
    if not text1.strip() or not text2.strip():
        return 0.0
    
    try:
        embeddings = semantic_model.encode([text1, text2])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        return max(0.0, float(similarity))
    except Exception:
        return 0.0

def fuzzy_text_match(text1: str, text2: str, threshold: float = 0.7) -> float:
    """Advanced fuzzy matching with multiple approaches"""
    if not text1.strip() or not text2.strip():
        return 0.0
    
    # Exact match
    if text1.lower().strip() == text2.lower().strip():
        return 1.0
    
    # Substring match
    t1_lower, t2_lower = text1.lower(), text2.lower()
    if t1_lower in t2_lower or t2_lower in t1_lower:
        shorter, longer = (t1_lower, t2_lower) if len(t1_lower) < len(t2_lower) else (t2_lower, t1_lower)
        return len(shorter) / len(longer)
    
    # Sequence matcher ratio
    seq_ratio = difflib.SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
    
    # Semantic similarity
    sem_score = semantic_similarity(text1, text2)
    
    # Preprocessed text similarity
    proc_ratio = difflib.SequenceMatcher(None, preprocess_text(text1), preprocess_text(text2)).ratio()
    
    # Combined score with weights
    combined_score = max(seq_ratio * 0.4, sem_score * 0.4, proc_ratio * 0.2)
    
    return combined_score if combined_score >= threshold else 0.0

def extract_key_concepts(text: str) -> Set[str]:
    """Extract key cybersecurity concepts from text"""
    # Common cybersecurity terms and patterns
    cyber_patterns = [
        r'cve-\d{4}-\d+', r'#\w+gate[r]?', r'owasp\s+(?:top\s+)?(?:10|\d+)',
        r'nist', r'privilege\s+escalation', r'access\s+control', r'vulnerability',
        r'exploit', r'malware', r'antivirus', r'quarantine', r'ntfs\s+junction',
        r'administrator', r'user-level', r'shellshock', r'bash', r'gnu',
        r'broken\s+access\s+control', r'security\s+misconfiguration'
    ]
    
    concepts = set()
    text_lower = text.lower()
    
    # Extract pattern matches
    for pattern in cyber_patterns:
        matches = re.findall(pattern, text_lower)
        concepts.update(matches)
    
    # Extract important terms
    processed = preprocess_text(text)
    tokens = processed.split()
    
    # Filter for cybersecurity-relevant terms
    cyber_terms = {'vulnerabil', 'exploit', 'attack', 'malwar', 'antivir', 
                   'quarantin', 'junction', 'privilege', 'access', 'control',
                   'security', 'bash', 'shellshock', 'microsoft', 'window',
                   'defender', 'system', 'endpoint', 'essential', 'owasp',
                   'nist', 'administrator', 'user', 'level', 'account'}
    
    concepts.update([token for token in tokens if any(term in token for term in cyber_terms)])
    
    return concepts

def compute_concept_overlap(gold_concepts: Set[str], pred_concepts: Set[str]) -> float:
    """Compute overlap between concept sets"""
    if not gold_concepts:
        return 1.0 if not pred_concepts else 0.0
    
    if not pred_concepts:
        return 0.0
    
    intersection = len(gold_concepts.intersection(pred_concepts))
    union = len(gold_concepts.union(pred_concepts))
    
    return intersection / union if union > 0 else 0.0

def flatten_json_improved(obj: Any, parent_key: str = "", max_depth: int = 3) -> Dict[str, str]:
    """Improved JSON flattening with depth control and better handling"""
    items = {}
    
    if max_depth <= 0:
        return {parent_key: str(obj)}
    
    if isinstance(obj, dict):
        for k, v in obj.items():
            new_key = f"{parent_key}.{k}" if parent_key else k
            if isinstance(v, (dict, list)) and max_depth > 1:
                items.update(flatten_json_improved(v, new_key, max_depth - 1))
            else:
                items[new_key] = str(v)
    elif isinstance(obj, list):
        if all(isinstance(item, str) for item in obj):
            # Handle list of strings as a single concatenated value
            items[parent_key] = " | ".join(obj)
        else:
            for i, item in enumerate(obj):
                new_key = f"{parent_key}[{i}]" if parent_key else f"item_{i}"
                if isinstance(item, (dict, list)) and max_depth > 1:
                    items.update(flatten_json_improved(item, new_key, max_depth - 1))
                else:
                    items[new_key] = str(item)
    else:
        items[parent_key] = str(obj)
    
    return items

def compute_content_relevance_score(gold_json: Dict, pred_json: Dict) -> float:
    """Compute how relevant the predicted content is to the gold standard"""
    
    # Flatten both JSONs
    gold_flat = flatten_json_improved(gold_json)
    pred_flat = flatten_json_improved(pred_json)
    
    # Extract all text content
    gold_text = " ".join(str(v) for v in gold_flat.values())
    pred_text = " ".join(str(v) for v in pred_flat.values())
    
    # Concept-based scoring
    gold_concepts = extract_key_concepts(gold_text)
    pred_concepts = extract_key_concepts(pred_text)
    concept_score = compute_concept_overlap(gold_concepts, pred_concepts)
    
    # Semantic similarity of full content
    semantic_score = semantic_similarity(gold_text, pred_text)
    
    # Field-level semantic matching
    field_scores = []
    for gold_key, gold_val in gold_flat.items():
        best_field_score = 0.0
        gold_val_str = str(gold_val)
        
        for pred_key, pred_val in pred_flat.items():
            pred_val_str = str(pred_val)
            
            # Key similarity
            key_sim = fuzzy_text_match(gold_key, pred_key, threshold=0.3)
            
            # Value similarity
            val_sim = fuzzy_text_match(gold_val_str, pred_val_str, threshold=0.3)
            
            # Combined score with higher weight on value
            combined = (key_sim * 0.3 + val_sim * 0.7)
            best_field_score = max(best_field_score, combined)
        
        field_scores.append(best_field_score)
    
    field_score = np.mean(field_scores) if field_scores else 0.0
    
    # Weighted combination
    relevance_score = (
        concept_score * 0.4 +      # Concept overlap
        semantic_score * 0.3 +     # Overall semantic similarity
        field_score * 0.3          # Field-level matching
    )
    
    return min(1.0, relevance_score)

def compute_cybersecurity_accuracy_score(gold_json: Dict, pred_json: Dict) -> float:
    """Specialized scoring for cybersecurity content accuracy"""
    
    # Critical cybersecurity fields that should be accurate
    critical_fields = {
        'vulnerability', 'cve', 'exploit', 'attack', 'malware',
        'name', 'identifier', 'date', 'product', 'method', 'vector'
    }
    
    gold_flat = flatten_json_improved(gold_json)
    pred_flat = flatten_json_improved(pred_json)
    
    critical_matches = 0
    total_critical = 0
    
    # Check critical field accuracy
    for gold_key, gold_val in gold_flat.items():
        key_lower = gold_key.lower()
        if any(cf in key_lower for cf in critical_fields):
            total_critical += 1
            best_match = 0.0
            
            for pred_key, pred_val in pred_flat.items():
                if any(cf in pred_key.lower() for cf in critical_fields):
                    match_score = fuzzy_text_match(str(gold_val), str(pred_val), threshold=0.8)
                    best_match = max(best_match, match_score)
            
            if best_match > 0.8:
                critical_matches += 1
    
    critical_accuracy = critical_matches / total_critical if total_critical > 0 else 1.0
    
    # Overall content accuracy using semantic similarity
    gold_text = " ".join(str(v) for v in gold_flat.values())
    pred_text = " ".join(str(v) for v in pred_flat.values())
    
    semantic_acc = semantic_similarity(gold_text, pred_text)
    
    # Combined accuracy score
    accuracy_score = critical_accuracy * 0.6 + semantic_acc * 0.4
    
    return accuracy_score

def compute_completeness_score(gold_json: Dict, pred_json: Dict) -> float:
    """Measure how complete the prediction is compared to gold standard"""
    
    gold_flat = flatten_json_improved(gold_json)
    pred_flat = flatten_json_improved(pred_json)
    
    if not gold_flat:
        return 1.0 if not pred_flat else 0.5
    
    covered_fields = 0
    
    for gold_key, gold_val in gold_flat.items():
        field_covered = False
        gold_val_str = str(gold_val)
        
        # Check if this information appears anywhere in prediction
        for pred_val in pred_flat.values():
            pred_val_str = str(pred_val)
            
            # More lenient matching for completeness
            if fuzzy_text_match(gold_val_str, pred_val_str, threshold=0.5) > 0.5:
                field_covered = True
                break
        
        if field_covered:
            covered_fields += 1
    
    return covered_fields / len(gold_flat)

def compute_improved_composite_score(gold_json: Dict, pred_json: Dict) -> Dict[str, float]:
    """Compute improved composite scoring for cybersecurity LLM evaluation"""
    
    # Individual metrics
    relevance = compute_content_relevance_score(gold_json, pred_json)
    accuracy = compute_cybersecurity_accuracy_score(gold_json, pred_json)
    completeness = compute_completeness_score(gold_json, pred_json)
    
    # Semantic similarity as baseline
    gold_text = json.dumps(gold_json, sort_keys=True)
    pred_text = json.dumps(pred_json, sort_keys=True)
    semantic_sim = semantic_similarity(gold_text, pred_text)
    
    # Composite score with balanced weights
    composite = (
        relevance * 0.35 +      # Content relevance
        accuracy * 0.35 +       # Cybersecurity accuracy
        completeness * 0.20 +   # Information completeness
        semantic_sim * 0.10     # Overall semantic similarity
    )
    
    return {
        'relevance_score': relevance,
        'accuracy_score': accuracy,
        'completeness_score': completeness,
        'semantic_similarity': semantic_sim,
        'composite_score': composite
    }

def run_secure_benchmark(
    dataset_path: str,
    output_results_path: str = "Backend/benchmark/secure_results.json"
):
    """
    Improved benchmarking with more balanced evaluation metrics
    """
    global conversation_retrieval_chain

    # Build RAG chain if needed
    if conversation_retrieval_chain is None:
        build_retrieval_chain()

    # Load dataset
    entries = load_jsonl_dataset(dataset_path)

    # Prepare results container
    results = []
    total = len(entries)
    
    # Accumulate scores
    score_sums = defaultdict(float)

    print(f"\n[improved_benchmark] Starting evaluation of {total} entries")
    print("=" * 60)

    # Process each entry
    for i, item in enumerate(entries, 1):
        qid = item.get("id", f"<no-id-{i}>")
        category = item.get("category", "")
        instruction = item.get("instruction", "").strip()
        inp = item.get("input", "").strip()
        gold_output_str = item.get("output", "").strip()

        print(f"\n[{i}/{total}] Processing ID={qid}")
        print(f"Category: {category}")

        # Construct prompt
        full_prompt = (
            f"{SYSTEM_PROMPT}\nInstruction: {instruction}\n"
            f"Input: {inp}\n"
            "Output (in JSON):"
        )

        # Query the chain
        try:
            response = conversation_retrieval_chain({"query": full_prompt})
            raw_answer = response.get("result", "").strip()
        except Exception as e:
            print(f"Error querying chain: {e}")
            raw_answer = ""

        # Apply guardrails
        try:
            parsed = guard.parse(raw_answer)
            if parsed.validation_passed and parsed.validated_output:
                model_output_str = parsed.validated_output.get("generated_output", raw_answer)
            else:
                wrapper = json.dumps({"generated_output": raw_answer})
                reparsed = guard.parse(wrapper)
                model_output_str = reparsed.validated_output.get("generated_output", raw_answer)
        except Exception as e:
            print(f"Guardrails error: {e}")
            model_output_str = raw_answer

        # Parse JSON outputs
        cleaned_model_output = extract_json(model_output_str)
        try:
            model_output_json = json.loads(cleaned_model_output)
        except Exception as e:
            print(f"Error parsing model JSON: {e}")
            model_output_json = {"raw_output": cleaned_model_output}

        try:
            gold_output_json = json.loads(gold_output_str)
        except Exception as e:
            print(f"Error parsing gold JSON: {e}")
            gold_output_json = {"raw_output": gold_output_str}

        # Compute improved scores
        scores = compute_improved_composite_score(gold_output_json, model_output_json)
        
        # Print scores
        # print(f"Relevance: {scores['relevance_score']:.3f}")
        # print(f"Accuracy: {scores['accuracy_score']:.3f}")
        # print(f"Completeness: {scores['completeness_score']:.3f}")
        print(f"Semantic Similarity: {scores['semantic_similarity']:.3f}")
        # print(f"Composite Score: {scores['composite_score']:.3f}")

        # Accumulate scores
        for key, value in scores.items():
            score_sums[key] += value

        # Store results
        result_entry = {
            "id": qid,
            "category": category,
            "gold_output": gold_output_json,
            "model_output": model_output_json,
            "semantic_similarity": scores["semantic_similarity"]
        }
        results.append(result_entry)
        time.sleep(10)

    # Compute averages
    avg_scores = {key: value / total for key, value in score_sums.items()}

    # Print summary
    print("\n" + "=" * 60)
    print("IMPROVED BENCHMARK RESULT")
    print("=" * 60)
    print(f"Total entries evaluated: {total}")
    # print(f"Average Relevance Score: {avg_scores['relevance_score']:.1%}")
    # print(f"Average Accuracy Score: {avg_scores['accuracy_score']:.1%}")
    # print(f"Average Completeness Score: {avg_scores['completeness_score']:.1%}")
    print(f"Average Semantic Similarity: {avg_scores['semantic_similarity']:.1%}")
    # print(f"Average Composite Score: {avg_scores['composite_score']:.1%}")
    print("=" * 60)

    # Categorize performance
    semantic_avg = avg_scores['semantic_similarity']
    if semantic_avg >= 0.8:
        performance = "Excellent"
    elif semantic_avg >= 0.7:
        performance = "Good"
    elif semantic_avg >= 0.6:
        performance = "Satisfactory"
    elif semantic_avg >= 0.5:
        performance = "Needs Improvement"
    else:
        performance = "Poor"

    print(f"Overall Performance Rating: {performance}")
    print("=" * 60)

    # Save results
    final_results = {
        "summary": {
            "total_entries": total,
            "average_score": avg_scores["semantic_similarity"],
            "performance_rating": performance
        },
        "detailed_results": results
    }

    os.makedirs(os.path.dirname(output_results_path), exist_ok=True)
    with open(output_results_path, "w", encoding="utf-8") as outf:
        json.dump(final_results, outf, indent=2)
    
    print(f"\nDetailed results saved to: {output_results_path}")

    return avg_scores

# ---------------------------------------
# 13) Entry point when run directly
# ---------------------------------------
if __name__ == "__main__":
    dataset_file = "Backend/benchmark/secure_dataset.jsonl"
    output_file = "Backend/benchmark/secure_results.json"
    run_secure_benchmark(dataset_file, output_file)
