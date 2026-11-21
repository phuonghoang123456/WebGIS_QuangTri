
from flask import Blueprint, jsonify, request

from backend.services.lst_service import (
    get_lst_tile,
    get_lst_statistics,
)

lst_bp = Blueprint("lst", __name__)


def parse_year():
    raw = request.args.get("year", "2020")

    try:
        year = int(raw)
    except (TypeError, ValueError):
        raise ValueError("Nam phai la so nguyen")

    if not 2013 <= year <= 2025:
        raise ValueError(
            "LST Landsat 8/9 ho tro nam 2013-2025"
        )

    return year


@lst_bp.get("/api/lst/tiles")
def lst_tiles():
    try:
        year = parse_year()
        return jsonify(get_lst_tile(year))

    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    except Exception as exc:
        return jsonify(error=str(exc)), 500


@lst_bp.get("/api/lst/statistics")
def lst_statistics():
    try:
        year = parse_year()
        return jsonify(get_lst_statistics(year))

    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    except Exception as exc:
        return jsonify(error=str(exc)), 500