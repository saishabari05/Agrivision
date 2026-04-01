from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from services.alert_service import generate_alerts
from services.data_store import store
from services.llm_service import get_recommendation
from services.location_service import geocode_location
from services.model_service import predict_disease
from services.severity_service import compute_health_score, compute_severity
from services.weather_service import get_weather
from utils.session import session_store
from utils.validation import ValidationError, validate_image


router = APIRouter()


@router.post("/analyze")
async def analyze_image(
    image: UploadFile = File(...),
    location: Optional[str] = Form(default=None),
    lat: Optional[float] = Form(default=None),
    lon: Optional[float] = Form(default=None),
) -> dict:
    try:
        image_bytes, image_info = await validate_image(image)
    except ValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    crop, disease, confidence = predict_disease(image_bytes)

    severity = compute_severity(confidence=confidence, disease=disease)
    health_score = compute_health_score(confidence=confidence)

    resolved_location = None
    resolved_lat = lat
    resolved_lon = lon
    location_for_output = location or (
        f"lat={resolved_lat}, lon={resolved_lon}"
        if resolved_lat is not None and resolved_lon is not None
        else "Unknown"
    )

    if location and (resolved_lat is None or resolved_lon is None):
        try:
            resolved_location = geocode_location(location)
            resolved_lat = resolved_location["lat"]
            resolved_lon = resolved_location["lon"]
            location_for_output = resolved_location.get("display_name", location)
        except Exception as exc:
            location_for_output = location
            alerts = generate_alerts(
                confidence=confidence,
                disease=disease,
                severity=severity,
                location=location_for_output,
            )
            alerts.append(f"Location could not be geocoded: {exc}")
        else:
            alerts = generate_alerts(
                confidence=confidence,
                disease=disease,
                severity=severity,
                location=location_for_output,
            )
    else:
        alerts = generate_alerts(
            confidence=confidence,
            disease=disease,
            severity=severity,
            location=location_for_output,
        )

    weather_data = None
    if resolved_lat is not None and resolved_lon is not None:
        try:
            weather_data = get_weather(resolved_lat, resolved_lon)
        except Exception as e:
            alerts.append(f"Weather data unavailable: {e}")

    recommendation = ""
    if confidence >= 0.6:
        try:
            rec_data = {
                "crop": crop,
                "disease": disease,
                "severity": severity,
                "location": location_for_output,
            }
            if weather_data:
                rec_data["weather"] = weather_data
            if resolved_location:
                rec_data["resolved_location"] = resolved_location
            recommendation = get_recommendation(rec_data)
        except Exception as exc:
            alerts.append(f"Recommendation service unavailable: {exc}")
            recommendation = (
                "Disease prediction is available, but AI treatment advice is currently unavailable. "
                "Please review the alerts and consult a local agronomist for treatment guidance."
            )
    else:
        alerts.append("Low confidence prediction. Please upload a clearer image for better accuracy.")
        recommendation = (
            "Confidence is below threshold. Please retake a clear photo in good lighting and consult a local agronomist if symptoms worsen."
        )

    session_id = session_store.create_session(
        {
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "severity": severity,
            "health_score": health_score,
            "location": location,
            "resolved_location": resolved_location,
            "lat": resolved_lat,
            "lon": resolved_lon,
            "image_info": image_info,
            "weather": weather_data,
        }
    )

    store.add_analysis_result(
        {
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "severity": severity,
            "health_score": health_score,
            "location": location_for_output,
            "lat": resolved_lat,
            "lon": resolved_lon,
            "recommendation": recommendation,
            "session_id": session_id,
        }
    )

    return {
        "crop": crop,
        "disease": disease,
        "confidence": confidence,
        "severity": severity,
        "health_score": health_score,
        "alerts": alerts,
        "recommendation": recommendation,
        "session_id": session_id,
        "weather": weather_data,
        "location": location_for_output,
        "lat": resolved_lat,
        "lon": resolved_lon,
        "resolved_location": resolved_location,
    }
