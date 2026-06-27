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
            content={
                "message": "User not found.",
                "error_type": "UserNotFound"
            }
        )

    @app.exception_handler(custom_exception.InvalidPassword)
    async def invalid_passwprd_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=401,
            content={
                "message": "Invalid password.",
                "error_type": "InvalidPassword"
            }
        )
    
    @app.exception_handler(custom_exception.UserAlreadyExists)
    async def user_already_exists_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=409,
            content={
                "message": "User already exists.",
                "error_type": "UserAlreadyExists"
            }
        )
    
    @app.exception_handler(custom_exception.GroupAlreadyExists)
    async def group_already_exists_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=409,
            content={
                "message": "Group already exists.",
                "error_type": "GroupAlreadyExists"
            }
        )
    
    @app.exception_handler(custom_exception.GroupNotFound)
    async def group_not_found_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=404,
            content={
                "message": "Group not found.",
                "error_type": "GroupNotFound"
            }
        )
    
    @app.exception_handler(custom_exception.UserBannedInGroup)
    async def user_banned_in_group_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=403,
            content={
                "message": "User banned in group.",
                "error_type": "UserBannedInGroup"
            }
        )

    @app.exception_handler(custom_exception.UserAlreadyInGroup)
    async def user_already_in_group_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=403,
            content={
                "message": "User already in group.",
                "error_type": "UserAlreadyInGroup"
            }
        )
