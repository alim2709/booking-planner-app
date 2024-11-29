from app.database import async_session_maker

from sqlalchemy import select

from app.models.availability import Availability


class AvailabilityDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_availabilities(self, filter_data=None):
        async with self.session() as session:
            query = select(Availability)

            request = await session.execute(query)
            response = request.scalars().all()

            return response
