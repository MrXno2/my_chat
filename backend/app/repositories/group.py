from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.groups import GroupORM
from app.models.group_members import GroupMemeberORM
from app.schemas.common import PaginationParams
from app.schemas.group import GroupSchema
from app.repositories.base import BaseRepository
from app.core.security import hashed_pass



class GroupRepository(BaseRepository):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    # возвращает первого найденного юзера в группе или НОНЕ
    async def get_user_in_group(self, group_id: int, user_id: int) -> GroupMemeberORM | None:
        result = await self.db.execute(
            select(GroupMemeberORM)
            .where(
                GroupMemeberORM.group_id == group_id,
                GroupMemeberORM.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    # вертает список групп
    async def get_group(self, user_id: int, pagination: PaginationParams) -> list[GroupORM]:
        result = await self.db.execute(
            select(GroupORM)
            .join(GroupMemeberORM, GroupMemeberORM.group_id == GroupORM.id)
            .where(
                GroupMemeberORM.user_id == user_id,
                GroupMemeberORM.banned.is_(False)
            )
            .limit(pagination.limit)
            .offset(pagination.offset)
        )
        return result.scalars().all()

    # добвляем юзера в группу
    async def add_user_in_group(self, group_id: int, user_id: int) -> None:
        new_user_in_group = GroupMemeberORM(
            group_id = group_id,
            user_id = user_id,
        )
        self.db.add(new_user_in_group)
    #   await self.db.commit()
    
    # возвращает первую найденную групппу по имени или НОНЕ
    async def get_group_data(self, group_name: str) -> GroupORM | None:
        result = await self.db.execute(
            select(GroupORM)
            .where(GroupORM.name == group_name)
        )
        return result.scalar_one_or_none()

    # тута вроде готово
    async def create_group(self, group_data: GroupSchema, user_id: int) -> GroupORM:
        new_group = GroupORM(
            name=group_data.name, 
            password_hash=hashed_pass(group_data.password), 
            creator_id=user_id
        )
        self.db.add(new_group)
    #    await self.db.commit()
    #    await self.db.refresh(new_group)
        await self.db.flush()
        return new_group