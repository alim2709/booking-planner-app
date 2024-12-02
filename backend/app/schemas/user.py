from pydantic import BaseModel, EmailStr, Field, model_validator

USERNAME_MAX_LENGTH = 20
EMAIL_MAX_LENGTH = 50
PASSWORD_MIN_LENGTH = 8


class SUserCreateModel(BaseModel):
    username: str = Field(max_length=20)
    email: EmailStr = Field(max_length=50)
    password: str = Field(min_length=8)


class SUserModel(BaseModel):
    username: str
    email: EmailStr
