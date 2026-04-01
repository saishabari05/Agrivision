from __future__ import annotations

from typing import Any, Dict

import httpx


NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"


def geocode_location(query: str) -> Dict[str, Any]:
    cleaned_query = query.strip()
    if not cleaned_query:
        raise ValueError("Location query is empty")

    params = {
        "q": cleaned_query,
        "format": "jsonv2",
        "limit": 1,
    }
    headers = {
        "User-Agent": "Agrivision/1.0 (location lookup)",
        "Accept": "application/json",
    }

    with httpx.Client(timeout=10.0, headers=headers) as client:
        response = client.get(NOMINATIM_SEARCH_URL, params=params)
        response.raise_for_status()
        results = response.json()

    if not results:
        raise RuntimeError(f"Could not resolve location: {cleaned_query}")

    first = results[0]
    return {
        "query": cleaned_query,
        "display_name": first.get("display_name", cleaned_query),
        "lat": float(first["lat"]),
        "lon": float(first["lon"]),
    }