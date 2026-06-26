from authx import TokenResponse
import bcrypt
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.user import UserRepository
from app.core.security import create_token
from app.schemas.user import AuthSchema


class UserService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repository = UserRepository(db)

    def user_login(self, user_data: AuthSchema) -> TokenResponse:
        user_orm = self.user_repository.check_user(user_name = user_data.login)
        if not user_orm:
            raise # юзер не найден
        if bcrypt.checkpw(user_data.password, user_orm.password_hash):
            return create_token(user_orm.id)
        else:
            print("пароль хуйня")
        
    def user_sign(self, user_data: AuthSchema) -> None:
        try:
            user_orm = self.user_repository.create_user(user_data)
        except Exception:
            raise HTTPException(409, "User with this login already exists")