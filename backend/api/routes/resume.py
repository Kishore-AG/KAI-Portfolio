import os
import shutil
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from repositories.resume_repository import ResumeRepository

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

# Upload directory
UPLOAD_DIR = Path("uploads/resume")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Fixed filename (only one active resume)
RESUME_FILENAME = "resume.pdf"


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    # Accept only PDF files
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = UPLOAD_DIR / RESUME_FILENAME

    # Delete old resume if it exists
    if file_path.exists():
        os.remove(file_path)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = file_path.stat().st_size

    resume_data = {
        "file_name": RESUME_FILENAME,
        "file_path": str(file_path),
        "file_size": file_size,
        "version": "1.0"
    }

    existing_resume = ResumeRepository.get_resume(db)

    if existing_resume:
        ResumeRepository.update(
            db,
            existing_resume,
            resume_data
        )

        return {
            "message": "Resume updated successfully.",
            "file_name": RESUME_FILENAME,
            "file_size": file_size
        }

    ResumeRepository.create(
        db,
        resume_data
    )

    return {
        "message": "Resume uploaded successfully.",
        "file_name": RESUME_FILENAME,
        "file_size": file_size
    }


@router.get("/")
def get_resume(db: Session = Depends(get_db)):
    resume = ResumeRepository.get_resume(db)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    return resume


@router.get("/download")
def download_resume(db: Session = Depends(get_db)):
    resume = ResumeRepository.get_resume(db)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    file_path = Path(resume.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume file is missing."
        )

    return FileResponse(
        path=file_path,
        filename=resume.file_name,
        media_type="application/pdf"
    )


@router.delete("/")
def delete_resume(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    resume = ResumeRepository.get_resume(db)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    file_path = Path(resume.file_path)

    if file_path.exists():
        os.remove(file_path)

    ResumeRepository.delete(
        db,
        resume
    )

    return {
        "message": "Resume deleted successfully."
    }