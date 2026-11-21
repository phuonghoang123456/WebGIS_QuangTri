
from backend.services.satellite_service import (
    tiles,
    statistics,
)


def get_lst_tile(year, start_date=None, end_date=None):
    return tiles("lst", year, start_date, end_date)


def get_lst_statistics(year, start_date=None, end_date=None):
    result = statistics("lst", year, start_date, end_date)
    result["unit"] = "°C"
    return result