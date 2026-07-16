from sqlalchemy import Boolean, Column, Integer, String, Text

from database.db import Base
from models.base import TimestampMixin


class Profile(Base, TimestampMixin):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    title = Column(String(150), nullable=False)

    bio = Column(Text, nullable=False)

    email = Column(String(120), nullable=False)

    github = Column(String(255), nullable=True)

    linkedin = Column(String(255), nullable=True)

    location = Column(String(100), nullable=True)

    avatar = Column(String(255), nullable=True)

    available = Column(Boolean, default=True)