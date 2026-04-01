import firebase_admin
from firebase_admin import auth, credentials, db
from typing import Any, Dict, Optional

import os
from pathlib import Path


def initialize_firebase() -> None:
    if firebase_admin._apps:
        return

    cred_path = os.getenv(
        "FIREBASE_CREDENTIALS_PATH",
        str(Path(__file__).parent.parent / "firebase-key.json"),
    )

    if not os.path.exists(cred_path):
        raise RuntimeError(
            f"Firebase credentials file not found at {cred_path}. "
            "Set FIREBASE_CREDENTIALS_PATH environment variable."
        )

    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(
        cred,
        {
            "databaseURL": os.getenv(
                "FIREBASE_DATABASE_URL", "https://your-project.firebaseio.com"
            )
        },
    )


def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    try:
        initialize_firebase()
        decoded_token = auth.verify_id_token(id_token)

        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        name = decoded_token.get("name")
        picture = decoded_token.get("picture")

        return {
            "uid": uid,
            "email": email,
            "name": name,
            "picture": picture,
            "email_verified": decoded_token.get("email_verified", False),
        }
    except Exception as exc:
        raise ValueError(f"Invalid Firebase token: {exc}") from exc


def get_firebase_user(uid: str) -> Optional[Dict[str, Any]]:
    try:
        initialize_firebase()
        user = auth.get_user(uid)

        return {
            "uid": user.uid,
            "email": user.email,
            "name": user.display_name,
            "picture": user.photo_url,
            "email_verified": user.email_verified,
            "disabled": user.disabled,
        }
    except Exception as exc:
        raise ValueError(f"Failed to get Firebase user: {exc}") from exc
