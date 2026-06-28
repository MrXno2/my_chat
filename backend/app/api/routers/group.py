from fastapi import APIRouter, Depends, HTTPException
from app.core.security import auth, verify_password
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.users import UserORM
from app.core.security import hashed_pass
from app.models.groups import GroupORM
from pydantic import BaseModel, Field
from app.db.session import get_db
from sqlalchemy.exc import IntegrityError

from app.core.exception import GroupAlreadyExists, GroupNotFound, InvalidPassword, UserAlreadyInGroup, UserBannedInGroup
from app.models.group_members import GroupMemeberORM


class GroupSchema(BaseModel):
    name: str = Field(min_length=4, description="Login cannot be empty")
    password: str = Field(min_length=6, description="Password must be at least 6 characters")


class GroupService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.group_repository = GroupRepository(db)

    async def create_group(self, group_data: GroupSchema, user_id: str) -> None:
        try:
            group_orm = await self.group_repository.create_group(group_data=group_data, user_id=user_id)
        except IntegrityError:
            raise GroupAlreadyExists()

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

        if verify_password(group_data.password, group_orm.password_hash):
            await self.group_repository.add_user_in_group(group_orm.id, int(user_id))
        else:
            raise InvalidPassword()


class GroupRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # возвращает первого найденного юзера в группе или НОНЕ
    async def get_user_in_group(self, group_id: int, user_id: int) -> GroupMemeberORM | None:
        result = await self.db.execute(
            select(GroupMemeberORM)
            .where(
                GroupMemeberORM.group_id == group_id 
                and 
                GroupMemeberORM.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def add_user_in_group(self, group_id: int, user_id: int) -> None:
        new_user_in_group = GroupMemeberORM(
            group_id = group_id,
            user_id = user_id
        )
        self.db.add(new_user_in_group)
        await self.db.commit()
    
    # возвращает первую найденную групппу по имени или НОНЕ
    async def get_group_data(self, group_name: str) -> GroupORM | None:
        result = await self.db.execute(
            select(GroupORM)
            .where(GroupORM.name == group_name)
        )
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



async def get_group_service(db: AsyncSession = Depends(get_db)):
    return GroupService(db)


router = APIRouter(prefix="/api/group")


@router.post("/create")
async def create_group(
    group_data: GroupSchema,
    group_service: GroupService = Depends(get_group_service),
    payload = Depends(auth.access_token_required)
) -> None:
    user_id = payload.sub
    await group_service.create_group(group_data, user_id)


@router.post("/connect")
async def connect_group(
    group_data: GroupSchema,
    group_service: GroupService = Depends(get_group_service),
    payload = Depends(auth.access_token_required)
) -> None:
    user_id = payload.sub
    await group_service.connect_group(group_data, user_id)


@router.get("")
async def get_group():
    pass


@router.delete("")
async def delete_group():
    pass




"""
если токен просрочен выкинет статус 422
{
  "message": "Token has expired",
  "error_type": "TokenExpiredError"
}
если токена нет выкинет статус 401
{
  "message": "Token Error",
  "error_type": "MissingTokenError"
}
"""