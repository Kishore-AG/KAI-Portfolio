from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from schemas.kai_knowledge import (
    KAIKnowledgeCreate,
    KAIKnowledgeUpdate,
    KAIKnowledgeResponse,
)
from services.kai_knowledge_service import KAIKnowledgeService

router = APIRouter(
    prefix="/kai-knowledge",
    tags=["KAI Knowledge"]
)


@router.get("/", response_model=list[KAIKnowledgeResponse])
def get_knowledge(db: Session = Depends(get_db)):
    return KAIKnowledgeService.get_all(db)


@router.get("/{knowledge_id}", response_model=KAIKnowledgeResponse)
def get_knowledge_by_id(
    knowledge_id: int,
    db: Session = Depends(get_db)
):
    knowledge = KAIKnowledgeService.get_by_id(db, knowledge_id)

    if not knowledge:
        raise HTTPException(
            status_code=404,
            detail="Knowledge not found"
        )

    return knowledge


@router.post("/", response_model=KAIKnowledgeResponse)
def create_knowledge(
    knowledge: KAIKnowledgeCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return KAIKnowledgeService.create(db, knowledge)


@router.put("/{knowledge_id}", response_model=KAIKnowledgeResponse)
def update_knowledge(
    knowledge_id: int,
    knowledge: KAIKnowledgeUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    updated = KAIKnowledgeService.update(
        db,
        knowledge_id,
        knowledge
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge not found"
        )

    return updated


@router.delete("/{knowledge_id}")
def delete_knowledge(
    knowledge_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    deleted = KAIKnowledgeService.delete(
        db,
        knowledge_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Knowledge not found"
        )

    return {
        "message": "Knowledge deleted successfully"
    }