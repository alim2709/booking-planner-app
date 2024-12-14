from sqlalchemy import select, insert, or_
from app.database import async_session_maker
from app.models.user import User
from app.utils.enums import UserRole


class UserDB:
    def __init__(self, session=async_session_maker):
        self.session = session

    async def get_user_by_id(self, user_id):
        async with self.session() as session:
            query = select(User).where(User.id == user_id)
            result = await session.execute(query)

            return result.scalar_one_or_none()

    async def get_users(self, filter_data=None):
        async with self.session() as session:
            query = select(User)
            if filter_data:
                filter_data_dict = {
                    key: value
                    for key, value in filter_data.model_dump().items()
                    if value is not None
                }
                for key, value in filter_data_dict.items():
                    query = query.filter(getattr(User, key) == value)

            request = await session.execute(query)
            response = request.scalars().all()

            return response

    async def get_coach_by_id(self, coach_id: int):
        async with self.session() as session:
            query = select(User).where(User.id == coach_id, User.role == UserRole.COACH)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> User:
        async with self.session() as session:
            query = select(User).where(User.email == email)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    async def get_user_by_username(self, username: str) -> User:
        async with self.session() as session:
            query = select(User).where(User.username == username)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    async def create_user(self, **user_data) -> None:
        async with self.session() as session:
            query = insert(User).values(**user_data).returning(User)
            result = await session.execute(query)
            await session.commit()
            return result.scalar_one()
