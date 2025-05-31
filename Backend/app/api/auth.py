# /backend/app/api/auth.py

import os
import sys

from fastapi import APIRouter, HTTPException, Depends, Request
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from datetime import datetime

# Adjust path so we can import app modules
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if APP_DIR not in sys.path:
    sys.path.append(APP_DIR)

from app.database.mongodb import get_db
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ---- Request models ----

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    username: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---- Endpoints ----

@router.post("/signup")
async def signup(request: Request, db=Depends(get_db)):
    payload = await request.json()
    # log payload for debugging
    print("Signup payload:", payload)

    # basic validation
    for field in ("email", "password", "username"):
        if field not in payload or not payload[field]:
            raise HTTPException(status_code=422, detail=f"'{field}' is required.")

    try:
        result = db.users.insert_one({
            "email": payload["email"],
            "password": payload["password"],
            "username": payload["username"],
            "chat_history": [],
            "created_at": __import__('datetime').datetime.utcnow(),
            "updated_at": __import__('datetime').datetime.utcnow(),
        })
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered.")

    return {"id": str(result.inserted_id), "email": payload["email"], "username": payload["username"]}

@router.post("/login")
async def login(request: Request, db=Depends(get_db)):
    payload = await request.json()
    print("Login payload:", payload)
    if not payload.get("email") or not payload.get("password"):
        raise HTTPException(status_code=422, detail="Email and password are required.")

    user = db.users.find_one({
        "email": payload["email"],
        "password": payload["password"],
    })
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials.")

    return {"id": str(user["_id"]), "email": user["email"], "username": user.get("username")}

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out."}