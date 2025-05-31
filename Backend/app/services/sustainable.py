from fastapi import APIRouter, Depends
from app.database.mongodb import get_db
from pymongo.database import Database
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel

# Define a Pydantic model for the update request
class SustainableUpdate(BaseModel):
    user_id: str
    dark_mode_hours: float
    low_bandwidth_hours: float

def update_sustainable_usage(db: Database, user_id: str, dark_mode_hours: float, low_bandwidth_hours: float):
    update_query = {
        "$inc": {
            "sustainable_usage.darkModeHours": dark_mode_hours,
            "sustainable_usage.lowBandwidthHours": low_bandwidth_hours
        },
        "$set": {
            "updated_at": datetime.utcnow()
        }
    }
    result = db.users.update_one({"_id": ObjectId(user_id)}, update_query)
    return result.modified_count

router = APIRouter(prefix="/api/sustainable", tags=["sustainable"])

@router.post("/update")
async def update_usage(update: SustainableUpdate, db: Database = Depends(get_db)):
    modified = update_sustainable_usage(db, update.user_id, update.dark_mode_hours, update.low_bandwidth_hours)
    if modified == 0:
        return {"message": "No update performed"}
    return {"message": "Sustainable usage updated successfully"}