from sqlalchemy import Column, Integer, String

from database.db import Base
from models.base import TimestampMixin


class Resume(Base, TimestampMixin):
    __tablename__ = "resume"

    id = Column(Integer, primary_key=True, index=True)

    file_name = Column(String(255), nullable=False)

    file_path = Column(String(255), nullable=False)

    file_size = Column(Integer, nullable=True)

    version = Column(String(50), nullable=True)
