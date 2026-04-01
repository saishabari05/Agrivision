from typing import Any, Dict, Optional

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from sqlalchemy.orm import Session

import importlib.util
spec = importlib.util.spec_from_file_location("models_module", backend_path / "models.py")
models_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(models_module)
User = models_module.User

from utils.firebase_auth import verify_firebase_token
from utils.jwt_handler import create_access_token


def verify_and_create_user_firebase(
    id_token: str, db: Session
) -> Dict[str, Any]:
    try:
        firebase_data = verify_firebase_token(id_token)
    except ValueError as exc:
        raise ValueError(f"Firebase token verification failed: {exc}") from exc

    uid = firebase_data.get("uid")
    email = firebase_data.get("email")
    name = firebase_data.get("name")

    user = db.query(User).filter(User.google_id == uid).first()

    if not user:
        try:
            user = User(
                google_id=uid,
                email=email,
                name=name,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception as exc:
            db.rollback()
            raise ValueError(f"Failed to create user: {exc}") from exc

    access_token = create_access_token({"sub": user.id, "email": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
    }


def get_user_by_id(user_id: int, db: Session) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()
