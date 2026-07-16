from pydantic import BaseModel


class ExplainRequest(BaseModel):

    type: str

    id: int


class ExplainResponse(BaseModel):

    response: str