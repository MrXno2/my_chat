from authx import TokenResponse
from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.api.dependencies import get_user_service
from app.schemas.user import AuthSchema
from app.core.security import create_token, auth, config as jwt_config
from app.services.user import UserService
import app.core.exception as custom_exception


router = APIRouter(prefix="/api/auth")

@router.post("/login") # был /login
async def login_user(
    user_data: AuthSchema, 
    response: Response, 
    user_service: UserService = Depends(get_user_service)
) -> TokenResponse:
    token = user_service.user_login(user_data)
    response.set_cookie(jwt_config.JWT_ACCESS_COOKIE_NAME, token.access_token)      # переписать потом на фронт
    response.set_cookie(jwt_config.JWT_REFRESH_COOKIE_NAME, token.refresh_token)    # переписать потом на фронт
    
    return token 


@router.post("/register") # был "/sign"
async def sign_user(
    user_data: AuthSchema,
    response: Response, 
    user_service: UserService = Depends(get_user_service)
) -> TokenResponse:
    token = user_service.user_sign(user_data)
    response.set_cookie(jwt_config.JWT_ACCESS_COOKIE_NAME, token.access_token)      # переписать потом на фронт
    response.set_cookie(jwt_config.JWT_REFRESH_COOKIE_NAME, token.refresh_token)    # переписать потом на фронт
    
    return token


@router.get("/check_user", dependencies=[Depends(auth.access_token_required)]) # был /me
async def protected():
    return {"message": "Hello World"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(jwt_config.JWT_ACCESS_COOKIE_NAME)
    response.delete_cookie(jwt_config.JWT_REFRESH_COOKIE_NAME)
    return {"message": "Logged out"}