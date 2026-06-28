from fastapi import APIRouter, Depends
from app.core.security import auth
from app.schemas.common import PaginationDep
from app.schemas.group import GroupMemberResponse, GroupSchema
from app.services.group import GroupService
from app.api.dependencies import get_group_service


router = APIRouter(prefix="/api/group")


@router.post("/create")
async def create_group(
    group_data: GroupSchema,
    group_service: GroupService = Depends(get_group_service),
    payload = Depends(auth.access_token_required)
) -> None:
    user_id = payload.sub
    await group_service.create_group(group_data, user_id)


@router.post("/connect")
async def connect_group(
    group_data: GroupSchema,
    group_service: GroupService = Depends(get_group_service),
    payload = Depends(auth.access_token_required)
) -> None:
    user_id = payload.sub
    await group_service.connect_group(group_data, user_id)


@router.get("/get")
async def get_group(
    pagination: PaginationDep, 
    group_service: GroupService = Depends(get_group_service),
    payload = Depends(auth.access_token_required)
) -> list[GroupMemberResponse]:
    user_id = payload.sub
    return await group_service.get_group(user_id, pagination)




