from app.crud.user import UserDB
from fastapi import HTTPException, status

from app.utils.authentication import get_password_hash, validate_password

crud_user = UserDB()


class UserService:
    @classmethod
    async def create_user(cls, user_data):
        email = user_data.email
        username = user_data.username

        # Check for email uniqueness
        exist_user_by_email = await crud_user.get_user_by_email(email=email)
        if exist_user_by_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered.",
            )

        # Check for username uniqueness
        exist_user_by_username = await crud_user.get_user_by_username(username=username)
        if exist_user_by_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username is already taken.",
            )

        try:
            validate_password(password=user_data.password)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

        hashed_password = get_password_hash(user_data.password)

        new_user = await crud_user.create_user(
            email=email, hashed_password=hashed_password, username=user_data.username
        )

        return new_user
