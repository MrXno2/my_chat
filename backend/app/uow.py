from sqlalchemy.ext.asyncio import AsyncSession

from app.api.routers.group import GroupRepository
from app.repositories.user import UserRepository


class UnitOfWork:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.groups = GroupRepository(db)
        self.users = UserRepository(db)

    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()    