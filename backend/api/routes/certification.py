from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from schemas.certification import (
    CertificationCreate,
    CertificationUpdate,
    CertificationResponse,
)
from services.certification_service import CertificationService

router = APIRouter(
    prefix="/certifications",
    tags=["Certifications"]
)


@router.get("/", response_model=list[CertificationResponse])
def get_certifications(db: Session = Depends(get_db)):
    return CertificationService.get_all(db)


@router.get("/{certification_id}", response_model=CertificationResponse)
def get_certification(
    certification_id: int,
    db: Session = Depends(get_db)
):
    certification = CertificationService.get_by_id(
        db,
        certification_id
    )

    if not certification:
        raise HTTPException(
            status_code=404,
            detail="Certification not found"
        )

    return certification


@router.post("/", response_model=CertificationResponse)
def create_certification(
    certification: CertificationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return CertificationService.create(
        db,
        certification
    )


@router.put("/{certification_id}", response_model=CertificationResponse)
def update_certification(
    certification_id: int,
    certification: CertificationUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    updated = CertificationService.update(
        db,
        certification_id,
        certification
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Certification not found"
        )

    return updated


@router.delete("/{certification_id}")
def delete_certification(
    certification_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    deleted = CertificationService.delete(
        db,
        certification_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Certification not found"
        )

    return {
        "message": "Certification deleted successfully"
    }