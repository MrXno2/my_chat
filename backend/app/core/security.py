from authx import AuthX, AuthXConfig, TokenResponse
import bcrypt
from app.core.config import settings

config = AuthXConfig(
    JWT_SECRET_KEY=settings.JWT_SECRET_KEY,
    JWT_ACCESS_COOKIE_NAME="access_token",
    JWT_ACCESS_TOKEN_EXPIRES=3600,
    JWT_REFRESH_COOKIE_NAME="refresh_token",
    JWT_REFRESH_TOKEN_EXPIRES=604800,
    JWT_TOKEN_LOCATION=["cookies"],
)

auth = AuthX(config=config)

# функция которая принимает id юзера и делает из него JWT токены
def create_token(id_user: int) -> TokenResponse:
    access_token = auth.create_access_token(uid=str(id_user))
    refresh_token = auth.create_refresh_token(uid=str(id_user))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)

# хэширует пароль
def hashed_pass(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    hashed_pass = bcrypt.hashpw(password, salt)
    return hashed_pass