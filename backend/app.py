
import os

from flask import (
    Flask,
    g,
    jsonify,
    request,
)
from flask_cors import CORS
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    verify_jwt_in_request,
)

from backend.config import get_config
from backend.extensions import (
    db,
    jwt,
    limiter,
)
from backend.models import User, WebGISLayer

from backend.routes.auth_routes import auth_bp
from backend.routes.admin_routes import admin_bp
from backend.routes.layer_routes import layer_bp

from backend.routes.gee_routes import gee_bp
from backend.routes.ndvi_routes import ndvi_bp
from backend.routes.lst_routes import lst_bp
from backend.routes.tvdi_routes import tvdi_bp
from backend.routes.climate_routes import climate_bp
from backend.routes.statistics_routes import statistics_bp
from backend.routes.usage_routes import usage_bp
from backend.commands.admin_commands import (
    register_admin_commands,
)


from backend.routes.article_routes import article_bp
from backend.models.scientific_article import ScientificArticle


PUBLIC_API_PATHS = {
    "/api/health",
    "/api/routes",
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/google",
}


def seed_layers():
    defaults = [
        (
            "ndvi",
            "Chỉ số thực vật NDVI",
            "Chỉ số thực vật từ Landsat.",
            1,
        ),
        (
            "lst",
            "Nhiệt độ bề mặt LST",
            "Nhiệt độ bề mặt từ Landsat.",
            2,
        ),
        (
            "tvdi",
            "Chỉ số khô hạn TVDI",
            "Chỉ số khô hạn thực nghiệm.",
            3,
        ),
    ]

    for code, name, description, order in defaults:
        existing = WebGISLayer.query.filter_by(
            code=code
        ).first()

        if existing is None:
            db.session.add(
                WebGISLayer(
                    code=code,
                    name=name,
                    description=description,
                    source="GEE",
                    is_enabled=True,
                    display_order=order,
                )
            )

    db.session.commit()


def create_app(test_config=None):
    app = Flask(__name__)
    app.register_blueprint(usage_bp)
    app.register_blueprint(article_bp)

    if test_config is None:
        app.config.update(get_config())
    else:
        app.config.update(test_config)

    app.config.setdefault(
        "JWT_TOKEN_LOCATION",
        ["headers"],
    )

    app.config.setdefault(
        "JWT_ERROR_MESSAGE_KEY",
        "message",
    )

    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config.get(
                    "CORS_ORIGINS",
                    [
                        "http://127.0.0.1:5173",
                        "http://localhost:5173",
                    ],
                ),
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                ],
                "methods": [
                    "GET",
                    "POST",
                    "PATCH",
                    "OPTIONS",
                ],
            }
        },
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(layer_bp)

    app.register_blueprint(gee_bp)
    app.register_blueprint(ndvi_bp)
    app.register_blueprint(lst_bp)
    app.register_blueprint(tvdi_bp)
    app.register_blueprint(climate_bp)
    app.register_blueprint(statistics_bp)

    @jwt.token_in_blocklist_loader
    def check_token_revoked(
        jwt_header,
        jwt_payload,
    ):
        identity = jwt_payload.get("sub")

        try:
            user_id = int(identity)
        except (TypeError, ValueError):
            return True

        user = db.session.get(User, user_id)

        if user is None or not user.is_active:
            return True

        if jwt_payload.get(
            "token_version"
        ) != user.token_version:
            return True

        g.current_user = user
        return False

    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({
            "message": "Vui long dang nhap."
        }), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({
            "message": "Token khong hop le."
        }), 401

    @jwt.expired_token_loader
    def expired_token(header, payload):
        return jsonify({
            "message": "Phien dang nhap da het han."
        }), 401

    @jwt.revoked_token_loader
    def revoked_token(header, payload):
        return jsonify({
            "message": (
                "Phien dang nhap da bi vo hieu hoa."
            )
        }), 401

    @app.before_request
    def protect_api():
        if request.method == "OPTIONS":
            return None

        path = request.path.rstrip("/")

        if not path.startswith("/api/"):
            return None

        if path in PUBLIC_API_PATHS:
            return None

        verify_jwt_in_request()

        # Admin APIs: enforce role at the boundary.
        if path.startswith("/api/admin/"):
            user = g.current_user

            if user.role != "ADMIN":
                return jsonify({
                    "message": (
                        "Ban khong co quyen Admin."
                    )
                }), 403

        # Enforce disabled layers for all data routes.
        index = None

        for code in ("ndvi", "lst", "tvdi"):
            if path.startswith(f"/api/{code}/"):
                index = code
                break

        if path == "/api/statistics/index":
            index = request.args.get(
                "index", ""
            ).lower()

        if index in ("ndvi", "lst", "tvdi"):
            layer = WebGISLayer.query.filter_by(
                code=index
            ).first()

            if layer is None or not layer.is_enabled:
                return jsonify({
                    "message": (
                        "Lop du lieu hien dang bi tat."
                    )
                }), 403

        return None

    @app.get("/api/health")
    def health():
        return jsonify({
            "status": "ok",
            "service": "WebGIS Quang Tri",
        })

    @app.get("/api/routes")
    def routes():
        paths = sorted({
            rule.rule
            for rule in app.url_map.iter_rules()
            if rule.rule.startswith("/api/")
        })

        return jsonify(paths)

    @app.errorhandler(429)
    def too_many_requests(error):
        return jsonify({
            "message": (
                "Qua nhieu yeu cau. "
                "Vui long thu lai sau."
            )
        }), 429

    register_admin_commands(app)

    # Development bootstrap only.
    # Production should use database migrations.
    with app.app_context():
        db.create_all()
        seed_layers()

    return app


if __name__ == "__main__":
    application = create_app()

    application.run(
        host=os.getenv(
            "FLASK_HOST",
            "127.0.0.1",
        ),
        port=int(
            os.getenv("FLASK_PORT", "5000")
        ),
        debug=False,
    )