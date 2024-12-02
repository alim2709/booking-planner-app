from app.database import async_session_maker

from sqlalchemy import select

from app.models.appointment import Appointment

class AppointmentDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_appointments(self, filter_data=None):
        async with self.session() as session:
            query = select(Appointment)

            request = await session.execute(query)
            response = request.scalars().all()

            return response
        
    async def create_appointment(self, data):
        async with self.session() as session: 
            appointment = Appointment(**data.model_dump())
            session.add(appointment)
            await session.commit()

            return appointment
        
        
    async def update_appointment(self, data):
        async with self.session() as session:
            appointment = Appointment(**data.model_dump())
            session.merge(appointment)
            await session.commit()

            return appointment
        
    async def delete_appointment(self, data):
        async with self.session() as session:
            appointment = Appointment(**data.model_dump())
            session.delete(appointment)
            await session.commit()

            return appointment