
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


settigs = get_settings() # config
engine = create_engine(settigs.DATABASE_URL) # создает подключение к БД
SessionLocal = sessionmaker(bind=engine) # управление бд

# запрос к бд через это, гарант закрытия
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()