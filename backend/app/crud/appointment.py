from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.database import async_session_maker
from app.models.appointment import Appointment
from app.models.availability import Availability


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
                appointment = Appointment(**data.dict())
                session.add(appointment)
                
                availability = await session.get(Availability, data.availability_id)
                if not availability:
                    raise ValueError(f"Availability with ID {data['availability_id']} not found.")
                
                if availability.is_booked:
                    raise ValueError("Availability is already booked.")
                
                availability.is_booked = True

                await session.commit()
                await session.refresh(appointment)
                await session.refresh(availability)
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
                raise ValueError(f"Appointment with ID {appointment_id} not found.")

            availability = await session.get(Availability, appointment.availability_id)
            if availability:
                availability.is_booked = False
                
            await session.delete(appointment)
            await session.commit()
            return {"message": f"Appointment with ID {appointment_id} has been deleted."}

