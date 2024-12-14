from typing import Optional

from pydantic import BaseModel, EmailStr, Field
from app.utils.enums import UserRole

USERNAME_MAX_LENGTH = 20
EMAIL_MAX_LENGTH = 50
PASSWORD_MIN_LENGTH = 8


class SUserCreateModel(BaseModel):
    username: str = Field(max_length=USERNAME_MAX_LENGTH)
    email: EmailStr = Field(max_length=EMAIL_MAX_LENGTH)
    password: str = Field(min_length=PASSWORD_MIN_LENGTH)


class SUserModel(BaseModel):
    username: str
    email: EmailStr


class SUserLoginModel(BaseModel):
    email: EmailStr = Field(max_length=EMAIL_MAX_LENGTH)
    password: str = Field(min_length=PASSWORD_MIN_LENGTH)


class SUserFilter(BaseModel):
    role: Optional[UserRole] = None


class SUserList(BaseModel):
    id: int
    username: str
    email: EmailStr
    bio: Optional[str] = ""
    role: UserRole
