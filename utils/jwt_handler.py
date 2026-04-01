from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from jose import JWTError, jwt

from config import settings


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            hours=settings.JWT_EXPIRATION_HOURS
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError as exc:
        raise ValueError(f"Invalid token: {exc}") from exc


def extract_user_id_from_token(token: str) -> int:
    try:
        payload = decode_access_token(token)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise ValueError("Token missing user_id")
        return user_id
    except Exception as exc:
        raise ValueError(f"Could not validate credentials: {exc}") from exc
