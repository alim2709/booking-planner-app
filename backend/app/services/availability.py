from app.crud.availability import AvailabilityDB
from app.schemas.availability import SAvailabilityModel

crud_availability = AvailabilityDB()

class AvailabilityService:
    @classmethod
    async def get_availabilities(cls):
        result = await crud_availability.get_availabilities()
        return result
    
    @classmethod
    async def get_availability(cls, availability_id: int):
        result = await crud_availability.get_availability(availability_id)
        return result
    
    @classmethod
    async def create_availability(cls, data: SAvailabilityModel):
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")

        new_availability = await crud_availability.create_availability(data)

        return SAvailabilityModel.model_construct(new_availability)
    
    @classmethod
    async def update_availability(cls, availability_id: int, data: SAvailabilityModel):
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")
        updated_availability = await crud_availability.update_availability(availability_id, data.dict())
        return SAvailabilityModel.model_construct(updated_availability)

    @classmethod
    async def delete_availability(cls, availability_id: int):
        deleted_availability = await crud_availability.delete_availability(availability_id)
        return SAvailabilityModel.model_construct(deleted_availability)