from datetime import datetime
from typing import Optional
from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String, Text, func
from app.models.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class GroupORM(Base):
    __tablename__ = "groups"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False) # использовать название в качестве ссылки / поиска
    password_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    creator_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey('users.id', ondelete='CASCADE'), # связь с юзерами, которая не даст создать того кого в них нету
        nullable=False
    )                             # ondelete= при удалении создателя - удалится группа, при удалении группы - удалятся все сообщешия от нее
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.now(),
        nullable=False
    )