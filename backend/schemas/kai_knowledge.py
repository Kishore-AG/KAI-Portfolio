from pydantic import BaseModel, ConfigDict


class KAIKnowledgeBase(BaseModel):
    category: str

    title: str

    content: str

    source: str | None = None

    embedded: bool = False

    active: bool = True


class KAIKnowledgeCreate(KAIKnowledgeBase):
    pass


class KAIKnowledgeUpdate(BaseModel):
    category: str | None = None

    title: str | None = None

    content: str | None = None

    source: str | None = None

    embedded: bool | None = None

    active: bool | None = None


class KAIKnowledgeResponse(KAIKnowledgeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)