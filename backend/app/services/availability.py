from app.crud.availability import AvailabilityDB
from app.schemas.availability import CreateAvailabilityModel, SAvailabilityModel

crud_availability = AvailabilityDB()

class AvailabilityService:
    @classmethod
    async def get_availabilities(cls):
        result = await crud_availability.get_availabilities()
        return result
    
    @classmethod
    async def create_availability(cls, data: CreateAvailabilityModel) -> SAvailabilityModel:
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")

        new_availability = await crud_availability.create_availability(data)

        return SAvailabilityModel.model_construct(new_availability)