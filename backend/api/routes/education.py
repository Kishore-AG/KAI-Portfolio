from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from schemas.education import (
    EducationCreate,
    EducationUpdate,
    EducationResponse,
)
from services.education_service import EducationService

router = APIRouter(
    prefix="/education",
    tags=["Education"]
)


@router.get("/", response_model=list[EducationResponse])
def get_education(db: Session = Depends(get_db)):
    return EducationService.get_all(db)


@router.get("/{education_id}", response_model=EducationResponse)
def get_education_by_id(
    education_id: int,
    db: Session = Depends(get_db)
):
    education = EducationService.get_by_id(db, education_id)

    if not education:
        raise HTTPException(
            status_code=404,
            detail="Education not found"
        )

    return education


@router.post("/", response_model=EducationResponse)
def create_education(
    education: EducationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return EducationService.create(db, education)


@router.put("/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: int,
    education: EducationUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    updated = EducationService.update(
        db,
        education_id,
        education
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Education not found"
        )

    return updated


@router.delete("/{education_id}")
def delete_education(
    education_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    deleted = EducationService.delete(
        db,
        education_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Education not found"
        )

    return {
        "message": "Education deleted successfully"
    }