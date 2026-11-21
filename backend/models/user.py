
from datetime import datetime, timezone

from werkzeug.security import (
    check_password_hash,
    generate_password_hash,
)

from backend.extensions import db


def utc_now():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.BigInteger().with_variant(db.Integer, "sqlite"),
        primary_key=True,
    )

    username = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email = db.Column(
        db.String(254),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = db.Column(
        db.String(255),
        nullable=True,
    )

    google_sub = db.Column(
        db.String(255),
        unique=True,
        nullable=True,
    )

    role = db.Column(
        db.String(10),
        nullable=False,
        default="USER",
        server_default="USER",
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True,
        server_default=db.true(),
    )

    token_version = db.Column(
        db.Integer,
        nullable=False,
        default=0,
        server_default="0",
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    __table_args__ = (
        db.CheckConstraint(
            "role IN ('USER', 'ADMIN')",
            name="ck_users_role",
        ),
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(
            password,
            method="scrypt",
        )

    def check_password(self, password):
        if not self.password_hash:
            return False

        if not isinstance(password, str):
            return False

        return check_password_hash(
            self.password_hash,
            password,
        )

    def revoke_sessions(self):
        self.token_version += 1

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "auth_provider": (
                "google"
                if self.google_sub and not self.password_hash
                else "local"
            ),
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
        }
