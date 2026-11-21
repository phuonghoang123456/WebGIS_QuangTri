
from flask import Blueprint, jsonify, request

from backend.services.ndvi_service import (
    get_ndvi_tile,
    get_ndvi_statistics,
)

ndvi_bp = Blueprint("ndvi", __name__)


def parse_year():
    raw = request.args.get("year", "2020")

    try:
        year = int(raw)
    except (TypeError, ValueError):
        raise ValueError("Nam phai la so nguyen")

    if not 2013 <= year <= 2025:
        raise ValueError(
            "NDVI Landsat 8/9 ho tro nam 2013-2025"
        )

    return year


@ndvi_bp.get("/api/ndvi/tiles")
def ndvi_tiles():
    try:
        year = parse_year()
        return jsonify(get_ndvi_tile(year))

    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    except Exception as exc:
        return jsonify(error=str(exc)), 500


@ndvi_bp.get("/api/ndvi/statistics")
def ndvi_statistics():
    try:
        year = parse_year()
        return jsonify(get_ndvi_statistics(year))

    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    except Exception as exc:
        return jsonify(error=str(exc)), 500