from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    category: str

    icon: str | None = None

    technologies: str

    display_order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int

    model_config = ConfigDict(from_attributes=True)