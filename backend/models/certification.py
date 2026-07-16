from sqlalchemy import Boolean, Column, Integer, String

from database.db import Base
from models.base import TimestampMixin


class Certification(Base, TimestampMixin):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    issuer = Column(String(150), nullable=False)

    issue_year = Column(Integer, nullable=False)

    credential_id = Column(String(150), nullable=True)

    certificate_url = Column(String(255), nullable=True)

    certificate_image = Column(String(255), nullable=True)

    verified = Column(Boolean, default=True)

    display_order = Column(Integer, default=0)