# /backend/app/models/user.py

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    sender: str
    message: str
    timestamp: datetime

class User(BaseModel):
    id: Optional[str] = Field(None, alias="id")
    email: str
    password: str
    username: str
    chat_history: List[Message] = []
