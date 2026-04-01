from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from services.llm_service import chat_with_context
from utils.session import session_store


router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=8)
    message: str = Field(min_length=1, max_length=1000)


@router.post("/chat")
async def chat(request: ChatRequest) -> dict:
    session_data = session_store.get_session(request.session_id)
    if session_data is None:
        raise HTTPException(status_code=404, detail="Session not found or expired")

    context = session_data.get("context", {})
    history = session_data.get("history", [])

    try:
        answer = chat_with_context(
            message=request.message,
            context=context,
            history=history,
        )
    except Exception as exc:
        answer = (
            "The chat assistant is temporarily unavailable. Please use the latest analysis result "
            "and consult an agricultural expert if the issue is urgent."
        )

    session_store.append_history(request.session_id, "user", request.message)
    session_store.append_history(request.session_id, "assistant", answer)

    return {"session_id": request.session_id, "response": answer}
