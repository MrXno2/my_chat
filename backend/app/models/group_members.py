from datetime import datetime
from sqlalchemy import TIMESTAMP, Boolean, ForeignKey, Integer, func
from app.models.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class GroupMemeberORM(Base):
    __tablename__ = "group_members"

    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('groups.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    joined_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.now(),
        nullable=False
    )
    banned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)