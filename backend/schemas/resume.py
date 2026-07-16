from pydantic import BaseModel, ConfigDict


class ResumeBase(BaseModel):
    file_name: str

    file_path: str

    file_size: int | None = None

    version: str | None = None


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(ResumeBase):
    pass


class ResumeResponse(ResumeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)