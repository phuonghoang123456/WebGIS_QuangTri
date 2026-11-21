
from datetime import date

import ee

from backend.services.gee_service import (
    initialize_gee,
    get_quangtri_geometry,
)

VALID = ("ndvi", "lst", "tvdi")

VIS = {
    "ndvi": {
        "min": -0.2,
        "max": 0.9,
        "palette": [
            "#8c510a",
            "#d8b365",
            "#f6e8c3",
            "#c7eae5",
            "#5ab4ac",
            "#01665e",
        ],
    },
    "lst": {
        "min": 15,
        "max": 45,
        "palette": [
            "#313695",
            "#74add1",
            "#ffffbf",
            "#fdae61",
            "#a50026",
        ],
    },
    "tvdi": {
        "min": 0,
        "max": 1,
        "palette": [
            "#2166ac",
            "#67a9cf",
            "#d1e5f0",
            "#fddbc7",
            "#ef8a62",
            "#b2182b",
        ],
    },
}


def normalize_period(
    year,
    start_date=None,
    end_date=None,
):
    year = int(year)

    if not 2013 <= year <= 2025:
        raise ValueError(
            "Landsat 8/9 hỗ trợ giai đoạn 2013–2025."
        )

    if start_date is None:
        start_date = f"{year}-01-01"

    if end_date is None:
        end_date = f"{year + 1}-01-01"

    start = date.fromisoformat(start_date)
    end = date.fromisoformat(end_date)

    if start >= end:
        raise ValueError(
            "Ngày bắt đầu phải trước ngày kết thúc."
        )

    if start.year < 2013 or end.year > 2026:
        raise ValueError(
            "Khoảng thời gian phải thuộc 2013–2025."
        )

    return start.isoformat(), end.isoformat()


def mask_scale(image):
    qa = image.select("QA_PIXEL")

    clear = (
        qa.bitwiseAnd(1).eq(0)
        .And(qa.bitwiseAnd(1 << 1).eq(0))
        .And(qa.bitwiseAnd(1 << 2).eq(0))
        .And(qa.bitwiseAnd(1 << 3).eq(0))
        .And(qa.bitwiseAnd(1 << 4).eq(0))
    )

    optical = (
        image.select(["SR_B4", "SR_B5"])
        .multiply(0.0000275)
        .add(-0.2)
    )

    thermal = (
        image.select("ST_B10")
        .multiply(0.00341802)
        .add(149.0)
        .subtract(273.15)
        .rename("LST")
    )

    return (
        image.addBands(
            optical,
            overwrite=True,
        )
        .addBands(
            thermal,
            overwrite=True,
        )
        .updateMask(clear)
        .updateMask(
            image.select("QA_RADSAT").eq(0)
        )
    )


def images(
    year,
    start_date=None,
    end_date=None,
):
    initialize_gee()

    start_date, end_date = normalize_period(
        year,
        start_date,
        end_date,
    )

    geom = get_quangtri_geometry()

    collection = ee.ImageCollection(
        "LANDSAT/LC08/C02/T1_L2"
    )

    if int(end_date[:4]) >= 2021:
        collection = collection.merge(
            ee.ImageCollection(
                "LANDSAT/LC09/C02/T1_L2"
            )
        )

    collection = (
        collection
        .filterBounds(geom)
        .filterDate(
            start_date,
            end_date,
        )
        .filter(
            ee.Filter.eq(
                "PROCESSING_LEVEL",
                "L2SP",
            )
        )
    )

    count = collection.size().getInfo()

    if count == 0:
        raise ValueError(
            "Không có ảnh Landsat L2SP "
            f"từ {start_date} đến {end_date}."
        )

    return (
        collection
        .map(mask_scale)
        .median()
        .clip(geom)
    )


def calculate_tvdi(ndvi, lst):
    """
    Tính TVDI từ quan hệ NDVI-LST.

    Wet edge: phân vị 5% của LST
    Dry edge: phân vị 95% của LST

    Hồi quy tuyến tính theo nhóm NDVI.
    """
    geom = get_quangtri_geometry()

    # Chỉ xét vùng NDVI có giá trị hợp lý
    # cho phân tích quan hệ thực vật - nhiệt.
    valid_ndvi = ndvi.updateMask(
        ndvi.gte(0).And(ndvi.lte(1))
    )

    valid_lst = lst.updateMask(
        valid_ndvi.mask()
    )

    bins = ee.List.sequence(0, 19)

    def calculate_edges(index):
        index = ee.Number(index)

        lower = index.divide(20)
        upper = index.add(1).divide(20)

        bin_mask = (
            valid_ndvi.gte(lower)
            .And(valid_ndvi.lt(upper))
        )

        bin_lst = valid_lst.updateMask(
            bin_mask
        )

        values = bin_lst.reduceRegion(
            reducer=ee.Reducer.percentile(
                [5, 95]
            ),
            geometry=geom,
            scale=600,
            bestEffort=True,
            maxPixels=1e10,
            tileScale=4,
        )

        return ee.Feature(
            None,
            {
                "x": lower.add(upper).divide(2),
                "wet": values.get("LST_p5"),
                "dry": values.get("LST_p95"),
            },
        )

    edges = ee.FeatureCollection(
        bins.map(calculate_edges)
    ).filter(
        ee.Filter.notNull(
            ["wet", "dry"]
        )
    )

    valid_bins = edges.size().getInfo()

    if valid_bins < 3:
        raise ValueError(
            "Không đủ nhóm NDVI hợp lệ "
            "để ước tính biên ẩm và biên khô. "
            "Hãy chọn khoảng thời gian dài hơn."
        )

    wet_fit = edges.reduceColumns(
        reducer=ee.Reducer.linearFit(),
        selectors=["x", "wet"],
    )

    dry_fit = edges.reduceColumns(
        reducer=ee.Reducer.linearFit(),
        selectors=["x", "dry"],
    )

    # Kiểm tra hệ số hồi quy trước khi
    # đưa vào công thức tính TVDI.
    wet_values = wet_fit.getInfo()
    dry_values = dry_fit.getInfo()

    required = ("scale", "offset")

    if any(
        wet_values.get(key) is None
        or dry_values.get(key) is None
        for key in required
    ):
        raise ValueError(
            "Không thể xác định đường biên "
            "ẩm/khô từ dữ liệu hiện tại."
        )

    wet_slope = ee.Number(
        wet_values["scale"]
    )

    wet_offset = ee.Number(
        wet_values["offset"]
    )

    dry_slope = ee.Number(
        dry_values["scale"]
    )

    dry_offset = ee.Number(
        dry_values["offset"]
    )

    wet_line = (
        ndvi.multiply(wet_slope)
        .add(wet_offset)
    )

    dry_line = (
        ndvi.multiply(dry_slope)
        .add(dry_offset)
    )

    denominator = dry_line.subtract(
        wet_line
    )

    # Chỉ tính tại những pixel có
    # biên khô lớn hơn biên ẩm.
    valid_denominator = denominator.gt(
        0.001
    )

    tvdi = (
        lst.subtract(wet_line)
        .divide(
            denominator.where(
                valid_denominator.Not(),
                1,
            )
        )
        .updateMask(valid_denominator)
        .updateMask(
            ndvi.gte(0).And(ndvi.lte(1))
        )
        .clamp(0, 1)
        .rename("TVDI")
    )

    return tvdi


def layer(
    index,
    year,
    start_date=None,
    end_date=None,
):
    index = str(index).lower()

    if index not in VALID:
        raise ValueError(
            "Chỉ số phải là ndvi, lst hoặc tvdi."
        )

    image = images(
        year,
        start_date,
        end_date,
    )

    red = image.select("SR_B4")
    nir = image.select("SR_B5")

    # Tránh các pixel không có phản xạ
    # hợp lệ và mẫu số quá nhỏ.
    valid_reflectance = (
        red.gt(0)
        .And(nir.gt(0))
        .And(
            red.add(nir).abs().gt(0.0001)
        )
    )

    ndvi = (
        nir.subtract(red)
        .divide(
            nir.add(red).where(
                valid_reflectance.Not(),
                1,
            )
        )
        .updateMask(valid_reflectance)
        .rename("NDVI")
    )

    lst = image.select("LST")

    if index == "ndvi":
        return ndvi

    if index == "lst":
        return lst

    return calculate_tvdi(
        ndvi,
        lst,
    )


def tiles(
    index,
    year,
    start_date=None,
    end_date=None,
):
    index = str(index).lower()

    if index not in VALID:
        raise ValueError(
            "Chỉ số không hợp lệ."
        )

    start_date, end_date = normalize_period(
        year,
        start_date,
        end_date,
    )

    image = layer(
        index,
        year,
        start_date,
        end_date,
    )

    visualization = VIS[index]

    map_info = image.getMapId(
        visualization
    )

    return {
        "index": index,
        "year": int(year),
        "start_date": start_date,
        "end_date_exclusive": end_date,
        "tile_url": map_info[
            "tile_fetcher"
        ].url_format,
        "visualization": visualization,
        "source": (
            "Landsat 8/9 Collection 2 Level 2, "
            "Google Earth Engine"
        ),
    }


def statistics(
    index,
    year,
    start_date=None,
    end_date=None,
):
    index = str(index).lower()

    if index not in VALID:
        raise ValueError(
            "Chỉ số không hợp lệ."
        )

    start_date, end_date = normalize_period(
        year,
        start_date,
        end_date,
    )

    image = layer(
        index,
        year,
        start_date,
        end_date,
    )

    band = {
        "ndvi": "NDVI",
        "lst": "LST",
        "tvdi": "TVDI",
    }[index]

    scale = 600 if index == "tvdi" else 300

    result = image.reduceRegion(
        reducer=(
            ee.Reducer.mean().combine(
                ee.Reducer.minMax(),
                sharedInputs=True,
            )
        ),
        geometry=get_quangtri_geometry(),
        scale=scale,
        bestEffort=True,
        maxPixels=1e10,
        tileScale=4,
    ).getInfo()

    if not result:
        raise ValueError(
            "Không có pixel hợp lệ "
            "để tính thống kê."
        )

    mean = result.get(
        f"{band}_mean"
    )

    minimum = result.get(
        f"{band}_min"
    )

    maximum = result.get(
        f"{band}_max"
    )

    if (
        mean is None
        or minimum is None
        or maximum is None
    ):
        raise ValueError(
            "Không có đủ dữ liệu hợp lệ "
            f"để thống kê {index.upper()}."
        )

    return {
        "index": index,
        "year": int(year),
        "start_date": start_date,
        "end_date_exclusive": end_date,
        "mean": mean,
        "min": minimum,
        "max": maximum,
        "scale_m": scale,
    }