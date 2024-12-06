from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.database import async_session_maker
from app.models.appointment import Appointment


class AppointmentDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_appointments(self, filter_data=None):
        async with self.session() as session:
            query = select(Appointment)

            if filter_data:
                for key, value in filter_data.items():
                    query = query.filter(getattr(Appointment, key) == value)

            request = await session.execute(query)
            response = request.scalars().all()
            return response
        
    async def get_appointment(self, appointment_id):
        async with self.session() as session:
            query = select(Appointment).filter(Appointment.id == appointment_id)
            request = await session.execute(query)
            response = request.scalars().first()
            return response

    async def create_appointment(self, data):
        async with self.session() as session:
            try:
                appointment = Appointment(**data.model_dump())
                session.add(appointment)
                await session.commit()
                await session.refresh(appointment)
                return appointment
            except IntegrityError as e:
                await session.rollback()
                raise ValueError(f"Failed to create appointment: {str(e)}")

    async def update_appointment(self, appointment_id, update_data):
        async with self.session() as session:
            query = select(Appointment).filter(Appointment.id == appointment_id)
            request = await session.execute(query)
            appointment = request.scalars().first()

            if not appointment:
                raise ValueError(f"Appointment with id {appointment_id} not found.")

            for key, value in update_data.items():
                setattr(appointment, key, value)

            await session.commit()
            await session.refresh(appointment)
            return appointment

    async def delete_appointment(self, appointment_id):
        async with self.session() as session:
            query = select(Appointment).filter(Appointment.id == appointment_id)
            request = await session.execute(query)
            appointment = request.scalars().first()

            if not appointment:
                raise ValueError(f"Appointment with id {appointment_id} not found.")

            await session.delete(appointment)
            await session.commit()
            return {"message": f"Appointment with id {appointment_id} has been deleted."}
