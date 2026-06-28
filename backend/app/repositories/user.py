from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.users import UserORM
from app.schemas.user import AuthSchema
from app.core.security import hashed_pass


class UserRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def check_user(self, user_name: str) -> UserORM | None:
        result = await self.db.execute(select(UserORM).where(UserORM.login == user_name))
        return result.scalar_one_or_none()

    async def create_user(self, user_data: AuthSchema) -> int:
        new_user = UserORM(login=user_data.login, password_hash=hashed_pass(user_data.password))
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user.id
    
    async def get_user(self, user_id: int) -> UserORM:
        result = await self.db.execute(select(UserORM).where(UserORM.id == user_id))
        return result.scalar_one_or_none()
