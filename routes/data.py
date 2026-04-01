from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from services.data_store import store


router = APIRouter()


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    farmName: str | None = None
    location: str | None = None


class FarmUpsertRequest(BaseModel):
    name: str | None = None
    owner: str | None = None
    crop: str | None = None
    acreage: str | None = None
    location: str | None = None
    risk: str | None = None
    alerts: int | None = None
    phone: str | None = None
    email: str | None = None
    updated: str | None = None
    archived: bool | None = None


@router.get("/profile")
async def get_profile() -> Dict[str, Any]:
    return store.get_profile()


@router.put("/profile")
async def update_profile(request: ProfileUpdateRequest) -> Dict[str, Any]:
    return store.update_profile(request.model_dump(exclude_none=True))


@router.get("/uploads")
async def get_uploads() -> Dict[str, Any]:
    return {"items": store.list_uploads()}


@router.get("/farms")
async def get_farms() -> Dict[str, Any]:
    return {"items": store.list_farms()}


@router.post("/farms")
async def create_farm(request: FarmUpsertRequest) -> Dict[str, Any]:
    return store.add_farm(request.model_dump(exclude_none=True))


@router.put("/farms/{farm_id}")
async def update_farm(farm_id: str, request: FarmUpsertRequest) -> Dict[str, Any]:
    updated = store.update_farm(farm_id, request.model_dump(exclude_none=True))
    if updated is None:
        raise HTTPException(status_code=404, detail="Farm not found")
    return updated


@router.delete("/farms/{farm_id}")
async def delete_farm(farm_id: str) -> Dict[str, Any]:
    deleted = store.delete_farm(farm_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Farm not found")
    return {"success": True}


@router.get("/reports")
async def get_reports() -> Dict[str, Any]:
    return {"items": store.list_reports()}


@router.post("/reports/generate")
async def generate_report(payload: Dict[str, Any]) -> Dict[str, Any]:
    return store.create_report(payload)


@router.delete("/reports/{report_id}")
async def delete_report(report_id: str) -> Dict[str, Any]:
    deleted = store.delete_report(report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"success": True}


@router.get("/dashboard")
async def get_dashboard() -> Dict[str, Any]:
    return store.get_dashboard()


@router.get("/client-overview")
async def get_client_overview() -> Dict[str, Any]:
    return store.get_client_overview()
