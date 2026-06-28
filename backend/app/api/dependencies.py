from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.user import UserService
from app.services.group import GroupService
from app.api.routers.chat import ChatService


async def get_user_service(db: AsyncSession = Depends(get_db)):
    return UserService(db)


async def get_group_service(db: AsyncSession = Depends(get_db)):
    return GroupService(db)

