import os
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

backend_path = Path(__file__).resolve().parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from routes.analyze import router as analyze_router
from routes.chat import router as chat_router
from routes.auth import router as auth_router
from routes.data import router as data_router

load_dotenv(backend_path / ".env")

# Initialize database only when explicitly enabled.
if os.getenv("INIT_DB", "false").lower() == "true":
    try:
        from database import engine, Base
        Base.metadata.create_all(bind=engine)
    except Exception as db_error:
        print(f"⚠️  Database initialization skipped: {db_error}")
        print("   Firebase auth and LLM endpoints will work without database persistence")

app = FastAPI(title="Crop Disease Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(analyze_router, prefix="/api", tags=["analyze"])
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(data_router, prefix="/api", tags=["data"])


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}
