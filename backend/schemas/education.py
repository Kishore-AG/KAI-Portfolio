from pydantic import BaseModel, ConfigDict


class EducationBase(BaseModel):
    degree: str
    institution: str

    board_university: str | None = None

    start_year: int
    end_year: int | None = None

    status: str

    grade: str | None = None

    description: str | None = None

    display_order: int = 0

    featured: bool = False


class EducationCreate(EducationBase):
    pass


class EducationUpdate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)