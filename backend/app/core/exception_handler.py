import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import app.core.exception as custom_exception


logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(custom_exception.UserNotFound)
    async def user_not_found_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=404,
            content={"detail": "User not found"},
        )

    @app.exception_handler(custom_exception.UserInvalidPass)
    async def user_invalid_pass_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid password"},
        )
    
    @app.exception_handler(custom_exception.UserAlreadyExists)
    async def user_already_exists_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=409,
            content={"detail": "User already exists"},
        )