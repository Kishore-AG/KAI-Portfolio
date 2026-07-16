from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from schemas.research import (
    ResearchCreate,
    ResearchUpdate,
    ResearchResponse,
)
from services.research_service import ResearchService

router = APIRouter(
    prefix="/research",
    tags=["Research"]
)


@router.get(
    "/",
    response_model=list[ResearchResponse]
)
def get_research(
    db: Session = Depends(get_db)
):
    return ResearchService.get_all(db)


@router.get(
    "/{research_id}",
    response_model=ResearchResponse
)
def get_research_by_id(
    research_id: int,
    db: Session = Depends(get_db)
):
    research = ResearchService.get_by_id(
        db,
        research_id
    )

    if not research:
        raise HTTPException(
            status_code=404,
            detail="Research not found"
        )

    return research


@router.post(
    "/",
    response_model=ResearchResponse
)
def create_research(
    research: ResearchCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return ResearchService.create(
        db,
        research
    )


@router.put(
    "/{research_id}",
    response_model=ResearchResponse
)
def update_research(
    research_id: int,
    research: ResearchUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    updated = ResearchService.update(
        db,
        research_id,
        research
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Research not found"
        )

    return updated


@router.delete(
    "/{research_id}"
)
def delete_research(
    research_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    deleted = ResearchService.delete(
        db,
        research_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Research not found"
        )

    return {
        "message": "Research deleted successfully"
    }