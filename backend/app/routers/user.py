from fastapi import HTTPException

from fastapi import APIRouter
from app.schemas.user import SUserCreateModel, SUserLoginModel
from app.services.user import UserService

user_router = APIRouter(prefix="/api")


@user_router.post("/signUp")
async def create_user_account(user_data: SUserCreateModel):

    new_user = await UserService.create_user(user_data)

    return {
        "message": "Sign-up successful! Please log in to continue.",
        "username": new_user.username,
        "email": new_user.email,
    }


@user_router.post("/login")
async def login_user(user_login_data: SUserLoginModel):

    response = await UserService.login_user(user_login_data)
    return response
