from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import auth
from app.repositories.base import BaseRepository
from app.models.group_members import GroupMemeberORM
from app.repositories.group import GroupRepository
from app.schemas.common import ChatPaginationDep, ChatPaginationParams, PaginationDep, PaginationParams
from app.models.messages import MessageORM
from app.repositories.user import UserRepository

from app.models.users import UserORM
from app.db.session import get_db
from app.core.exception import UserBannedInGroup, UserNotFound


router = APIRouter(prefix="/api/chat")


class MessageSchema(BaseModel):
    group_id: str
    message: str


class MessRespSchema(BaseModel):
    user_resp_id: int
    user_id: int
    user_name: str
    content: str


async def get_chat_service(db: AsyncSession = Depends(get_db)):
    return ChatService(db)


class ChatRepositories(BaseRepository):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def load_mess_repo(self, pagination: ChatPaginationParams) -> list[MessageORM]:
        result = await self.db.execute(
            select(MessageORM)
            .where(MessageORM.group_id == int(pagination.group_id))
            .order_by(MessageORM.id.desc())
            .limit(pagination.limit)
            .offset(pagination.offset)
        )
        return result.scalars().all()
    
    async def save_mess_repo(self, user_orm: UserORM, mess_data: MessageSchema) -> None:
        new_mess = MessageORM(
            group_id = int(mess_data.group_id),
            user_id = user_orm.id,
            user_name = user_orm.login,
            content = mess_data.message
        )
        self.db.add(new_mess)

class ChatService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.chat_repo = ChatRepositories(db)
        self.group_repo = GroupRepository(db)
        self.user_repo = UserRepository(db)

    async def save_mess(self, user_id: str, mess_data: MessageSchema) -> None:
        is_user_in_group = await self.check_user(group_id=int(mess_data.group_id), user_id=int(user_id))
        if not is_user_in_group:
            raise UserBannedInGroup()
        user_orm = await self.user_repo.get_user(int(user_id))
        if not user_orm:
            raise UserNotFound()
        await self.chat_repo.save_mess_repo(user_orm=user_orm, mess_data=mess_data)
        await self.chat_repo.safe_commit(Exception)
        

    async def load_mess(self, user_id: str, pagination: ChatPaginationParams) -> list[MessRespSchema]:
        is_user_in_group = await self.check_user(group_id=int(pagination.group_id), user_id=int(user_id))
        if not is_user_in_group:
            raise UserBannedInGroup()
        arr_mess = await self.chat_repo.load_mess_repo(pagination)
        return [
            MessRespSchema(
                user_resp_id = user_id,
                user_id = mess.user_id,
                user_name = mess.user_name,
                content = mess.content
            ) for mess in arr_mess
        ]

        # запрос на то чтобы достать сообщения


    async def check_user(self, group_id: str, user_id: str) -> bool:
        user_in_group = await self.group_repo.get_user_in_group(group_id=int(group_id), user_id=int(user_id))
        if not user_in_group:
            return False # юзера нету в этой группе
        if user_in_group.banned:
            return False # юзер забанен в этой группе
        return True


@router.post("/save")
async def save_message(
    mess_data: MessageSchema,
    chat_service: ChatService = Depends(get_chat_service),
    payload = Depends(auth.access_token_required)
):
    user_id = payload.sub
    await chat_service.save_mess(user_id, mess_data)


@router.get("/load")
async def load_message(
    pagination: ChatPaginationDep,
    chat_service: ChatService = Depends(get_chat_service),
    payload = Depends(auth.access_token_required)
) -> list[MessRespSchema]:
    user_id = payload.sub
    return await chat_service.load_mess(user_id, pagination)