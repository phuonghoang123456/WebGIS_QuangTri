
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parent

load_dotenv(BACKEND_DIR / ".env", override=True)


def get_config():
    database_url = os.getenv(
        "DATABASE_URL", ""
    ).strip()

    jwt_secret = os.getenv(
        "JWT_SECRET_KEY", ""
    ).strip()

    if not database_url.startswith(
        "postgresql+psycopg://"
    ):
        raise RuntimeError(
            "DATABASE_URL phai su dung PostgreSQL "
            "voi driver psycopg."
        )

    if (
        len(jwt_secret) < 32
        or jwt_secret.startswith("REPLACE_WITH_")
    ):
        raise RuntimeError(
            "JWT_SECRET_KEY chua duoc cau hinh an toan."
        )

    origins = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174",
        ).split(",")
        if origin.strip()
    ]

    return {
        "SQLALCHEMY_DATABASE_URI": database_url,
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "SQLALCHEMY_ENGINE_OPTIONS": {
            "pool_pre_ping": True,
        },
        "JWT_SECRET_KEY": jwt_secret,
        "JWT_ACCESS_TOKEN_EXPIRES": timedelta(
            minutes=int(
                os.getenv("JWT_ACCESS_MINUTES", "60")
            )
        ),
        "JWT_TOKEN_LOCATION": ["headers"],
        "JWT_ERROR_MESSAGE_KEY": "message",
        "CORS_ORIGINS": origins,
    }