def compute_severity(confidence: float, disease: str) -> str:
    disease_lower = disease.lower()

    if confidence >= 0.85:
        base = "high"
    elif confidence >= 0.7:
        base = "medium"
    else:
        base = "low"

    if "blight" in disease_lower and base != "high":
        base = "medium"

    return base


def compute_health_score(confidence: float) -> int:
    score = int((1.0 - confidence) * 100)
    return max(0, min(100, score))
