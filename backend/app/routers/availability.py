from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.user_auth import AccessTokenBearer
from app.schemas.availability import SAvailabilityModel
from app.services.availability import AvailabilityService

availability_service = AvailabilityService()

availability_router = APIRouter(prefix="/api")
access_token_service = AccessTokenBearer()


@availability_router.get("/availabilities", response_model=List[SAvailabilityModel])
async def get_availabilities(user_details: dict = Depends(access_token_service)):

    response = await availability_service.get_availabilities()
    return response

@availability_router.get("/availabilities/{availability_id}", response_model=SAvailabilityModel)
async def get_availability(availability_id: int):
    try:
        response = await availability_service.get_availability(availability_id)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@availability_router.post("/availabilities", response_model=SAvailabilityModel)
async def create_availability(data: SAvailabilityModel):
    try:
        availability = await AvailabilityService.create_availability(data)
        return availability  
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@availability_router.patch("/availabilities/{availability_id}", response_model=SAvailabilityModel)
async def update_availability(availability_id: int, data: SAvailabilityModel):
    try:
        availability = await AvailabilityService.update_availability(availability_id, data)
        return availability
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@availability_router.delete("/availabilities/{availability_id}")
async def delete_availability(availability_id: int):
    try:
        response = await availability_service.delete_availability(availability_id)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))