from datetime import date, timedelta
from flask import request


def parse_period(min_year=2013, max_year=2025):
    start_raw = request.args.get("start_date")
    end_raw = request.args.get("end_date")
    if bool(start_raw) != bool(end_raw):
        raise ValueError("Can cung cap ca start_date va end_date")
    if not start_raw:
        year = int(request.args.get("year", "2020"))
        if not min_year <= year <= max_year:
            raise ValueError(f"Nam phai trong khoang {min_year}-{max_year}")
        return date(year, 1, 1), date(year, 12, 31)
    try:
        start, end = date.fromisoformat(start_raw), date.fromisoformat(end_raw)
    except ValueError:
        raise ValueError("Ngay phai co dinh dang YYYY-MM-DD")
    if start > end:
        raise ValueError("Ngay bat dau phai nho hon hoac bang ngay ket thuc")
    if start.year < min_year or end.year > max_year:
        raise ValueError(f"Khoang ngay phai nam trong {min_year}-{max_year}")
    if (end - start).days > 366 * 3:
        raise ValueError("Moi lan phan tich toi da 3 nam")
    return start, end


def end_exclusive(end):
    return (end + timedelta(days=1)).isoformat()