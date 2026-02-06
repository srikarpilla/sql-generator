from pydantic import BaseModel

class QueryRequest(BaseModel):
    question: str
    schema: str
    dialect: str
