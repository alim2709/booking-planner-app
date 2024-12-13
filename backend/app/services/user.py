from datetime import timedelta, datetime, timezone

from app.config import settings
from app.crud.user import UserDB
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

from app.redis import add_jti_to_blocklist
from app.utils.authentication import (
    get_password_hash,
    validate_password,
    verify_password,
    create_access_token,
)

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

    @classmethod
    async def login_user(cls, user_login_data):

        email = user_login_data.email
        password = user_login_data.password

        user = await crud_user.get_user_by_email(email=email)
        if user:
            password_valid = verify_password(password, user.hashed_password)

            if password_valid:
                access_token = create_access_token(
                    user_data={
                        "email": user.email,
                        "username": user.username,
                        "role": user.role.value,
                        "id": str(user.id),
                    }
                )

                refresh_token = create_access_token(
                    user_data={
                        "email": user.email,
                        "username": user.username,
                        "role": user.role.value,
                        "id": str(user.id),
                    },
                    refresh=True,
                    expire=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
                )

                return JSONResponse(
                    content={
                        "message": "You are now logged in",
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                    }
                )
            else:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "message": "Invalid password",
                    },
                )
        else:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "message": "Invalid email",
                },
            )

    @classmethod
    async def refresh_token(cls, token_details):
        expiry_timestamp = token_details["exp"]
        expiry_datetime = datetime.fromtimestamp(expiry_timestamp, tz=timezone.utc)

        if expiry_datetime > datetime.now(timezone.utc):
            new_access_token = create_access_token(user_data=token_details["user"])

            refresh_token = create_access_token(
                user_data=token_details["user"],
                refresh=True,
                expire=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            )

            return JSONResponse(
                content={
                    "access_token": new_access_token,
                    "refresh_token": refresh_token,
                }
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Token invalid or expired"
        )

    @classmethod
    async def revoke_token(cls, token_details):

        jti = token_details["jti"]

        await add_jti_to_blocklist(jti)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Logged out successfully",
            },
        )

    @classmethod
    async def get_users(cls, filter_data=None):
        result = await crud_user.get_users(filter_data=filter_data)

        if not result:
            raise HTTPException(status_code=404, detail="No users found")
        return result
