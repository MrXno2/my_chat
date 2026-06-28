from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exception import GroupAlreadyExists, GroupNotFound, InvalidPassword, UserAlreadyInGroup, UserBannedInGroup
from app.schemas.common import PaginationParams
from app.schemas.group import GroupMemberResponse, GroupSchema
from app.repositories.group import GroupRepository
from app.core.security import verify_password


class GroupService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.group_repository = GroupRepository(db)

    async def create_group(self, group_data: GroupSchema, user_id: str) -> None:
        group_orm = await self.group_repository.create_group(group_data=group_data, user_id=int(user_id))
        await self.group_repository.add_user_in_group(group_id=group_orm.id, user_id=int(user_id))
        await self.group_repository.safe_commit(GroupAlreadyExists)

    async def connect_group(self, group_data: GroupSchema, user_id: str) -> None:
        group_orm = await self.group_repository.get_group_data(group_data.name)
        if not group_orm:
            raise GroupNotFound()
        user_orm_in_group = await self.group_repository.get_user_in_group(group_orm.id, int(user_id))
        if user_orm_in_group:
            if user_orm_in_group.banned:
                raise UserBannedInGroup()
            else:
                raise UserAlreadyInGroup()
        if not verify_password(group_data.password, group_orm.password_hash):
            raise InvalidPassword()
        await self.group_repository.add_user_in_group(group_orm.id, int(user_id))
        await self.group_repository.safe_commit(UserAlreadyInGroup)
        
    async def get_group(
        self, user_id: str, pagination: PaginationParams
    ) -> list[GroupMemberResponse]:
        group_orm = await self.group_repository.get_group(int(user_id), pagination)
        return [GroupMemberResponse(id=group.id, name=group.name) for group in group_orm]
