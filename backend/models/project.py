from sqlalchemy import Boolean, Column, Integer, String, Text

from database.db import Base
from models.base import TimestampMixin


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    category = Column(String(100), nullable=False)

    description = Column(Text, nullable=False)

    technologies = Column(Text, nullable=True)

    github_url = Column(String(255), nullable=True)

    image = Column(String(255), nullable=True)

    featured = Column(Boolean, default=False)

    completed = Column(Boolean, default=True)

    ask_kai_enabled = Column(Boolean, default=True)

    display_order = Column(Integer, default=0)