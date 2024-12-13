from app.database import async_session_maker
from sqlalchemy import select, insert
from app.models.availability import Availability


class AvailabilityDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_availabilities(self, filter_data=None):
        async with self.session() as session:
            query = select(Availability)

            if filter_data:
                filter_data_dict = {
                    key: value
                    for key, value in filter_data.model_dump().items()
                    if value is not None
                }
                for key, value in filter_data_dict.items():
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

    async def create_availability(self, **availability_data):

        async with self.session() as session:
            query = (
                insert(Availability).values(**availability_data).returning(Availability)
            )
            result = await session.execute(query)
            await session.commit()
            return result.scalar_one()

    async def update_availability(self, availability_id, update_data, user):

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

    async def delete_availability(self, availability_id, user):
        async with self.session() as session:
            query = select(Availability).filter(Availability.id == availability_id)
            request = await session.execute(query)
            availability = request.scalars().first()

            if not availability:
                raise ValueError(f"Appointment with id {availability_id} not found.")

            await session.delete(availability)
            await session.commit()
            return {
                "message": f"Appointment with id {availability_id} has been deleted."
            }
