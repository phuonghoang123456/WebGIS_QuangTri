
import os
from functools import lru_cache

import ee

PROJECT = os.getenv(
    "GEE_PROJECT",
    "healthy-sign-476116-g0",
)

ASSET = os.getenv(
    "GEE_BOUNDARY_ASSET",
    "projects/healthy-sign-476116-g0/assets/quangtri_boundary",
)


@lru_cache(maxsize=1)
def initialize_gee():
    ee.Initialize(project=PROJECT)
    return True


def get_quangtri_boundary():
    initialize_gee()
    return ee.FeatureCollection(ASSET)


def get_quangtri_geometry():
    return get_quangtri_boundary().geometry()


def get_boundary_area():
    area = get_quangtri_geometry().area(
        maxError=100
    ).getInfo()

    return round(area / 1e6, 2)


def get_boundary_geojson():
    info = get_quangtri_boundary().getInfo()

    features = []

    for feature in info["features"]:
        features.append(
            {
                "type": "Feature",
                "geometry": feature["geometry"],
                "properties": feature.get(
                    "properties", {}
                ),
            }
        )

    return {
        "type": "FeatureCollection",
        "features": features,
    }