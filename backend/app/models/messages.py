from datetime import datetime
from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String, Text, func
from app.models.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class MessageORM(Base):
    __tablename__ = 'messages'

    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('groups.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False
    )
    user_name: Mapped[str] = mapped_column(String(50), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.now(),
        nullable=False
    )