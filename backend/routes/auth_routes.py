
import os
import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    jwt_required,
)
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from google.auth.exceptions import GoogleAuthError
from sqlalchemy.exc import IntegrityError

from backend.extensions import db, limiter
from backend.models.user import User
from backend.security.permissions import current_user


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)


def normalize_email(value):
    return str(value or "").strip().lower()


def create_login_response(user):
    token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "token_version": user.token_version,
        },
    )

    return jsonify({
        "message": "Dang nhap thanh cong.",
        "access_token": token,
        "user": user.to_dict(),
    })


def generate_google_username(google_sub):
    # Không dùng email làm username để tránh
    # tiết lộ thông tin cá nhân không cần thiết.
    base = "google_" + google_sub[-16:]

    candidate = base[:50]
    counter = 1

    while User.query.filter_by(username=candidate).first():
        suffix = f"_{counter}"
        candidate = base[:50 - len(suffix)] + suffix
        counter += 1

    return candidate


@auth_bp.post("/register")
@limiter.limit("5 per hour")
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Du lieu JSON khong hop le."
        }), 400

    username = str(data.get("username") or "").strip()
    email = normalize_email(data.get("email"))
    password = data.get("password")

    if not re.fullmatch(r"[A-Za-z0-9_]{3,50}", username):
        return jsonify({
            "message": (
                "Ten dang nhap phai co 3-50 ky tu "
                "gom chu, so va dau gach duoi."
            )
        }), 400

    if (
        len(email) > 254
        or not re.fullmatch(
            r"[^@\s]+@[^@\s]+\.[^@\s]+",
            email,
        )
    ):
        return jsonify({
            "message": "Email khong hop le."
        }), 400

    if (
        not isinstance(password, str)
        or not 12 <= len(password) <= 128
    ):
        return jsonify({
            "message": "Mat khau phai co 12-128 ky tu."
        }), 400

    if User.query.filter_by(username=username).first():
        return jsonify({
            "message": "Ten dang nhap da ton tai."
        }), 409

    if User.query.filter_by(email=email).first():
        return jsonify({
            "message": "Email da duoc su dung."
        }), 409

    user = User(
        username=username,
        email=email,
        role="USER",
        is_active=True,
    )

    user.set_password(password)
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Tai khoan da ton tai."
        }), 409

    return jsonify({
        "message": "Dang ky thanh cong.",
        "user": user.to_dict(),
    }), 201


@auth_bp.post("/login")
@limiter.limit("10 per minute")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Du lieu JSON khong hop le."
        }), 400

    email = normalize_email(data.get("email"))
    password = data.get("password")

    if not isinstance(password, str):
        return jsonify({
            "message": "Email hoac mat khau khong dung."
        }), 401

    user = User.query.filter_by(email=email).first()

    if (
        user is None
        or not user.is_active
        or not user.check_password(password)
    ):
        return jsonify({
            "message": "Email hoac mat khau khong dung."
        }), 401

    return create_login_response(user)


@auth_bp.post("/google")
@limiter.limit("10 per minute")
def google_login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Du lieu JSON khong hop le."
        }), 400

    credential = data.get("credential")

    if not isinstance(credential, str) or not credential:
        return jsonify({
            "message": "Thieu Google ID token."
        }), 400

    if len(credential) > 10000:
        return jsonify({
            "message": "Google ID token khong hop le."
        }), 400

    client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()

    if not client_id:
        return jsonify({
            "message": "Chua cau hinh Google Client ID."
        }), 503

    try:
        payload = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            client_id,
        )
    except (ValueError, GoogleAuthError):
        return jsonify({
            "message": "Xac thuc Google that bai."
        }), 401

    google_sub = str(payload.get("sub") or "")
    email = normalize_email(payload.get("email"))
    email_verified = payload.get("email_verified") is True

    if (
        not google_sub
        or not email_verified
        or len(email) > 254
        or not re.fullmatch(
            r"[^@\s]+@[^@\s]+\.[^@\s]+",
            email,
        )
    ):
        return jsonify({
            "message": "Tai khoan Google chua duoc xac minh."
        }), 401

    # Ưu tiên định danh Google ổn định.
    user = User.query.filter_by(
        google_sub=google_sub
    ).first()

    if user is not None:
        if not user.is_active:
            return jsonify({
                "message": "Tai khoan da bi vo hieu hoa."
            }), 403

        return create_login_response(user)

    # Không tự động liên kết với tài khoản cũ
    # chỉ vì trùng địa chỉ email.
    existing = User.query.filter_by(email=email).first()

    if existing is not None:
        return jsonify({
            "message": (
                "Email nay da co tai khoan WebGIS. "
                "Vui long dang nhap bang phuong thuc "
                "da dang ky."
            )
        }), 409

    user = User(
        username=generate_google_username(google_sub),
        email=email,
        google_sub=google_sub,
        password_hash=None,
        role="USER",
        is_active=True,
    )

    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": (
                "Khong the tao tai khoan Google. "
                "Vui long thu lai."
            )
        }), 409

    return create_login_response(user)


@auth_bp.get("/me")
@jwt_required()
def me():
    user = current_user()

    return jsonify({
        "user": user.to_dict(),
    })


@auth_bp.post("/logout")
@jwt_required()
def logout():
    user = current_user()
    claims = get_jwt()

    if claims.get("token_version") != user.token_version:
        return jsonify({
            "message": "Phien dang nhap khong hop le."
        }), 401

    user.revoke_sessions()
    db.session.commit()

    return jsonify({
        "message": "Dang xuat thanh cong."
    })
