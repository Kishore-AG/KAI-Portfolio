from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from core.security import get_current_admin
from database.session import get_db
from repositories.resume_repository import ResumeRepository
from services.cloudinary_service import (
    upload_pdf,
    delete_raw_file,
)
from fastapi.responses import RedirectResponse

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    # Only PDF files
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Upload PDF to Cloudinary
    cloudinary_file = upload_pdf(
        file,
        "resume"
    )

    file_url = cloudinary_file["url"]
    public_id = cloudinary_file["public_id"]

    # Determine file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    resume_data = {
        "file_name": file.filename or "resume.pdf",
        "file_path": file_url,
        "file_size": file_size,
        "version": "1.0",
        "public_id": public_id,
    }

    existing_resume = ResumeRepository.get_resume(db)

    if existing_resume:

        # Delete previous PDF from Cloudinary
        old_public_id = existing_resume.public_id

        if old_public_id:
            try:
                delete_raw_file(old_public_id)
            except Exception:
                pass

        ResumeRepository.update(
            db,
            existing_resume,
            resume_data
        )

        return {
            "message": "Resume updated successfully.",
            "file_name": resume_data["file_name"],
            "file_size": file_size,
            "file_url": file_url,
        }

    ResumeRepository.create(
        db,
        resume_data
    )

    return {
        "message": "Resume uploaded successfully.",
        "file_name": resume_data["file_name"],
        "file_size": file_size,
        "file_url": file_url,
    }


@router.get("/")
def get_resume(
    db: Session = Depends(get_db)
):
    resume = ResumeRepository.get_resume(db)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    return resume


@router.get("/download")
def download_resume(
    db: Session = Depends(get_db)
):
    resume = ResumeRepository.get_resume(db)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    if not resume.file_path:
        raise HTTPException(
            status_code=404,
            detail="Resume file is missing."
        )

    download_url = resume.file_path.replace(
        "/raw/upload/",
        "/raw/upload/fl_attachment:Kishore_resume.pdf/"
    )

    return RedirectResponse(
        url=download_url,
        status_code=302
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

    # Delete from Cloudinary
    if resume.public_id:
        try:
            delete_raw_file(resume.public_id)
        except Exception:
            pass

    ResumeRepository.delete(
        db,
        resume
    )

    return {
        "message": "Resume deleted successfully."
    }
