# Dependencies: functions FastAPI runs before a route. Used here instead of auth middleware.
from typing import Annotated

from fastapi import Header, HTTPException

from app.config import settings


def require_token(authorization: Annotated[str | None, Header()] = None):
    # Header() reads the "Authorization" request header
    if authorization != f"Bearer {settings.api_token}":
        raise HTTPException(status_code=401, detail="Unauthorized")
