
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

from backend.extensions import db
from backend.models.user import User

usage_bp = Blueprint("usage_tracking", __name__)


def current_user():
    try:
        user_id = int(get_jwt_identity())
        return db.session.get(User, user_id)
    except (TypeError, ValueError):
        return None


def require_admin():
    user = current_user()

    if not user or not user.is_active:
        return None

    if user.role != "ADMIN":
        return None

    return user


@usage_bp.post("/api/usage/events")
@jwt_required()
def create_usage_event():
    user = current_user()

    if not user or not user.is_active:
        return jsonify(
            message="Tài khoản không hợp lệ."
        ), 403

    payload = request.get_json(silent=True) or {}

    kind = payload.get("kind")
    analysis_type = str(
        payload.get("analysis_type", "")
    ).lower()

    details = str(payload.get("details", ""))[:500]

    valid_kinds = ("analysis", "csv_export")
    valid_types = ("ndvi", "lst", "tvdi", "climate")

    if kind not in valid_kinds:
        return jsonify(
            message="Loại hoạt động không hợp lệ."
        ), 400

    if analysis_type not in valid_types:
        return jsonify(
            message="Loại phân tích không hợp lệ."
        ), 400

    db.session.execute(
        text("""
            INSERT INTO public.usage_events
                (user_id, kind, analysis_type, details)
            VALUES
                (:user_id, :kind, :analysis_type, :details)
        """),
        {
            "user_id": user.id,
            "kind": kind,
            "analysis_type": analysis_type,
            "details": details,
        },
    )

    db.session.commit()

    return jsonify(
        message="Đã ghi nhận hoạt động."
    ), 201


@usage_bp.get("/api/admin/usage/summary")
@jwt_required()
def usage_summary():
    if not require_admin():
        return jsonify(
            message="Không có quyền truy cập."
        ), 403

    rows = db.session.execute(
        text("""
            SELECT kind, analysis_type, COUNT(*) AS total
            FROM public.usage_events
            GROUP BY kind, analysis_type
        """)
    ).mappings().all()

    by_type = {
        "ndvi": 0,
        "lst": 0,
        "tvdi": 0,
        "climate": 0,
    }

    analyses_total = 0
    exports_total = 0

    for row in rows:
        if row["kind"] == "analysis":
            analyses_total += row["total"]
            by_type[row["analysis_type"]] = row["total"]

        elif row["kind"] == "csv_export":
            exports_total += row["total"]

    users = db.session.execute(
        text("""
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (
                    WHERE is_active = TRUE
                ) AS active
            FROM public.users
        """)
    ).mappings().one()

    return jsonify(
        analyses_total=analyses_total,
        exports_total=exports_total,
        by_type=by_type,
        users_total=users["total"],
        users_active=users["active"],
    )


@usage_bp.get("/api/admin/usage/events")
@jwt_required()
def usage_events():
    if not require_admin():
        return jsonify(
            message="Không có quyền truy cập."
        ), 403

    kind = request.args.get("kind", "analysis")

    if kind not in ("analysis", "csv_export"):
        return jsonify(
            message="Loại sự kiện không hợp lệ."
        ), 400

    try:
        limit = min(
            200,
            max(1, int(request.args.get("limit", 100)))
        )
    except ValueError:
        return jsonify(
            message="Giới hạn không hợp lệ."
        ), 400

    rows = db.session.execute(
        text("""
            SELECT
                e.id,
                e.created_at,
                e.kind,
                e.analysis_type,
                e.details,
                u.username
            FROM public.usage_events e
            LEFT JOIN public.users u
                ON u.id = e.user_id
            WHERE e.kind = :kind
            ORDER BY e.created_at DESC, e.id DESC
            LIMIT :limit
        """),
        {"kind": kind, "limit": limit},
    ).mappings().all()

    total = db.session.execute(
        text("""
            SELECT COUNT(*)
            FROM public.usage_events
            WHERE kind = :kind
        """),
        {"kind": kind},
    ).scalar_one()

    events = [
        {
            "id": row["id"],
            "created_at": row["created_at"].isoformat(),
            "kind": row["kind"],
            "analysis_type": row["analysis_type"],
            "details": row["details"],
            "username": row["username"],
        }
        for row in rows
    ]

    return jsonify(
        total=total,
        events=events,
    )