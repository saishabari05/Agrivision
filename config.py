import os
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    FIREBASE_CREDENTIALS_PATH: str = os.getenv(
        "FIREBASE_CREDENTIALS_PATH", "firebase-key.json"
    )
    FIREBASE_DATABASE_URL: str = os.getenv(
        "FIREBASE_DATABASE_URL", "https://your-project.firebaseio.com"
    )
    FIREBASE_PROJECT_ID: str = os.getenv(
        "FIREBASE_PROJECT_ID", "YOUR_FIREBASE_PROJECT_ID"
    )

    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", "your-secret-key-change-in-production"
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "YOUR_OPENWEATHER_API_KEY")
    WEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5/weather"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://user:password@localhost:5432/agrivision"
    )
    DATABASE_ECHO: bool = os.getenv("DATABASE_ECHO", "False").lower() == "true"

    ALLOWED_ORIGINS: list[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
