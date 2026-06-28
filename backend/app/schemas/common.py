from typing import Annotated, Optional
from fastapi import Depends
from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    limit: int = Field(5, ge=0, le=100, description="Кол-во элементов")
    offset: int = Field(0, ge=0, description="Смещение по пагинации")

PaginationDep = Annotated[PaginationParams, Depends(PaginationParams)]


class ChatPaginationParams(PaginationParams):
    group_id: Optional[str] = Field(None, description="Поисковая строка")  # ← необязательное

ChatPaginationDep = Annotated[ChatPaginationParams, Depends(ChatPaginationParams)]



