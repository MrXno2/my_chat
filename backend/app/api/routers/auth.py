from authx import TokenResponse
from fastapi import APIRouter, Depends, HTTPException, Response

from app.schemas.auth import AuthSchema
from app.core.security import create_token, auth, config as jwt_config

router = APIRouter(prefix="/api/auth")

@router.post("/login")
async def login_user(user_data: AuthSchema, response: Response) -> TokenResponse:
    if user_data.login == "user" and user_data.password == 'qwerty':
        id = 123 # глянули в бд нашли ид
        token = create_token(id)
        response.set_cookie(jwt_config.JWT_ACCESS_COOKIE_NAME, token.access_token)      # переписать потом на фронт
        response.set_cookie(jwt_config.JWT_REFRESH_COOKIE_NAME, token.refresh_token)    # переписать потом на фронт
        return token
    raise HTTPException(401, detail="Invalid credentials")

@router.get("/protected", dependencies=[Depends(auth.access_token_required)])
def protected():
    return {"message": "Hello World"}