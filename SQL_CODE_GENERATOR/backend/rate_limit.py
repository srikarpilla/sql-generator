from fastapi import Request, HTTPException
from collections import defaultdict
from time import time

RATE_LIMIT = 5
WINDOW = 86400  # 24 hours

clients = defaultdict(list)

async def rate_limiter(request: Request):
    ip = request.client.host
    now = time()

    clients[ip] = [t for t in clients[ip] if now - t < WINDOW]

    if len(clients[ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Daily limit exceeded")

    clients[ip].append(now)
