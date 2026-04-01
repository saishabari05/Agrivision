from __future__ import annotations

from datetime import datetime
from threading import Lock
from typing import Any, Dict, List
from uuid import uuid4


class DataStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._uploads: List[Dict[str, Any]] = []
        self._reports: List[Dict[str, Any]] = []
        self._farms: List[Dict[str, Any]] = []
        self._profile: Dict[str, Any] = {
            "id": "user-local",
            "name": "AgriVision User",
            "email": "user@agrivision.ai",
            "farmName": "AgriVision Farm",
            "location": "India",
            "joinedAt": datetime.utcnow().date().isoformat(),
        }

    def get_profile(self) -> Dict[str, Any]:
        with self._lock:
            return dict(self._profile)

    def update_profile(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        allowed = {"name", "email", "farmName", "location"}
        with self._lock:
            for key, value in updates.items():
                if key in allowed and value is not None:
                    self._profile[key] = value
            return dict(self._profile)

    def list_uploads(self) -> List[Dict[str, Any]]:
        with self._lock:
            return [dict(item) for item in self._uploads]

    def list_reports(self) -> List[Dict[str, Any]]:
        with self._lock:
            return [dict(item) for item in self._reports]

    def list_farms(self) -> List[Dict[str, Any]]:
        with self._lock:
            return [dict(item) for item in self._farms]

    def add_farm(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow().replace(microsecond=0).isoformat()
        farm = {
            "id": f"frm-{uuid4().hex[:8]}",
            "name": payload.get("name", "Unknown farm"),
            "owner": payload.get("owner", "Unknown owner"),
            "crop": payload.get("crop", "Unknown"),
            "acreage": payload.get("acreage", "0 acres"),
            "location": payload.get("location", "Unknown"),
            "risk": payload.get("risk", "Moderate"),
            "alerts": int(payload.get("alerts", 0) or 0),
            "phone": payload.get("phone", ""),
            "email": payload.get("email", ""),
            "updated": payload.get("updated", f"Updated {now[:16].replace('T', ' ')}"),
            "archived": bool(payload.get("archived", False)),
        }
        with self._lock:
            self._farms.insert(0, farm)
        return farm

    def update_farm(self, farm_id: str, updates: Dict[str, Any]) -> Dict[str, Any] | None:
        with self._lock:
            for index, farm in enumerate(self._farms):
                if farm.get("id") != farm_id:
                    continue
                next_farm = dict(farm)
                for key in ["name", "owner", "crop", "acreage", "location", "risk", "phone", "email", "updated"]:
                    if key in updates and updates[key] is not None:
                        next_farm[key] = updates[key]
                if "alerts" in updates and updates["alerts"] is not None:
                    next_farm["alerts"] = int(updates["alerts"])
                if "archived" in updates and updates["archived"] is not None:
                    next_farm["archived"] = bool(updates["archived"])
                self._farms[index] = next_farm
                return dict(next_farm)
        return None

    def delete_farm(self, farm_id: str) -> bool:
        with self._lock:
            before = len(self._farms)
            self._farms = [item for item in self._farms if item.get("id") != farm_id]
            return len(self._farms) < before

    def delete_report(self, report_id: str) -> bool:
        with self._lock:
            before = len(self._reports)
            self._reports = [item for item in self._reports if item.get("id") != report_id]
            return len(self._reports) < before

    def add_analysis_result(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow().replace(microsecond=0).isoformat()
        confidence_fraction = float(payload.get("confidence", 0.0) or 0.0)
        confidence_percent = round(confidence_fraction * 100, 2) if confidence_fraction <= 1 else round(confidence_fraction, 2)

        upload = {
            "id": f"upl-{uuid4().hex[:8]}",
            "crop": payload.get("crop", "Unknown"),
            "disease": payload.get("disease", "Unknown"),
            "severity": payload.get("severity", "Low"),
            "confidence": confidence_percent,
            "locationName": payload.get("location") or "Unknown",
            "coordinates": [payload.get("lat"), payload.get("lon")],
            "uploadedAt": now,
            "healthScore": payload.get("health_score"),
            "sessionId": payload.get("session_id"),
        }

        report = {
            "id": f"rep-{uuid4().hex[:8]}",
            "crop": upload["crop"],
            "disease": upload["disease"],
            "severity": upload["severity"],
            "confidence": upload["confidence"],
            "reportDate": now[:10],
            "locationName": upload["locationName"],
            "recommendations": [payload.get("recommendation", "No recommendation available")],
            "summary": payload.get("recommendation", "No summary available"),
            "status": "Completed",
            "sessionId": payload.get("session_id"),
        }

        with self._lock:
            self._uploads.insert(0, upload)
            self._reports.insert(0, report)

        return {"upload": upload, "report": report}

    def create_report(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow().replace(microsecond=0).isoformat()
        report = {
            "id": f"rep-{uuid4().hex[:8]}",
            "crop": payload.get("crop", "Unknown"),
            "disease": payload.get("disease", "Unknown"),
            "severity": payload.get("severity", "Low"),
            "confidence": payload.get("confidence", 0),
            "reportDate": now[:10],
            "locationName": payload.get("locationName", "Unknown"),
            "recommendations": payload.get("recommendations") or [payload.get("recommendation") or "No recommendation available"],
            "summary": payload.get("summary") or payload.get("recommendation") or "No summary available",
            "status": "Completed",
            "sessionId": payload.get("sessionId"),
        }

        with self._lock:
            self._reports.insert(0, report)

        return report

    def get_dashboard(self) -> Dict[str, Any]:
        with self._lock:
            uploads = list(self._uploads)
            reports = list(self._reports)
            farms = list(self._farms)

        high_severity = sum(1 for item in uploads if str(item.get("severity", "")).lower() in {"high", "severe", "critical"})
        crops = sorted({item.get("crop", "Unknown") for item in uploads})
        farms_monitored = len(farms) or len({item.get("locationName") for item in uploads if item.get("locationName")})

        return {
            "farmsMonitored": farms_monitored or 1,
            "detections": len(uploads),
            "alertsActive": high_severity,
            "reportsGenerated": len(reports),
            "topDiseases": uploads[:5],
            "crops": crops,
            "farms": farms,
        }

    def get_client_overview(self) -> Dict[str, Any]:
        with self._lock:
            uploads = list(self._uploads)

        crop_counts: Dict[str, int] = {}
        for item in uploads:
            crop = item.get("crop", "Unknown")
            crop_counts[crop] = crop_counts.get(crop, 0) + 1

        stats = [
            {"label": "Total scans", "value": str(len(uploads))},
            {"label": "Crop varieties", "value": str(len(crop_counts) or 0)},
            {"label": "High risk cases", "value": str(sum(1 for item in uploads if str(item.get("severity", "")).lower() in {"high", "severe", "critical"}))},
        ]

        return {
            "sectionLabel": "About the client",
            "companyName": self._profile.get("farmName", "AgriVision Farm"),
            "headline": "AI-Assisted Crop Disease Monitoring",
            "stats": stats,
            "description": "Live operational summary generated from recent disease analyses and reports.",
        }


store = DataStore()
