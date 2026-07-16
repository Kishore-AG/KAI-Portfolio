from sqlalchemy import Boolean, Column, Integer, String, Text

from database.db import Base
from models.base import TimestampMixin


class Research(Base, TimestampMixin):
    __tablename__ = "research"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    field = Column(String(100), nullable=False)

    description = Column(Text, nullable=False)

    technologies = Column(Text, nullable=True)

    publication_year = Column(Integer, nullable=True)

    paper_url = Column(String(255), nullable=True)

    featured = Column(Boolean, default=False)

    ask_kai_enabled = Column(Boolean, default=True)

    display_order = Column(Integer, default=0)