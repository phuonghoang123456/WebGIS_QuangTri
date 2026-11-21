
from flask import Blueprint, jsonify

from backend.services.gee_service import (
    get_boundary_geojson,
    get_boundary_area,
)

gee_bp = Blueprint(
    "gee",
    __name__,
)


@gee_bp.get("/api/boundary")
def boundary():
    try:
        return jsonify(
            get_boundary_geojson()
        )
    except Exception as exc:
        return jsonify(
            error=str(exc)
        ), 500


@gee_bp.get(
    "/api/boundary/statistics"
)
def boundary_statistics():
    try:
        return jsonify(
            area_km2=get_boundary_area(),
            name="Quang Tri",
            version="pre-2025",
        )
    except Exception as exc:
        return jsonify(
            error=str(exc)
        ), 500