from pydantic import BaseModel, EmailStr, Field, model_validator

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
