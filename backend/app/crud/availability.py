from app.database import async_session_maker
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.models.availability import Availability

class AvailabilityDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_availabilities(self, filter_data=None):
        async with self.session() as session:
            query = select(Availability)
            
            if filter_data:
                for key, value in filter_data.items():
                    query = query.filter(getattr(Availability, key) == value)
            
            request = await session.execute(query)
            response = request.scalars().all()

            return response
    
    async def get_availability(self, availability_id):
        async with self.session() as session:
            query = select(Availability).filter(Availability.id == availability_id)
            request = await session.execute(query)
            response = request.scalars().first()

            return response
        
    async def create_availability(self, data):
        async with self.session() as session: 
            try:
                availability = Availability(**data.model_dump())
                session.add(availability)
                await session.commit()
                await session.refresh(availability)  
                return availability
            except IntegrityError as e:
                await session.rollback()
                raise ValueError(f"Failed to create availability: {str(e)}")
        
    async def update_availability(self, availability_id, update_data):
        async with self.session() as session:
            query = select(Availability).filter(Availability.id == availability_id)
            request = await session.execute(query)
            availability = request.scalars().first()

            if not availability:
                raise ValueError(f"Availability with id {availability_id} not found.")

            for key, value in update_data.items():
                setattr(availability, key, value)

            await session.commit()
            await session.refresh(availability)
            return availability

    async def delete_availability(self, availability_id):
        async with self.session() as session:
            query = select(Availability).filter(Availability.id == availability_id)
            request = await session.execute(query)
            availability = request.scalars().first()

            if not availability:
                raise ValueError(f"Availability with id {availability_id} not found.")

            session.delete(availability)
            await session.commit()
            return availability