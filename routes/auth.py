from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from services.data_store import store
from utils.jwt_handler import create_access_token

router = APIRouter()


class FirebaseAuthRequest(BaseModel):
    id_token: str = Field(min_length=10)


class UserInfo(BaseModel):
    id: int
    email: str
    name: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo


class EmailLoginRequest(BaseModel):
    email: str = Field(min_length=5)
    password: str = Field(min_length=6)


class EmailRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5)
    password: str = Field(min_length=6)


@router.post("/login", response_model=AuthResponse)
async def email_login(request: EmailLoginRequest) -> Dict[str, Any]:
    profile = store.update_profile(
        {
            "email": request.email,
            "name": request.email.split("@")[0].replace(".", " ").title(),
        }
    )
    access_token = create_access_token({"sub": 1, "email": profile.get("email")})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": profile.get("email"),
            "name": profile.get("name"),
        },
    }


@router.post("/register", response_model=AuthResponse)
async def email_register(request: EmailRegisterRequest) -> Dict[str, Any]:
    profile = store.update_profile(
        {
            "name": request.name,
            "email": request.email,
        }
    )
    access_token = create_access_token({"sub": 1, "email": profile.get("email")})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": profile.get("email"),
            "name": profile.get("name"),
        },
    }


@router.post("/google", response_model=AuthResponse)
async def google_login_firebase(
    request: FirebaseAuthRequest,
) -> Dict[str, Any]:
    # Lazy imports to avoid blocking on module load
    from fastapi import Depends
    from sqlalchemy.orm import Session
    from database import get_db
    from services.auth_service import verify_and_create_user_firebase
    
    # Get database session
    from database import SessionLocal
    db = SessionLocal()
    
    try:
        result = verify_and_create_user_firebase(request.id_token, db)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {exc}") from exc
    finally:
        db.close()
