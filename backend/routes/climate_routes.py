from backend.routes.date_range import parse_period
from backend.services.climate_service import get_climate_period, get_climate_period_summary

from flask import Blueprint, jsonify, request

from backend.services.climate_service import (
    get_climate_monthly,
    get_climate_summary,
)

climate_bp = Blueprint(
    "climate",
    __name__,
)


def parse_year():
    raw = request.args.get(
        "year", "2020"
    )

    try:
        year = int(raw)
    except (TypeError, ValueError):
        raise ValueError(
            "Nam phai la so nguyen"
        )

    if not 2010 <= year <= 2025:
        raise ValueError(
            "Nam phai trong khoang 2010-2025"
        )

    return year


@climate_bp.get(
    "/api/climate/monthly"
)
def climate_monthly():
    try:
        if request.args.get("start_date") or request.args.get("end_date"):
            start, end = parse_period(2010, 2025)
            return jsonify(get_climate_period(start, end))
        year = parse_year()
        return jsonify(get_climate_monthly(year))

    except ValueError as exc:
        return jsonify(
            error=str(exc)
        ), 400

    except Exception as exc:
        return jsonify(
            error=str(exc)
        ), 500


@climate_bp.get(
    "/api/climate/summary"
)
def climate_summary():
    try:
        if request.args.get("start_date") or request.args.get("end_date"):
            start, end = parse_period(2010, 2025)
            return jsonify(get_climate_period_summary(start, end))
        year = parse_year()
        return jsonify(get_climate_summary(year))

    except ValueError as exc:
        return jsonify(
            error=str(exc)
        ), 400

    except Exception as exc:
        return jsonify(
            error=str(exc)
        ), 500