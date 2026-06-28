from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.models.base import Base
from app.db.session import engine
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers.auth import router as router_auth
from app.core.security import auth
from app.core.exception_handler import register_exception_handlers
from app.api.routers.group import router as router_group
from app.api.routers.chat import router as router_chat

@asynccontextmanager # при входе делает до yield, при выходе после, нужен для отработки при старте/запуске
async def lifespan(_: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("START my_chat/backend")
    yield
    print("STOP my_chat/backend")

app = FastAPI(lifespan=lifespan)

auth.handle_errors(app)

register_exception_handlers(app)

app.include_router(router_auth)                 # роутер авторизации
app.include_router(router_group)
app.include_router(router_chat)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,  # Каким сайтам разрешено, домены / IP
    allow_methods=["*"],                          # Какие методы разрешены, CRUD запросы точнее
    allow_headers=["*"],                          # Какие заголовки разрешены, CRUD запросов
    allow_credentials=True,                       # Можно ли передавать куки/токены
    expose_headers=["*"],                         # Какие заголовки видны фронту
    max_age=600,                                  # Как долго кешировать CORS (в секундах)
)                                                 # "*" разрешить все варианты