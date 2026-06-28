from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.user import UserService
from app.services.group import GroupService


async def get_user_service(db: AsyncSession = Depends(get_db)):
    return UserService(db)