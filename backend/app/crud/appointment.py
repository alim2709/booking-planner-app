from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.database import async_session_maker
from app.models.appointment import Appointment


class AppointmentDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_appointments(self, filter_data=None):
        """
        Retrieve all appointments, optionally filtered by specific criteria.
        :param filter_data: Dict containing filter criteria (e.g., {'coach_id': 1})
        """
        async with self.session() as session:
            query = select(Appointment)

            if filter_data:
                for key, value in filter_data.items():
                    query = query.filter(getattr(Appointment, key) == value)

            request = await session.execute(query)
            response = request.scalars().all()
            return response

    async def create_appointment(self, data):
        """
        Create a new appointment and save it to the database.
        :param data: Appointment data
        """
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
        """
        Update an existing appointment.
        :param appointment_id: ID of the appointment to update
        :param update_data: Dict containing fields to update
        """
        async with self.session() as session:
            query = select(Appointment).filter(Appointment.id == appointment_id)
            request = await session.execute(query)
            appointment = request.scalars().first()

            if not appointment:
                raise ValueError(f"Appointment with id {appointment_id} not found.")

            # Apply updates dynamically
            for key, value in update_data.items():
                setattr(appointment, key, value)

            await session.commit()
            await session.refresh(appointment)  
            return appointment

    async def delete_appointment(self, appointment_id):
        """
        Delete an existing appointment by ID.
        :param appointment_id: ID of the appointment to delete
        """
        async with self.session() as session:
            query = select(Appointment).filter(Appointment.id == appointment_id)
            request = await session.execute(query)
            appointment = request.scalars().first()

            if not appointment:
                raise ValueError(f"Appointment with id {appointment_id} not found.")

            await session.delete(appointment)
            await session.commit()
            return {"message": f"Appointment with id {appointment_id} has been deleted."}
