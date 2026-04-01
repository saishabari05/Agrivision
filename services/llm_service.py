import os
from textwrap import dedent
from typing import Any, Dict, List

import httpx

try:
    from groq import Groq
except Exception:
    Groq = None


GROQ_TEMPERATURE = 0.3
GROQ_MAX_TOKENS = 500
GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_FALLBACK_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]


def _get_groq_api_key() -> str:
    return os.getenv("GROQ_API_KEY", "")


def _get_groq_model() -> str:
    return os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


def _get_candidate_models() -> List[str]:
    primary = _get_groq_model()
    candidates: List[str] = [primary]
    for model in GROQ_FALLBACK_MODELS:
        if model not in candidates:
            candidates.append(model)
    return candidates


def _is_model_decommissioned_error(exc: Exception) -> bool:
    message = str(exc).lower()
    return "decommissioned" in message or "no longer supported" in message


def _require_api_key() -> str:
    api_key = _get_groq_api_key()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured")
    return api_key


def _build_recommendation_prompt(data: Dict[str, Any]) -> str:
    crop = data.get("crop", "Unknown")
    disease = data.get("disease", "Unknown")
    severity = data.get("severity", "Unknown")
    location = data.get("location", "Unknown")

    prompt = (
        "You are an agricultural expert helping farmers.\n\n"
        "Context:\n"
        f"Crop: {crop}\n"
        f"Disease: {disease}\n"
        f"Severity: {severity}\n"
        f"Location: {location}\n\n"
        "Instructions:\n\n"
        "* Use simple farmer-friendly language\n"
        "* Give exact pesticide name and dosage\n"
        "* Avoid vague advice\n\n"
        "Output format:\n\n"
        "1. Disease Summary (2 lines)\n"
        "2. Immediate Action (steps)\n"
        "3. Treatment (chemical + dosage)\n"
        "4. Prevention Tips (bullets)\n"
        "5. Recovery Time"
    )

    return dedent(
        f"""
        Known facts:
        - This disease spreads faster in humid conditions
        - Recommended treatment: Mancozeb 2g/L

        {prompt}
        """
    ).strip()


def _build_chat_prompt(message: str, context: Dict[str, Any], history: List[Dict[str, str]]) -> str:
    history_text = "\n".join(
        [f"{item.get('role', 'user')}: {item.get('content', '')}" for item in history[-10:]]
    )
    context_text = "\n".join([f"{k}: {v}" for k, v in context.items()])

    return dedent(
        f"""
        You are a crop doctor assistant.

        Context:
        {context_text}

        Conversation:
        {history_text}

        User: {message}

        Rules:
        * Answer based only on given context
        * Do not hallucinate
        * Keep answers practical and short
        * If unsure, say 'Please consult an expert'

        Answer:
        """
    ).strip()


def _call_groq(prompt: str) -> str:
    api_key = _require_api_key()
    candidates = _get_candidate_models()
    last_error: Exception | None = None

    for idx, model in enumerate(candidates):
        try:
            if Groq is not None:
                try:
                    client = Groq(api_key=api_key)
                    completion = client.chat.completions.create(
                        model=model,
                        temperature=GROQ_TEMPERATURE,
                        max_tokens=GROQ_MAX_TOKENS,
                        messages=[
                            {
                                "role": "system",
                                "content": "You are a precise agricultural assistant. Follow user instructions strictly and avoid unsupported claims.",
                            },
                            {"role": "user", "content": prompt},
                        ],
                    )
                    content = (completion.choices[0].message.content or "").strip()
                    if not content:
                        raise RuntimeError("Groq returned an empty response")
                    return content
                except Exception:
                    pass

            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": model,
                "temperature": GROQ_TEMPERATURE,
                "max_tokens": GROQ_MAX_TOKENS,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a precise agricultural assistant. Follow user instructions strictly and avoid unsupported claims.",
                    },
                    {"role": "user", "content": prompt},
                ],
            }

            with httpx.Client(timeout=30.0) as client:
                response = client.post(GROQ_BASE_URL, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                content = (data["choices"][0]["message"]["content"] or "").strip()
                if not content:
                    raise RuntimeError("Groq returned an empty response")
                return content
        except Exception as exc:
            last_error = exc
            is_retryable = _is_model_decommissioned_error(exc)
            has_more_candidates = idx < len(candidates) - 1
            if is_retryable and has_more_candidates:
                continue
            raise

    if last_error is not None:
        raise last_error
    raise RuntimeError("Groq call failed")


def get_recommendation(data: Dict[str, Any]) -> str:
    prompt = _build_recommendation_prompt(data)
    return _call_groq(prompt)


def chat_with_context(message: str, context: Dict[str, Any], history: List[Dict[str, str]]) -> str:
    prompt = _build_chat_prompt(message=message, context=context, history=history)
    return _call_groq(prompt)
