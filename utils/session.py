import threading
import time
import uuid
from typing import Any, Dict, List, Optional


class SessionStore:
    def __init__(self, ttl_seconds: int = 60 * 60) -> None:
        self.ttl_seconds = ttl_seconds
        self._lock = threading.Lock()
        self._store: Dict[str, Dict[str, Any]] = {}

    def _cleanup(self) -> None:
        now = time.time()
        expired_keys = [
            sid
            for sid, data in self._store.items()
            if now - data.get("created_at", now) > self.ttl_seconds
        ]
        for key in expired_keys:
            self._store.pop(key, None)

    def create_session(self, context: Dict[str, Any]) -> str:
        with self._lock:
            self._cleanup()
            session_id = str(uuid.uuid4())
            self._store[session_id] = {
                "created_at": time.time(),
                "context": context,
                "history": [],
            }
            return session_id

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            self._cleanup()
            session_data = self._store.get(session_id)
            if session_data is None:
                return None
            return {
                "context": dict(session_data.get("context", {})),
                "history": list(session_data.get("history", [])),
            }

    def append_history(self, session_id: str, role: str, content: str) -> None:
        with self._lock:
            self._cleanup()
            if session_id not in self._store:
                return
            history: List[Dict[str, str]] = self._store[session_id].setdefault("history", [])
            history.append({"role": role, "content": content})
            if len(history) > 20:
                self._store[session_id]["history"] = history[-20:]


session_store = SessionStore()
