from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError


class BaseRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def safe_commit(self, error_cls):
        try:
            await self.db.commit()
        except IntegrityError:
            await self.db.rollback()
            raise error_cls()