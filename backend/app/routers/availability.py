from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.availability import SAvailabilityModel
from app.services.availability import AvailabilityService

availability_service = AvailabilityService()

availability_router = APIRouter(prefix="/api")


@availability_router.get("/availabilities", response_model=List[SAvailabilityModel])
async def get_availabilities():

    response = await availability_service.get_availabilities()
    return response

@availability_router.post("/availabilities", response_model=SAvailabilityModel)
async def create_availability(data: SAvailabilityModel):
    try:
        availability = await AvailabilityService.create_availability(data)
        return availability  
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@availability_router.patch("/availabilities", response_model=SAvailabilityModel)
async def update_availability(data: SAvailabilityModel):
    try:
        availability = await AvailabilityService.update_availability(data)
        return availability
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))