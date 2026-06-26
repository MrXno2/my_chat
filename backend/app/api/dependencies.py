from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.user import UserService


def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)