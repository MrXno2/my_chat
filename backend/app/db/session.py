
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(settings.DATABASE_URL) # создает подключение к БД
SessionLocal = sessionmaker(bind=engine) # управление бд

# запрос к бд через это, гарант закрытия
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()