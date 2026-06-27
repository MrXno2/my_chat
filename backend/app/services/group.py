from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.group import GroupRepository
from app.schemas.group import GroupSchema


class GroupService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.group_repository = GroupRepository(db)

    async def create_group_service(self, group_data: GroupSchema, user_id: str) -> None:
        group_orm = await self.group_repository.create_group(group_data=group_data, user_id=user_id)
        """
        if not user_orm:
            raise UserNotFound()
        if verify_password(user_data.password, user_orm.password_hash):
            return create_token(user_orm.id)
        else:
            raise UserInvalidPass()
        """

    async def connect_group_service(self, group_data: GroupSchema) -> None:
        """
        try:
            group_orm = await self.user_repository.create_user(user_data)
        except IntegrityError:
            raise UserAlreadyExists()
        return create_token(user_id)
        """