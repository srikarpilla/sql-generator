from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
from time import time
import sqlparse

from models import QueryInput
from llm import call_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RATE_LIMIT = 5      
WINDOW = 86400       
clients = defaultdict(list)

def enforce_rate_limit(ip: str):
    now = time()
    clients[ip] = [t for t in clients[ip] if now - t < WINDOW]

    if len(clients[ip]) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="Daily limit exceeded (5 requests per day)"
        )

    clients[ip].append(now)

# ---------------- API ----------------
@app.post("/generate")
def generate_sql(data: QueryInput, request: Request):
    enforce_rate_limit(request.client.host)

    sql_prompt = f"""
You are an expert SQL developer.

Database Schema:
{data.db_schema}

SQL Dialect:
{data.dialect}

Rules:
- Return ONLY SQL
- No explanation
- No markdown
- No backticks
- No extra text

English Query:
{data.question}
"""

    raw_sql = call_llm(sql_prompt)
    raw_sql = raw_sql.replace("```sql", "").replace("```", "").strip()

    formatted_sql = sqlparse.format(
        raw_sql,
        reindent=True,
        keyword_case="upper"
    )

    explanation_prompt = f"""
Explain the following SQL query in simple terms:

{formatted_sql}
"""

    explanation = call_llm(explanation_prompt).strip()

    return {
        "sql": formatted_sql,
        "explanation": explanation
    }
