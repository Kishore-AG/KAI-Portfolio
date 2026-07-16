from pydantic import BaseModel, ConfigDict


class ProfileBase(BaseModel):
    name: str
    title: str
    bio: str
    email: str

    github: str | None = None
    linkedin: str | None = None
    location: str | None = None
    avatar: str | None = None

    available: bool = True


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int

    model_config = ConfigDict(from_attributes=True)