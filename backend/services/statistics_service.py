
import logging
from datetime import date, timedelta

from backend.services.gee_service import (
    get_boundary_area,
)
from backend.services.ndvi_service import (
    get_ndvi_statistics,
)
from backend.services.lst_service import (
    get_lst_statistics,
)
from backend.services.tvdi_service import (
    get_tvdi_statistics,
)
from backend.services.climate_service import (
    get_climate_period_summary,
)

logger = logging.getLogger(__name__)

INDEX_SERVICES = {
    "ndvi": get_ndvi_statistics,
    "lst": get_lst_statistics,
    "tvdi": get_tvdi_statistics,
}


def normalize_dates(
    year,
    start_date=None,
    end_date=None,
):
    year = int(year)

    if not 2013 <= year <= 2025:
        raise ValueError(
            "Năm phải nằm trong khoảng 2013–2025."
        )

    if start_date is None:
        start_date = f"{year}-01-01"

    if end_date is None:
        end_date = f"{year + 1}-01-01"

    start = date.fromisoformat(start_date)
    end = date.fromisoformat(end_date)

    if start >= end:
        raise ValueError(
            "Khoảng thời gian không hợp lệ."
        )

    return start, end


def empty_statistics(index):
    return {
        "index": index,
        "min": None,
        "mean": None,
        "max": None,
        "scale_m": None,
    }


def get_dashboard_statistics(
    year,
    start_date=None,
    end_date=None,
):
    start, end = normalize_dates(
        year, start_date, end_date
    )

    warnings = []

    result = {
        "year": start.year,
        "start_date": start.isoformat(),
        "end_date": (
            end - timedelta(days=1)
        ).isoformat(),
        "province": "Quang Tri",
        "boundary_version": "pre-2025",
        "area_km2": None,
        "ndvi": empty_statistics("ndvi"),
        "lst": empty_statistics("lst"),
        "tvdi": empty_statistics("tvdi"),
        "climate": {
            "mean_temperature_c": None,
            "total_rainfall_mm": None,
            "available_months": 0,
        },
        "warnings": warnings,
    }

    try:
        result["area_km2"] = get_boundary_area()
    except Exception:
        logger.exception(
            "Cannot calculate boundary area"
        )
        warnings.append(
            "Không thể tính diện tích nghiên cứu."
        )

    for index, service in INDEX_SERVICES.items():
        try:
            result[index] = service(
                start.year,
                start.isoformat(),
                end.isoformat(),
            )

        except Exception:
            logger.exception(
                "Dashboard %s analysis failed",
                index,
            )
            warnings.append(
                f"Không thể tính chỉ số {index.upper()} "
                "trong khoảng thời gian đã chọn."
            )

    try:
        result["climate"] = get_climate_period_summary(
            start,
            end - timedelta(days=1),
        )

    except Exception:
        logger.exception(
            "Dashboard climate analysis failed"
        )
        warnings.append(
            "Không thể tổng hợp dữ liệu khí hậu."
        )

    return result


def get_index_statistics(
    index,
    year,
    start_date=None,
    end_date=None,
):
    index = str(index).strip().lower()

    if index not in INDEX_SERVICES:
        raise ValueError(
            "Chỉ số phải là ndvi, lst hoặc tvdi."
        )

    start, end = normalize_dates(
        year, start_date, end_date
    )

    return INDEX_SERVICES[index](
        start.year,
        start.isoformat(),
        end.isoformat(),
    )