from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.profile import (
    ProfileCreate,
    ProfileResponse,
    ProfileUpdate
)
from services.profile_service import ProfileService
from core.security import get_current_admin

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get(
    "/",
    response_model=ProfileResponse
)
def get_profile(
    db: Session = Depends(get_db)
):
    profile = ProfileService.get_profile(db)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile


@router.post(
    "/",
    response_model=ProfileResponse
)
def create_or_update_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return ProfileService.save_profile(
        db,
        profile
    )


@router.put(
    "/",
    response_model=ProfileResponse
)
def update_profile(
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    updated = ProfileService.update_profile(
        db,
        profile
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return updated