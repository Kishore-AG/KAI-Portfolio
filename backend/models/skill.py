from sqlalchemy import Column, Integer, String, Text

from database.db import Base
from models.base import TimestampMixin


class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    category = Column(String(100), nullable=False)

    icon = Column(String(50), nullable=True)

    technologies = Column(Text, nullable=False)

    display_order = Column(Integer, default=0)