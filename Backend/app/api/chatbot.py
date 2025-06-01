# /backend/app/api/chatbot.py

import os, sys

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

# allow imports from app/
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if APP_DIR not in sys.path:
    sys.path.append(APP_DIR)

from app.database.mongodb import get_db
from app.services.chatbot import process_prompt

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

class ChatRequest(BaseModel):
    user_id: str
    prompt: str

@router.post("/message")
async def send_message(payload: ChatRequest, db=Depends(get_db)):
    if not payload.user_id or not payload.prompt:
        raise HTTPException(400, "user_id and prompt are required")

    # Run the RAG-based secure-cyber-education assistant
    try:
        answer = process_prompt(db, payload.user_id, payload.prompt)
    except Exception as e:
        status = getattr(e, "status_code", 500)
        raise HTTPException(status_code = status, detail=str(e))

    return {"result": answer}

@router.get("/history")
async def get_history(user_id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(400, "Invalid user_id")

    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(404, "User not found")

    return {"chat_history": user.get("chat_history", [])}
