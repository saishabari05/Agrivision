from typing import Any, Dict

from google.auth.transport import requests
from google.oauth2 import id_token

from config import settings


def verify_google_token(id_token_str: str) -> Dict[str, Any]:
    try:
        idinfo = id_token.verify_oauth2_token(
            id_token_str,
            requests.Request(),
            audience=settings.GOOGLE_CLIENT_ID,
        )

        if idinfo.get("aud") != settings.GOOGLE_CLIENT_ID:
            raise ValueError("Invalid audience")

        if not idinfo.get("email_verified"):
            raise ValueError("Email not verified by Google")

        return {
            "google_id": idinfo.get("sub"),
            "email": idinfo.get("email"),
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
        }
    except Exception as exc:
        raise ValueError(f"Invalid token: {exc}") from exc
