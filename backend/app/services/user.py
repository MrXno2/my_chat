from authx import TokenResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.repositories.user import UserRepository
from app.core.security import create_token, verify_password
from app.schemas.user import AuthSchema
from app.core.exception import InvalidPassword, UserNotFound, UserAlreadyExists


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.user_repository = UserRepository(db)

    async def user_login(self, user_data: AuthSchema) -> TokenResponse:
        user_orm = await self.user_repository.check_user(user_name=user_data.login)
        if not user_orm:
            raise UserNotFound()
        if verify_password(user_data.password, user_orm.password_hash):
            return create_token(user_orm.id)
        else:
            raise InvalidPassword()

    async def user_sign(self, user_data: AuthSchema) -> TokenResponse:
        try:
            user_id = await self.user_repository.create_user(user_data)
        except IntegrityError:
            raise UserAlreadyExists()
        return create_token(user_id)
