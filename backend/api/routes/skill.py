from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
)
from services.skill_service import SkillService

router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.get("/", response_model=list[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return SkillService.get_all(db)


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = SkillService.get_by_id(db, skill_id)

    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    return skill


@router.post("/", response_model=SkillResponse)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    return SkillService.create(db, skill)


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    updated = SkillService.update(db, skill_id, skill)

    if updated is None:
        raise HTTPException(status_code=404, detail="Skill not found")

    return updated


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    deleted = SkillService.delete(db, skill_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Skill not found")

    return {
        "message": "Skill deleted successfully"
    }