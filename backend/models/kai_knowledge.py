from sqlalchemy import Boolean, Column, Integer, String, Text

from database.db import Base
from models.base import TimestampMixin


class KAIKnowledge(Base, TimestampMixin):
    __tablename__ = "kai_knowledge"

    id = Column(Integer, primary_key=True, index=True)

    category = Column(String(100), nullable=False)

    title = Column(String(200), nullable=False)

    content = Column(Text, nullable=False)

    source = Column(String(100), nullable=True)

    embedded = Column(Boolean, default=False)

    active = Column(Boolean, default=True)