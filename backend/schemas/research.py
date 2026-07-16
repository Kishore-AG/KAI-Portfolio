from pydantic import BaseModel, ConfigDict


class ResearchBase(BaseModel):
    title: str
    field: str
    description: str

    technologies: str | None = None

    publication_year: int | None = None

    paper_url: str | None = None

    featured: bool = False

    ask_kai_enabled: bool = True

    display_order: int = 0


class ResearchCreate(ResearchBase):
    pass


class ResearchUpdate(ResearchBase):
    pass


class ResearchResponse(ResearchBase):
    id: int

    model_config = ConfigDict(from_attributes=True)