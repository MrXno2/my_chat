from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.users import UserORM
from app.schemas.user import AuthSchema
from app.core.security import hashed_pass
from app.models.groups import GroupORM
from app.schemas.group import GroupSchema


class GroupRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def check_user(self, user_name: str) -> UserORM | None:
        result = await self.db.execute(select(UserORM).where(UserORM.login == user_name))
        return result.scalar_one_or_none()

    # тута вроде готово
    async def create_group(self, group_data: GroupSchema, user_id: str) -> GroupORM:
        new_group = GroupORM(
            name=group_data.name, 
            password_hash=hashed_pass(group_data.password), 
            creator_id=int(user_id)
        )
        self.db.add(new_group)
        await self.db.commit()
        await self.db.refresh(new_group)
        return new_group