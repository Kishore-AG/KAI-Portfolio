import cloudinary
import cloudinary.uploader

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

    return result["secure_url"]


def upload_pdf(file, folder: str):

    result = cloudinary.uploader.upload(
        file.file,
        folder=f"KAI-OS/{folder}",
        resource_type="raw"
    )

    return result["secure_url"]