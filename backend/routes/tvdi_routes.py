
from flask import (
    Blueprint,
    jsonify,
    current_app,
)

from backend.routes.date_range import (
    parse_period,
    end_exclusive,
)

from backend.services.tvdi_service import (
    get_tvdi_tile,
    get_tvdi_statistics,
)

tvdi_bp = Blueprint("tvdi", __name__)


@tvdi_bp.get("/api/tvdi/tiles")
def tvdi_tiles():
    try:
        start, end = parse_period()

        result = get_tvdi_tile(
            start.year,
            start.isoformat(),
            end_exclusive(end),
        )

        return jsonify(result), 200

    except ValueError as exc:
        return jsonify(
            error=str(exc)
        ), 400

    except Exception:
        current_app.logger.exception(
            "TVDI tile generation failed"
        )

        return jsonify(
            error=(
                "Lỗi xử lý dữ liệu TVDI trên "
                "Google Earth Engine. "
                "Xem log Backend để biết chi tiết."
            )
        ), 500


@tvdi_bp.get("/api/tvdi/statistics")
def tvdi_statistics():
    try:
        start, end = parse_period()

        result = get_tvdi_statistics(
            start.year,
            start.isoformat(),
            end_exclusive(end),
        )

        return jsonify(result), 200

    except ValueError as exc:
        return jsonify(
            error=str(exc)
        ), 400

    except Exception:
        current_app.logger.exception(
            "TVDI statistics failed"
        )

        return jsonify(
            error=(
                "Không thể tính thống kê TVDI. "
                "Xem traceback trong Backend."
            )
        ), 500