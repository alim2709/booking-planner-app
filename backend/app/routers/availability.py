from typing import List

from fastapi import APIRouter, Depends

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
