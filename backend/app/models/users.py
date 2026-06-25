from datetime import datetime
from typing import Optional
from sqlalchemy.sql import func # нынешнее время, в нем now()
from sqlalchemy import TIMESTAMP, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class UserORM(Base):
    __tablename__ = "users"

    login: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    about: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.now(), 
        nullable=False
    )