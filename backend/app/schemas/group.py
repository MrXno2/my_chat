from pydantic import BaseModel, Field


class GroupSchema(BaseModel):
    name: str = Field(min_length=4, description="Login cannot be empty")
    password: str = Field(min_length=6, description="Password must be at least 6 characters")


class GroupMemberResponse(BaseModel):
    id: int
    name: str
