from app.crud.availability import AvailabilityDB

crud_availability = AvailabilityDB()


class AvailabilityService:
    @classmethod
    async def get_availabilities(cls):

        result = await crud_availability.get_availabilities()

        return result
