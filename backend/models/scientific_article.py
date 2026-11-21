
from datetime import datetime, timezone

from backend.extensions import db


def utc_now():
    return datetime.now(timezone.utc).replace(
        tzinfo=None
    )


class ScientificArticle(db.Model):
    __tablename__ = "scientific_articles"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    title = db.Column(
        db.String(300),
        nullable=False,
    )

    authors = db.Column(
        db.String(500),
        nullable=False,
    )

    publication_year = db.Column(
        db.Integer,
        nullable=False,
    )

    abstract = db.Column(
        db.Text,
        nullable=False,
    )

    keywords = db.Column(
        db.String(500),
    )

    category = db.Column(
        db.String(100),
        nullable=False,
    )

    doi = db.Column(
        db.String(255),
    )

    source_url = db.Column(
        db.Text,
    )

    pdf_filename = db.Column(
        db.String(255),
    )

    original_filename = db.Column(
        db.String(255),
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="PENDING",
    )

    rejection_reason = db.Column(
        db.Text,
    )

    reviewed_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
    )

    reviewed_at = db.Column(
        db.DateTime,
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=utc_now,
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "authors": self.authors,
            "publication_year": self.publication_year,
            "abstract": self.abstract,
            "keywords": self.keywords,
            "category": self.category,
            "doi": self.doi,
            "source_url": self.source_url,
            "has_pdf": bool(self.pdf_filename),
            "original_filename": self.original_filename,
            "status": self.status,
            "rejection_reason": self.rejection_reason,
            "reviewed_by": self.reviewed_by,
            "reviewed_at": (
                self.reviewed_at.isoformat()
                if self.reviewed_at
                else None
            ),
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
        }
    