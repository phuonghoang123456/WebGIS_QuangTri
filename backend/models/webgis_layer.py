
from datetime import datetime, timezone

from backend.extensions import db


def utc_now():
    return datetime.now(timezone.utc)


class WebGISLayer(db.Model):
    __tablename__ = "webgis_layers"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    code = db.Column(
        db.String(30),
        unique=True,
        nullable=False,
    )

    name = db.Column(
        db.String(100),
        nullable=False,
    )

    description = db.Column(
        db.Text,
        nullable=False,
        default="",
    )

    source = db.Column(
        db.String(50),
        nullable=False,
        default="GEE",
    )

    is_enabled = db.Column(
        db.Boolean,
        nullable=False,
        default=True,
        server_default=db.true(),
    )

    display_order = db.Column(
        db.Integer,
        nullable=False,
        default=0,
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "description": self.description,
            "source": self.source,
            "is_enabled": self.is_enabled,
            "display_order": self.display_order,
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
        }
    