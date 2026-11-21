
from backend.services.satellite_service import (
    tiles,
    statistics,
)


def get_ndvi_tile(year, start_date=None, end_date=None):
    return tiles("ndvi", year, start_date, end_date)


def get_ndvi_statistics(year, start_date=None, end_date=None):
    return statistics("ndvi", year, start_date, end_date)