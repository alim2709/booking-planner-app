from typing import List

from fastapi import Depends

from fastapi import APIRouter

from app.dependencies.user_auth import RefreshTokenBearer, AccessTokenBearer
from app.schemas.user import SUserCreateModel, SUserLoginModel, SUserFilter, SUserList
from app.services.user import UserService


user_router = APIRouter(prefix="/api")
refresh_token_service = RefreshTokenBearer()
access_token_service = AccessTokenBearer()


@user_router.post("/signUp/")
async def create_user_account(user_data: SUserCreateModel):

    new_user = await UserService.create_user(user_data)

    return {
        "message": "Sign-up successful! Please log in to continue.",
        "username": new_user.username,
        "email": new_user.email,
    }


@user_router.post("/login/")
async def login_user(user_login_data: SUserLoginModel):

    response = await UserService.login_user(user_login_data)
    return response


@user_router.get("/refresh-token/")
async def get_new_access_token(token_details: dict = Depends(refresh_token_service)):

    response = await UserService.refresh_token(token_details)

    return response


@user_router.get("/logout/")
async def revoke_token(token_details: dict = Depends(access_token_service)):
    response = await UserService.revoke_token(token_details)

    return response


@user_router.get("/users/", response_model=List[SUserList])
async def get_users(
    filter_data: SUserFilter = Depends(SUserFilter),
    user_details: dict = Depends(access_token_service),
):

    response = await UserService.get_users(filter_data)

    return response
