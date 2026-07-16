from sqlalchemy import Boolean, Column, Integer, String, Text

from database.db import Base
from models.base import TimestampMixin


class Education(Base, TimestampMixin):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)

    degree = Column(String(200), nullable=False)

    institution = Column(String(200), nullable=False)

    board_university = Column(String(200), nullable=True)

    start_year = Column(Integer, nullable=False)

    end_year = Column(Integer, nullable=True)

    status = Column(String(50), nullable=False)

    grade = Column(String(50), nullable=True)

    description = Column(Text, nullable=True)

    display_order = Column(Integer, default=0)

    featured = Column(Boolean, default=False)