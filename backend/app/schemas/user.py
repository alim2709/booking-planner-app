from pydantic import BaseModel, EmailStr, Field, model_validator


class SUserCreateModel(BaseModel):
    username: str = Field(max_length=20)
    email: EmailStr = Field(max_length=50)
    password: str = Field(min_length=8)


class SUserModel(BaseModel):
    username: str
    email: EmailStr
