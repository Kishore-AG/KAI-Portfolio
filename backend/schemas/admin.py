from pydantic import BaseModel, ConfigDict


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminCreate(BaseModel):
    username: str
    password: str


class AdminResponse(BaseModel):
    id: int
    username: str

    model_config = ConfigDict(from_attributes=True)