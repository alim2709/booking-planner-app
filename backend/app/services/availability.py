from app.crud.availability import AvailabilityDB
from app.schemas.availability import SAvailabilityModel, CreateAvailabilityModel
from app.crud.user import UserDB
from app.utils.enums import UserRole

crud_availability = AvailabilityDB()
crud_user = UserDB()

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
    async def is_coach(cls, user_id: int) -> bool:
        user = await crud_user.get_user(user_id)
        return user.role == UserRole.COACH
    
    @classmethod
    async def create_availability(cls, user_id: int, data: CreateAvailabilityModel):
        if not await cls.is_coach(user_id):
            raise PermissionError("User is not authorized to create availability.")
        
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")

        new_availability = await crud_availability.create_availability(data)

        return SAvailabilityModel.model_construct(new_availability)
    
    @classmethod
    async def update_availability(cls, user_id: int, availability_id: int, data: CreateAvailabilityModel):
        if not await cls.is_coach(user_id):
            raise PermissionError("User is not authorized to update availability.")
        
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")
        
        updated_availability = await crud_availability.update_availability(availability_id, data.model_dump())
        return SAvailabilityModel.model_construct(updated_availability)

    @classmethod
    async def delete_availability(cls, user_id: int, availability_id: int):
        if not await cls.is_coach(user_id):
            raise PermissionError("User is not authorized to delete availability.")
        
        deleted_availability = await crud_availability.delete_availability(availability_id)
        return SAvailabilityModel.model_construct(deleted_availability)
    
    