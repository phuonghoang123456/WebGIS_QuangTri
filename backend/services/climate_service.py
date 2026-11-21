
import ee

from backend.services.gee_service import (
    initialize_gee,
    get_quangtri_geometry,
)


def get_climate_monthly(year):
    initialize_gee()

    year = int(year)

    if not 2010 <= year <= 2025:
        raise ValueError(
            "Nam khi hau phai trong khoang 2010-2025"
        )

    geom = get_quangtri_geometry()

    collection = (
        ee.ImageCollection(
            "ECMWF/ERA5_LAND/MONTHLY_AGGR"
        )
        .filterDate(
            f"{year}-01-01",
            f"{year + 1}-01-01",
        )
        .filterBounds(geom)
    )

    def calculate_month(month):
        month = ee.Number(month)

        start = ee.Date.fromYMD(
            year, month, 1
        )

        end = start.advance(1, "month")

        monthly = collection.filterDate(
            start, end
        )

        def compute():
            image = ee.Image(monthly.first())

            temperature = (
                image.select(
                    "temperature_2m"
                )
                .subtract(273.15)
            )

            precipitation = (
                image.select(
                    "total_precipitation_sum"
                )
                .multiply(1000)
            )

            combined = (
                temperature.rename(
                    "temperature_c"
                )
                .addBands(
                    precipitation.rename(
                        "rainfall_mm"
                    )
                )
            )

            stats = combined.reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=geom,
                scale=11000,
                bestEffort=True,
                maxPixels=1e9,
            )

            return ee.Dictionary({
                "month": month,
                "temperature_c": stats.get(
                    "temperature_c"
                ),
                "rainfall_mm": stats.get(
                    "rainfall_mm"
                ),
            })

        return ee.Algorithms.If(
            monthly.size().gt(0),
            compute(),
            ee.Dictionary({
                "month": month,
                "temperature_c": None,
                "rainfall_mm": None,
            }),
        )

    months = ee.List.sequence(1, 12)

    data = months.map(
        calculate_month
    ).getInfo()

    return {
        "year": year,
        "source": (
            "ECMWF ERA5-Land Monthly Aggregated"
        ),
        "temperature_unit": "°C",
        "rainfall_unit": "mm",
        "monthly": data,
    }


def get_climate_summary(year):
    result = get_climate_monthly(year)

    monthly = result["monthly"]

    temperatures = [
        item["temperature_c"]
        for item in monthly
        if item["temperature_c"] is not None
    ]

    rainfalls = [
        item["rainfall_mm"]
        for item in monthly
        if item["rainfall_mm"] is not None
    ]

    return {
        "year": int(year),
        "mean_temperature_c": (
            round(
                sum(temperatures) /
                len(temperatures), 2
            )
            if temperatures else None
        ),
        "total_rainfall_mm": (
            round(sum(rainfalls), 2)
            if rainfalls else None
        ),
        "available_months": len(
            temperatures
        ),
        "source": result["source"],
    }


def get_climate_period(start, end):
    """Daily ERA5-Land; month groups include only days inside selected interval."""
    from backend.routes.date_range import end_exclusive
    initialize_gee()
    geom = get_quangtri_geometry()
    collection = (ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR")
                  .filterDate(start.isoformat(), end_exclusive(end))
                  .filterBounds(geom))
    if collection.size().getInfo() == 0:
        raise ValueError("Khong co du lieu ERA5-Land trong khoang ngay")
    results = []
    cursor = start.replace(day=1)
    while cursor <= end:
        import calendar
        from datetime import timedelta, date
        next_month = date(cursor.year + (cursor.month == 12), cursor.month % 12 + 1, 1)
        a = max(start, cursor)
        b = min(end + timedelta(days=1), next_month)
        part = collection.filterDate(a.isoformat(), b.isoformat())
        if part.size().getInfo() == 0:
            results.append({"month": cursor.month, "year": cursor.year,
                            "temperature_c": None, "rainfall_mm": None, "days": 0})
        else:
            temp = part.select("temperature_2m").mean().subtract(273.15).rename("temperature_c")
            rain = part.select("total_precipitation_sum").sum().multiply(1000).rename("rainfall_mm")
            values = temp.addBands(rain).reduceRegion(
                reducer=ee.Reducer.mean(), geometry=geom,
                scale=11000, bestEffort=True, maxPixels=1e9).getInfo()
            results.append({"month": cursor.month, "year": cursor.year,
                            "temperature_c": values.get("temperature_c"),
                            "rainfall_mm": values.get("rainfall_mm"),
                            "days": (b - a).days})
        cursor = next_month
    return {"start_date": start.isoformat(), "end_date": end.isoformat(),
            "source": "ECMWF ERA5-Land Daily Aggregated", "monthly": results,
            "temperature_unit": "°C", "rainfall_unit": "mm"}


def get_climate_period_summary(start, end):
    result = get_climate_period(start, end)
    monthly = result["monthly"]
    valid = [r for r in monthly if r["temperature_c"] is not None]
    days = sum(r["days"] for r in valid)
    return {**{k: result[k] for k in ("start_date", "end_date", "source")},
            "mean_temperature_c": sum(r["temperature_c"] * r["days"] for r in valid) / days if days else None,
            "total_rainfall_mm": sum(r["rainfall_mm"] for r in monthly if r["rainfall_mm"] is not None),
            "available_months": len(valid)}