import os
import shutil

from fastapi import APIRouter, UploadFile, File

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "uploads/avatar"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...)
):

    extension = file.filename.split(".")[-1]

    filename = f"avatar.{extension}"

    filepath = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {

        "avatar":

        f"http://127.0.0.1:8000/uploads/avatar/{filename}"

    }

@router.post("/project")
async def upload_project_image(
    file: UploadFile = File(...)
):

    upload_dir = "uploads/projects"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    extension = file.filename.split(".")[-1]

    filename = file.filename.replace(" ", "_")

    filepath = os.path.join(
        upload_dir,
        filename
    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {

        "image":

        f"http://127.0.0.1:8000/uploads/projects/{filename}"

    }
