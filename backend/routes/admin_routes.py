
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_

from backend.extensions import db
from backend.models.user import User
from backend.models.webgis_layer import WebGISLayer
from backend.security.permissions import (
    current_user,
    role_required,
)


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin",
)


ALLOWED_LAYER_CODES = {
    "ndvi",
    "lst",
    "tvdi",
}


def error_response(message, status=400):
    return jsonify({"message": message}), status


def get_json_object():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None


def count_active_admins():
    return User.query.filter_by(
        role="ADMIN",
        is_active=True,
    ).count()


@admin_bp.get("/dashboard")
@role_required("ADMIN")
def dashboard():
    total_users = db.session.query(
        func.count(User.id)
    ).scalar() or 0

    active_users = db.session.query(
        func.count(User.id)
    ).filter(
        User.is_active.is_(True)
    ).scalar() or 0

    admin_count = db.session.query(
        func.count(User.id)
    ).filter(
        User.role == "ADMIN"
    ).scalar() or 0

    total_layers = WebGISLayer.query.count()

    enabled_layers = WebGISLayer.query.filter_by(
        is_enabled=True
    ).count()

    return jsonify({
        "users": {
            "total": total_users,
            "active": active_users,
            "inactive": total_users - active_users,
            "admins": admin_count,
            "regular_users": total_users - admin_count,
        },
        "layers": {
            "total": total_layers,
            "enabled": enabled_layers,
            "disabled": total_layers - enabled_layers,
        },
    })


@admin_bp.get("/users")
@role_required("ADMIN")
def list_users():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(
            request.args.get("per_page", 20)
        )
    except ValueError:
        return error_response(
            "Tham so phan trang khong hop le."
        )

    if page < 1 or not 1 <= per_page <= 100:
        return error_response(
            "page phai >= 1 va per_page tu 1 den 100."
        )

    search = request.args.get(
        "search", ""
    ).strip()[:100]

    query = User.query

    if search:
        pattern = f"%{search}%"

        query = query.filter(
            or_(
                User.username.ilike(pattern),
                User.email.ilike(pattern),
            )
        )

    pagination = query.order_by(
        User.id.desc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "items": [
            user.to_dict()
            for user in pagination.items
        ],
        "page": page,
        "per_page": per_page,
        "total": pagination.total,
        "pages": pagination.pages,
    })


@admin_bp.patch("/users/<int:user_id>/status")
@role_required("ADMIN")
def update_user_status(user_id):
    data = get_json_object()

    if data is None or type(
        data.get("is_active")
    ) is not bool:
        return error_response(
            "is_active phai la true hoac false."
        )

    target = db.session.get(
        User,
        user_id,
        with_for_update=True,
    )

    if target is None:
        return error_response(
            "Khong tim thay tai khoan.", 404
        )

    actor = current_user()
    new_status = data["is_active"]

    if target.id == actor.id and not new_status:
        return error_response(
            "Khong the tu khoa tai khoan."
        )

    if (
        target.role == "ADMIN"
        and target.is_active
        and not new_status
        and count_active_admins() <= 1
    ):
        return error_response(
            "Phai giu it nhat mot Admin hoat dong."
        )

    if target.is_active != new_status:
        target.is_active = new_status
        target.revoke_sessions()

    db.session.commit()

    return jsonify({
        "message": "Cap nhat trang thai thanh cong.",
        "user": target.to_dict(),
    })


@admin_bp.patch("/users/<int:user_id>/role")
@role_required("ADMIN")
def update_user_role(user_id):
    data = get_json_object()

    if data is None:
        return error_response(
            "Du lieu JSON khong hop le."
        )

    role = data.get("role")

    if role not in ("USER", "ADMIN"):
        return error_response(
            "role phai la USER hoac ADMIN."
        )

    target = db.session.get(
        User,
        user_id,
        with_for_update=True,
    )

    if target is None:
        return error_response(
            "Khong tim thay tai khoan.", 404
        )

    actor = current_user()

    if target.id == actor.id and role != "ADMIN":
        return error_response(
            "Khong the tu ha quyen Admin."
        )

    if (
        target.role == "ADMIN"
        and target.is_active
        and role == "USER"
        and count_active_admins() <= 1
    ):
        return error_response(
            "Phai giu it nhat mot Admin hoat dong."
        )

    if target.role != role:
        target.role = role
        target.revoke_sessions()

    db.session.commit()

    return jsonify({
        "message": "Cap nhat vai tro thanh cong.",
        "user": target.to_dict(),
    })


@admin_bp.get("/layers")
@role_required("ADMIN")
def list_layers():
    layers = WebGISLayer.query.order_by(
        WebGISLayer.display_order.asc(),
        WebGISLayer.id.asc(),
    ).all()

    return jsonify({
        "items": [
            layer.to_dict()
            for layer in layers
        ]
    })


@admin_bp.patch("/layers/<int:layer_id>")
@role_required("ADMIN")
def update_layer(layer_id):
    layer = db.session.get(
        WebGISLayer,
        layer_id,
    )

    if layer is None:
        return error_response(
            "Khong tim thay lop du lieu.", 404
        )

    data = get_json_object()

    if data is None:
        return error_response(
            "Du lieu JSON khong hop le."
        )

    allowed_fields = {
        "name",
        "description",
        "is_enabled",
        "display_order",
    }

    if not data or any(
        key not in allowed_fields
        for key in data
    ):
        return error_response(
            "Truong cap nhat khong hop le."
        )

    if "name" in data:
        name = data["name"]

        if (
            not isinstance(name, str)
            or not 1 <= len(name.strip()) <= 100
        ):
            return error_response(
                "Ten lop phai co 1-100 ky tu."
            )

        layer.name = name.strip()

    if "description" in data:
        description = data["description"]

        if (
            not isinstance(description, str)
            or len(description) > 2000
        ):
            return error_response(
                "Mo ta khong duoc qua 2000 ky tu."
            )

        layer.description = description

    if "is_enabled" in data:
        if type(data["is_enabled"]) is not bool:
            return error_response(
                "is_enabled phai la boolean."
            )

        layer.is_enabled = data["is_enabled"]

    if "display_order" in data:
        order = data["display_order"]

        if (
            type(order) is not int
            or not 0 <= order <= 10000
        ):
            return error_response(
                "display_order phai tu 0 den 10000."
            )

        layer.display_order = order

    layer.updated_at = datetime.now(
        timezone.utc
    )

    db.session.commit()

    return jsonify({
        "message": "Cap nhat lop du lieu thanh cong.",
        "layer": layer.to_dict(),
    })


@admin_bp.post("/layers/reset")
@role_required("ADMIN")
def reset_default_layers():
    defaults = [
        {
            "code": "ndvi",
            "name": "Chỉ số thực vật NDVI",
            "description": (
                "Lớp NDVI từ ảnh Landsat."
            ),
            "order": 1,
        },
        {
            "code": "lst",
            "name": "Nhiệt độ bề mặt LST",
            "description": (
                "Lớp nhiệt độ bề mặt từ Landsat."
            ),
            "order": 2,
        },
        {
            "code": "tvdi",
            "name": "Chỉ số khô hạn TVDI",
            "description": (
                "Lớp TVDI thực nghiệm."
            ),
            "order": 3,
        },
    ]

    for item in defaults:
        layer = WebGISLayer.query.filter_by(
            code=item["code"]
        ).first()

        if layer is None:
            layer = WebGISLayer(
                code=item["code"],
                source="GEE",
            )
            db.session.add(layer)

        layer.name = item["name"]
        layer.description = item["description"]
        layer.is_enabled = True
        layer.display_order = item["order"]

    db.session.commit()

    return jsonify({
        "message": "Khoi phuc danh muc lop mac dinh."
    })