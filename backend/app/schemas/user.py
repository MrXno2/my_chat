from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserSchema(BaseModel):
    id: int
    login: str
    about: str | None
    created_at: datetime


class AuthSchema(BaseModel):
    login: str
    password: str