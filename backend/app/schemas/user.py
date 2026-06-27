from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserSchema(BaseModel):
    id: int
    login: str
    about: str | None
    created_at: datetime


class AuthSchema(BaseModel):
    login: str = Field(min_length=4, description="Login cannot be empty")
    password: str = Field(min_length=6, description="Password must be at least 6 characters")