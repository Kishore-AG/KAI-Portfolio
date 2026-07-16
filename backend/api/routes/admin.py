from fastapi import APIRouter, Depends

from core.security import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/me")
def read_current_admin(
    admin=Depends(get_current_admin)
):
    return {
        "id": admin.id,
        "username": admin.username
    }