from fastapi import APIRouter
from app.api.v1.endpoints import snapshots

api_v1_router = APIRouter()
api_v1_router.include_router(snapshots.router, prefix="/snapshots", tags=["snapshots"])
