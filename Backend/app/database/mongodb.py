# /backend/app/database/mongodb.py

import os
from pymongo import MongoClient
from pymongo.database import Database
from dotenv import load_dotenv

load_dotenv() 

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["cybersec_llm"]

def get_db() -> Database:
    return db