from typing import List

from fastapi import APIRouter

from app.schemas.availability import SAvailabilityModel
from app.services.availability import AvailabilityService

availability_service = AvailabilityService()

availability_router = APIRouter(prefix="/api")


@availability_router.get("/availabilities", response_model=List[SAvailabilityModel])
async def get_availabilities():

    response = await availability_service.get_availabilities()
    return response
