from authx import TokenResponse
from fastapi import APIRouter, Depends, HTTPException, Response

from app.api.dependencies import get_user_service
from app.schemas.user import AuthSchema
from app.core.security import create_token, auth, config as jwt_config
from app.services.user import UserService

router = APIRouter(prefix="/api/auth")

@router.post("/login")
async def login_user(
    user_data: AuthSchema, 
    response: Response, 
    user_service: UserService = Depends(get_user_service)
) -> TokenResponse:
    try:
        token = user_service.user_login(user_data)
        response.set_cookie(jwt_config.JWT_ACCESS_COOKIE_NAME, token.access_token)      # переписать потом на фронт
        response.set_cookie(jwt_config.JWT_REFRESH_COOKIE_NAME, token.refresh_token)    # переписать потом на фронт
    except Exception:
        raise HTTPException(401, detail="Invalid credentials")

    return token  

@router.post("/sign")
def protected(
    user_data: AuthSchema,
    user_service: UserService = Depends(get_user_service)
) -> None:
    user_service.user_sign(user_data)

@router.get("/protected", dependencies=[Depends(auth.access_token_required)])
def protected():
    return {"message": "Hello World"}