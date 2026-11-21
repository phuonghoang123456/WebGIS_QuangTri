
from backend.services.satellite_service import (
    tiles,
    statistics,
)


def get_tvdi_tile(year, start_date=None, end_date=None):
    result = tiles("tvdi", year, start_date, end_date)

    result["method"] = (
        "NDVI-LST wet/dry edge estimation"
    )

    result["note"] = (
        "TVDI thuc nghiem, can kiem chung "
        "truoc khi su dung trong nghien cuu."
    )

    return result


def get_tvdi_statistics(year, start_date=None, end_date=None):
    result = statistics("tvdi", year, start_date, end_date)

    result["unit"] = "index"
    result["range"] = [0, 1]

    return result