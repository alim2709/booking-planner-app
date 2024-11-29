
from app.database import async_session_maker
from sqlalchemy import select
from app.models.availabilities import Availability

class AvailabilityDB:
    def __init__(self, session = async_session_maker):
        self.session = session
    
    
    async def get_availabilities(self):
        async with self.session() as session:
            result = await session.execute(select(Availability))
        
            return result.all()