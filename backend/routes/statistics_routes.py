
from flask import Blueprint, jsonify, request
from backend.routes.date_range import (
    parse_period,
    end_exclusive,
)
from backend.services.statistics_service import (
    get_dashboard_statistics,
    get_index_statistics,
)

statistics_bp = Blueprint("statistics", __name__)


@statistics_bp.get("/api/statistics/dashboard")
def dashboard_statistics():
    try:
        start, end = parse_period()

        result = get_dashboard_statistics(
            year=start.year,
            start_date=start.isoformat(),
            end_date=end_exclusive(end),
        )

        return jsonify(result), 200

    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    except Exception:
        statistics_bp.logger.exception(
            "Dashboard analysis failed"
        )
        return jsonify(
            error=(
                "Không thể tính toán Dashboard. "
                "Kiểm tra log Backend để biết chi tiết."
            )
        ), 500


@statistics_bp.get("/api/statistics/index")
def index_statistics():
    try:
        start, end = parse_period()

        index = request.args.get(
            "index", "ndvi"
        ).strip().lower()

        result = get_index_statistics(
            index=index,
            year=start.year,
            start_date=start.isoformat(),
            end_date=end_exclusive(end),
        )

        return jsonify(result), 200

    except ValueError as exc:
        return jsonify(error=str(exc)), 400

    except Exception:
        statistics_bp.logger.exception(
            "Index statistics failed"
        )
        return jsonify(
            error=(
                "Không thể tính thống kê chỉ số. "
                "Kiểm tra log Backend."
            )
        ), 500