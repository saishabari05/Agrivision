from typing import List, Optional


def generate_alerts(confidence: float, disease: str, severity: str, location: Optional[str]) -> List[str]:
    alerts: List[str] = []

    if confidence < 0.6:
        alerts.append("Prediction confidence is low. Capture a clearer image and retry.")

    if severity == "high":
        alerts.append("High severity detected. Start treatment immediately.")

    if "blight" in disease.lower():
        alerts.append("Disease may spread quickly in humid conditions.")

    if location:
        alerts.append(f"Monitor nearby fields in {location} for similar symptoms.")

    return alerts
