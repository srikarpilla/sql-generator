from pydantic import BaseModel

class QueryInput(BaseModel):
    question: str
    db_schema: str
    dialect: str
