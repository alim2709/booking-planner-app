from fastapi import HTTPException
from fastapi.responses import JSONResponse

from app.crud.appointment import AppointmentDB
from app.schemas.appointment import CreateAppointmentModel, SAppointmentModel

crud_appointment = AppointmentDB()


class AppointmentService:
    @classmethod
    async def get_appointments(cls):
        result = await crud_appointment.get_appointments()
        return result

    @classmethod
    async def get_appointment(cls, appointment_id: int):
        result = await crud_appointment.get_appointment(appointment_id)
        return result

    @classmethod
    async def create_appointment(
        cls, appointment_data: CreateAppointmentModel, user_details: dict
    ):
        appointment_data_dict = appointment_data.model_dump()

        if user_details["user"]["role"] == "coach":
            raise HTTPException(
                status_code=403, detail="Only students can book an appointment."
            )

        try:
            new_appointment = await crud_appointment.create_appointment(
                student_id=int(user_details["user"]["id"]), **appointment_data_dict
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        return JSONResponse(
            status_code=201,
            content={
                "message": "Appointment created successfully.",
            },
        )

    @classmethod
    async def update_appointment(cls, appointment_id: int, data: SAppointmentModel):
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")
        updated_appointment = await crud_appointment.update_appointment(
            appointment_id, data.model_dump()
        )
        return SAppointmentModel.model_construct(updated_appointment)

    @classmethod
    async def delete_appointment(cls, appointment_id: int):
        deleted_appointment = await crud_appointment.delete_appointment(appointment_id)
        return SAppointmentModel.model_construct(deleted_appointment)
