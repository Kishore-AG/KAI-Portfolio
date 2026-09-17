import json
import urllib.request
import logging

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

    if not settings.RESEND_API_KEY:
        raise HTTPException(status_code=503, detail="Email delivery is not configured")

    url = "https://api.resend.com/emails"
    
    # Resend testing domains use onboarding@resend.dev and can only send TO your registered email
    payload = {
        "from": "onboarding@resend.dev",
        "to": [recipient],
        "reply_to": contact.email,
        "subject": f"Portfolio contact from {contact.name}",
        "text": f"Name: {contact.name}\nEmail: {contact.email}\n\n{contact.message}"
    }

    data = json.dumps(payload).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    })

    try:
        with urllib.request.urlopen(req) as response:
            if response.status not in (200, 201):
                raise HTTPException(status_code=502, detail="Email could not be delivered")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        logger.error(f"Resend API HTTPError 403/4xx: {error_body}")
        raise HTTPException(status_code=502, detail="Email could not be delivered (Check Render Logs for Resend Error)")
    except Exception as e:
        logger.exception("Contact email delivery failed")
        raise HTTPException(status_code=502, detail="Email could not be delivered")

    return {"message": "Your message was sent successfully"}