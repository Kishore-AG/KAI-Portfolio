from pydantic import BaseModel, ConfigDict


class CertificationBase(BaseModel):
    title: str

    issuer: str

    issue_year: int

    credential_id: str | None = None

    certificate_url: str | None = None

    certificate_image: str | None = None

    verified: bool = True

    display_order: int = 0


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(CertificationBase):
    pass


class CertificationResponse(CertificationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)