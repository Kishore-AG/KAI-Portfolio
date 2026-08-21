import cloudinary
import cloudinary.uploader
import cloudinary.utils

from core.config import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


def upload_image(file, folder: str):

    result = cloudinary.uploader.upload(
        file.file,
        folder=f"KAI-OS/{folder}",
        resource_type="image"
    )

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }


def upload_pdf(file, folder: str):

    print("===== RESUME CLOUDINARY UPLOAD =====")
    print("Filename:", file.filename)
    print("Content type:", file.content_type)

    result = cloudinary.uploader.upload(
        file.file,
        folder=f"KAI-OS/{folder}",
        resource_type="raw",
        public_id="Kishore_resume.pdf",
        overwrite=True
    )

    print("CLOUDINARY RESULT:", result)

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }


def delete_raw_file(public_id: str):

    return cloudinary.uploader.destroy(
        public_id,
        resource_type="raw"
    )


def get_resume_download_url(public_id: str):

    return cloudinary.utils.cloudinary_url(
        public_id,
        resource_type="raw",
        type="upload",
        secure=True,
        flags=["attachment:Kishore_resume"]
    )[0]
