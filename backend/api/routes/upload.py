from fastapi import APIRouter, UploadFile, File

from services.cloudinary_service import (
    upload_image,
    upload_pdf,
)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...)
):

    image_url = upload_image(
        file,
        "avatar"
    )

    return {
        "avatar": image_url
    }

@router.post("/project")
async def upload_project_image(
    file: UploadFile = File(...)
):

    image_url = upload_image(
        file,
        "projects"
    )

    return {
        "image": image_url
    }

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    if file.content_type != "application/pdf":
        return {
            "error": "Only PDF files are allowed."
        }

    pdf = upload_pdf(
        file,
        "resumes"
    )

    return {
        "resume": pdf["url"],
        "public_id": pdf["public_id"]
    }
