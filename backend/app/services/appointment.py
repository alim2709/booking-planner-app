from app.crud.appointment import AppointmentDB
from app.schemas.appointment import SAppointmentModel

crud_appointment = AppointmentDB()

class AppointmentService:
    @classmethod
    async def get_appointments(cls):
        result = await crud_appointment.get_appointments()
        return result 
    
    @classmethod
    async def create_appointment(cls, data: SAppointmentModel):
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")

        new_appointment = await crud_appointment.create_appointment(data)

        return SAppointmentModel.model_construct(new_appointment)
    
    @classmethod
    async def update_appointment(cls, data: SAppointmentModel):
        if data.start_time >= data.end_time:
            raise ValueError("Start time must be earlier than end time.")

        updated_appointment = await crud_appointment.update_appointment(data)

        return SAppointmentModel.model_construct(updated_appointment)
    
    
    @classmethod 
    async def delete_appointment(cls, data: SAppointmentModel):
        deleted_appointment = await crud_appointment.delete_appointment(data)

        return SAppointmentModel.model_construct(deleted_appointment)