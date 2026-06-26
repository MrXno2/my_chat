from sqlalchemy.orm import Session
from app.models.users import UserORM
from app.schemas.user import AuthSchema
from app.core.security import hashed_pass
from sqlalchemy.exc import IntegrityError


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def check_user(self, user_name: str) -> UserORM:
        return self.db.query(UserORM).filter(UserORM.login == user_name).first()
    
    def create_user(self, user_data: AuthSchema) -> int:
        new_user = UserORM(login=user_data.login, password_hash=hashed_pass(user_data.password))
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user.id