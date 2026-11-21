
from functools import wraps

from flask import g, jsonify
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from backend.extensions import db
from backend.models.user import User


def current_user():
    cached = getattr(g, "current_user", None)

    if cached is not None:
        return cached

    identity = get_jwt_identity()

    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return None

    user = db.session.get(User, user_id)

    if user is not None:
        g.current_user = user

    return user


def login_required(function):
    @wraps(function)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user = current_user()

        if user is None or not user.is_active:
            return jsonify({
                "message": "Tai khoan khong kha dung."
            }), 401

        return function(*args, **kwargs)

    return wrapper


def role_required(*allowed_roles):
    def decorator(function):
        @wraps(function)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user = current_user()

            if user is None or not user.is_active:
                return jsonify({
                    "message": "Tai khoan khong kha dung."
                }), 401

            if user.role not in allowed_roles:
                return jsonify({
                    "message": "Ban khong co quyen truy cap."
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator