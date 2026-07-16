from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    category: str
    description: str

    technologies: str | None = None

    github_url: str | None = None

    image: str | None = None

    featured: bool = False
    completed: bool = True
    ask_kai_enabled: bool = True

    display_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int

    model_config = ConfigDict(from_attributes=True)