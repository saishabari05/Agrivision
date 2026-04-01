from typing import Any, Dict

import httpx

from config import settings


def _validate_coordinates(lat: float, lon: float) -> None:
    if not -90 <= lat <= 90:
        raise ValueError(f"Invalid latitude: {lat}. Must be between -90 and 90.")
    if not -180 <= lon <= 180:
        raise ValueError(f"Invalid longitude: {lon}. Must be between -180 and 180.")


def get_weather(lat: float, lon: float) -> Dict[str, Any]:
    _validate_coordinates(lat, lon)

    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.WEATHER_API_KEY,
        "units": "metric",
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(settings.WEATHER_API_URL, params=params)
            response.raise_for_status()
            data = response.json()

            return {
                "temperature": data["main"].get("temp"),
                "humidity": data["main"].get("humidity"),
                "condition": data["weather"][0].get("main"),
                "description": data["weather"][0].get("description"),
                "pressure": data["main"].get("pressure"),
                "wind_speed": data.get("wind", {}).get("speed"),
                "clouds": data.get("clouds", {}).get("all"),
            }
    except httpx.HTTPError as exc:
        raise RuntimeError(f"Weather API request failed: {exc}") from exc
    except (KeyError, IndexError) as exc:
        raise RuntimeError(f"Invalid weather API response format: {exc}") from exc
