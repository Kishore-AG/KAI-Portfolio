import logging
import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.config import settings
from database.session import get_db
from schemas.contact import ContactRequest
from services.profile_service import ProfileService

router = APIRouter(prefix="/contact", tags=["Contact"])
logger = logging.getLogger(__name__)


@router.post("/")
def send_contact_message(
    contact: ContactRequest,
    db: Session = Depends(get_db)
):
    profile = ProfileService.get_profile(db)
    recipient = profile.email if profile else None

    if not recipient:
        raise HTTPException(status_code=503, detail="Contact recipient is not configured")

    if not all((settings.SMTP_HOST, settings.SMTP_USERNAME, settings.SMTP_PASSWORD)):
        raise HTTPException(status_code=503, detail="Email delivery is not configured")

    message = EmailMessage()
    message["Subject"] = f"Portfolio contact from {contact.name}"
    message["From"] = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
    message["To"] = recipient
    message["Reply-To"] = contact.email
    message.set_content(
        f"Name: {contact.name}\n"
        f"Email: {contact.email}\n\n"
        f"{contact.message}"
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as smtp:
            if settings.SMTP_USE_TLS:
                smtp.starttls()
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            smtp.send_message(message)
    except (OSError, smtplib.SMTPException):
        logger.exception("Contact email delivery failed")
        raise HTTPException(status_code=502, detail="Email could not be delivered")

    return {"message": "Your message was sent successfully"}