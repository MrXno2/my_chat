from pydantic import BaseModel


class GroupSchema(BaseModel):
    name: str
    password: str