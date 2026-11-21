
from flask import Blueprint, jsonify

from backend.models.webgis_layer import WebGISLayer
from backend.security.permissions import login_required


layer_bp = Blueprint(
    "layers",
    __name__,
    url_prefix="/api/layers",
)


@layer_bp.get("")
@login_required
def available_layers():
    layers = WebGISLayer.query.filter_by(
        is_enabled=True
    ).order_by(
        WebGISLayer.display_order.asc()
    ).all()

    return jsonify({
        "items": [
            layer.to_dict()
            for layer in layers
        ]
    })