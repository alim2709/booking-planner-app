from fastapi import HTTPException
from fastapi.responses import JSONResponse

from app.crud.availability import AvailabilityDB
from app.schemas.availability import SAvailabilityModel, CreateAvailabilityModel

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
    async def create_availability(
        cls, availability_data: CreateAvailabilityModel, user_details: dict
    ):
        availability_data_dict = availability_data.model_dump()

        if user_details["user"]["role"] != "coach":
            raise HTTPException(
                status_code=403, detail="Only coaches can create availability."
            )

        if availability_data_dict["start_time"] >= availability_data_dict["end_time"]:
            raise HTTPException(
                status_code=400, detail="Start time must be earlier than end time."
            )

        new_availability = await crud_availability.create_availability(
            coach_id=int(user_details["user"]["id"]), **availability_data_dict
        )

        return JSONResponse(
            status_code=201,
            content={
                "message": "Availability created successfully.",
            },
        )

    @classmethod
    async def update_availability(
        cls, availability_id: int, data: CreateAvailabilityModel
    ):
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")
        updated_availability = await crud_availability.update_availability(
            availability_id, data.model_dump()
        )
        return SAvailabilityModel.model_construct(updated_availability)

    @classmethod
    async def delete_availability(cls, availability_id: int):
        deleted_availability = await crud_availability.delete_availability(
            availability_id
        )
        return SAvailabilityModel.model_construct(deleted_availability)
