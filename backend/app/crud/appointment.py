from sqlalchemy import select, insert

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

    async def create_appointment(self, **appointment_data):
        async with self.session() as session:
            availability_id = appointment_data.get("availability_id")

            availability_query = select(Availability).where(
                Availability.id == availability_id
            )
            availability_result = await session.execute(availability_query)
            availability = availability_result.scalar_one_or_none()

            if not availability:
                raise ValueError(f"Availability does not exist.")

            if availability.is_booked:
                raise ValueError("This availability slot is already booked.")

            appointment_data.update(
                {
                    "coach_id": availability.coach_id,
                    "date": availability.date,
                    "start_time": availability.start_time,
                    "end_time": availability.end_time,
                }
            )

            query = (
                insert(Appointment).values(**appointment_data).returning(Appointment)
            )
            result = await session.execute(query)

            availability.is_booked = True
            session.add(availability)

            await session.commit()
            return result.scalar_one()

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
            return {
                "message": f"Appointment with ID {appointment_id} has been deleted."
            }
