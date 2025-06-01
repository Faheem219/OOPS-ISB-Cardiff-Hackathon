import os
import sys

APP_DIR = os.path.dirname(os.path.abspath(__file__))
if APP_DIR not in sys.path:
    sys.path.append(APP_DIR)

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api import auth, chatbot
from app.services import sustainable  # Import the sustainable router
import uvicorn

app = FastAPI(title="CyberLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chatbot.router)
app.include_router(sustainable.router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)
