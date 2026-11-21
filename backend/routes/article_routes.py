
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from flask import (
    Blueprint,
    current_app,
    jsonify,
    request,
    send_file,
)
from flask_jwt_extended import jwt_required
from sqlalchemy import or_
from werkzeug.exceptions import RequestEntityTooLarge

from backend.extensions import db
from backend.models.scientific_article import (
    ScientificArticle,
)
from backend.security.permissions import current_user


article_bp = Blueprint(
    "articles",
    __name__,
    url_prefix="/api/articles",
)

MAX_PDF_SIZE = 15 * 1024 * 1024

ALLOWED_CATEGORIES = {
    "Viễn thám",
    "GIS",
    "Biến đổi khí hậu",
    "Hạn hán",
    "Môi trường",
    "Khác",
}


def get_upload_folder():
    folder = (
        Path(current_app.instance_path)
        / "article_pdfs"
    )

    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    return folder


def is_admin(user):
    return user is not None and user.role == "ADMIN"


def get_authenticated_user():
    user = current_user()

    if user is None or not user.is_active:
        return None

    return user


def valid_url(value):
    if not value:
        return True

    parsed = urlparse(value)

    return (
        parsed.scheme in ("http", "https")
        and bool(parsed.netloc)
        and not parsed.username
        and not parsed.password
    )


def article_or_404(article_id):
    return db.get_or_404(
        ScientificArticle,
        article_id,
    )


def can_read(article, user):
    if article.status == "APPROVED":
        return True

    return (
        user is not None
        and (
            article.user_id == user.id
            or is_admin(user)
        )
    )


def error_response(message, status=400):
    return jsonify({
        "error": message
    }), status


@article_bp.get("")
def list_articles():
    search = request.args.get(
        "search", ""
    ).strip()[:200]

    category = request.args.get(
        "category", ""
    ).strip()

    query = ScientificArticle.query.filter_by(
        status="APPROVED"
    )

    if search:
        pattern = f"%{search}%"

        query = query.filter(
            or_(
                ScientificArticle.title.ilike(pattern),
                ScientificArticle.authors.ilike(pattern),
                ScientificArticle.keywords.ilike(pattern),
                ScientificArticle.abstract.ilike(pattern),
            )
        )

    if category:
        query = query.filter_by(
            category=category
        )

    articles = (
        query
        .order_by(
            ScientificArticle.created_at.desc()
        )
        .limit(100)
        .all()
    )

    return jsonify({
        "items": [
            item.to_dict()
            for item in articles
        ]
    })


@article_bp.get("/mine")
@jwt_required()
def my_articles():
    user = get_authenticated_user()

    if user is None:
        return error_response(
            "Phiên đăng nhập không hợp lệ.",
            401,
        )

    articles = (
        ScientificArticle.query
        .filter_by(user_id=user.id)
        .order_by(
            ScientificArticle.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "items": [
            item.to_dict()
            for item in articles
        ]
    })


@article_bp.get("/admin")
@jwt_required()
def admin_articles():
    user = get_authenticated_user()

    if not is_admin(user):
        return error_response(
            "Bạn không có quyền quản trị.",
            403,
        )

    status = request.args.get(
        "status", ""
    ).upper()

    query = ScientificArticle.query

    if status in (
        "PENDING",
        "APPROVED",
        "REJECTED",
    ):
        query = query.filter_by(
            status=status
        )

    articles = (
        query
        .order_by(
            ScientificArticle.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "items": [
            item.to_dict()
            for item in articles
        ]
    })


@article_bp.post("")
@jwt_required()
def create_article():
    user = get_authenticated_user()

    if user is None:
        return error_response(
            "Phiên đăng nhập không hợp lệ.",
            401,
        )

    title = request.form.get(
        "title", ""
    ).strip()

    authors = request.form.get(
        "authors", ""
    ).strip()

    abstract = request.form.get(
        "abstract", ""
    ).strip()

    keywords = request.form.get(
        "keywords", ""
    ).strip()

    category = request.form.get(
        "category", ""
    ).strip()

    doi = request.form.get(
        "doi", ""
    ).strip()

    source_url = request.form.get(
        "source_url", ""
    ).strip()

    year_raw = request.form.get(
        "publication_year", ""
    ).strip()

    if not title or len(title) > 300:
        return error_response(
            "Tiêu đề phải có 1–300 ký tự."
        )

    if not authors or len(authors) > 500:
        return error_response(
            "Tên tác giả phải có 1–500 ký tự."
        )

    if not abstract or len(abstract) > 10000:
        return error_response(
            "Tóm tắt phải có 1–10000 ký tự."
        )

    if len(keywords) > 500:
        return error_response(
            "Từ khóa tối đa 500 ký tự."
        )

    if category not in ALLOWED_CATEGORIES:
        return error_response(
            "Lĩnh vực nghiên cứu không hợp lệ."
        )

    if len(doi) > 255:
        return error_response(
            "DOI quá dài."
        )

    if (
        len(source_url) > 2000
        or not valid_url(source_url)
    ):
        return error_response(
            "Đường dẫn nguồn phải là URL HTTP/HTTPS hợp lệ."
        )

    try:
        year = int(year_raw)
    except ValueError:
        return error_response(
            "Năm công bố không hợp lệ."
        )

    if year < 1900 or year > 2100:
        return error_response(
            "Năm công bố phải thuộc 1900–2100."
        )

    pdf = request.files.get("pdf")
    saved_filename = None
    original_filename = None

    if pdf and pdf.filename:
        original_filename = os.path.basename(
            pdf.filename.replace("\\", "/")
        )

        if not original_filename.lower().endswith(
            ".pdf"
        ):
            return error_response(
                "Chỉ chấp nhận tệp PDF."
            )

        if len(original_filename) > 255:
            return error_response(
                "Tên tệp quá dài."
            )

        # Kiểm tra dung lượng và chữ ký PDF.
        content = pdf.stream.read(
            MAX_PDF_SIZE + 1
        )

        if len(content) > MAX_PDF_SIZE:
            return error_response(
                "Tệp PDF không được vượt quá 15 MB.",
                413,
            )

        if not content.startswith(b"%PDF-"):
            return error_response(
                "Nội dung tệp không phải PDF hợp lệ."
            )

        saved_filename = (
            f"{uuid.uuid4().hex}.pdf"
        )

        destination = (
            get_upload_folder()
            / saved_filename
        )

        destination.write_bytes(content)

    article = ScientificArticle(
        user_id=user.id,
        title=title,
        authors=authors,
        publication_year=year,
        abstract=abstract,
        keywords=keywords,
        category=category,
        doi=doi or None,
        source_url=source_url or None,
        pdf_filename=saved_filename,
        original_filename=original_filename,
        status="PENDING",
    )

    try:
        db.session.add(article)
        db.session.commit()

    except Exception:
        db.session.rollback()

        if saved_filename:
            (
                get_upload_folder()
                / saved_filename
            ).unlink(missing_ok=True)

        current_app.logger.exception(
            "Cannot create article"
        )

        return error_response(
            "Không thể lưu bài báo.",
            500,
        )

    return jsonify({
        "message": (
            "Đăng bài thành công. "
            "Bài báo đang chờ ADMIN duyệt."
        ),
        "article": article.to_dict(),
    }), 201


@article_bp.get("/<int:article_id>")
@jwt_required(optional=True)
def article_detail(article_id):
    article = article_or_404(article_id)
    user = None

    try:
        user = get_authenticated_user()
    except Exception:
        user = None

    if not can_read(article, user):
        return error_response(
            "Không tìm thấy bài báo.",
            404,
        )

    return jsonify(article.to_dict())


@article_bp.get("/<int:article_id>/pdf")
@jwt_required(optional=True)
def download_pdf(article_id):
    article = article_or_404(article_id)

    user = None

    try:
        user = get_authenticated_user()
    except Exception:
        user = None

    if not can_read(article, user):
        return error_response(
            "Không tìm thấy bài báo.",
            404,
        )

    if not article.pdf_filename:
        return error_response(
            "Bài báo không có tệp PDF.",
            404,
        )

    path = (
        get_upload_folder()
        / article.pdf_filename
    )

    if not path.is_file():
        return error_response(
            "Không tìm thấy tệp PDF.",
            404,
        )

    return send_file(
        path,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=(
            article.original_filename
            or "article.pdf"
        ),
    )


@article_bp.patch("/<int:article_id>/review")
@jwt_required()
def review_article(article_id):
    user = get_authenticated_user()

    if not is_admin(user):
        return error_response(
            "Bạn không có quyền duyệt bài.",
            403,
        )

    article = article_or_404(article_id)

    if article.status != "PENDING":
        return error_response(
            "Chỉ có thể duyệt bài đang chờ.",
            409,
        )

    payload = request.get_json(
        silent=True
    ) or {}

    action = str(
        payload.get("action", "")
    ).upper()

    reason = str(
        payload.get("reason", "")
    ).strip()

    if action not in (
        "APPROVED",
        "REJECTED",
    ):
        return error_response(
            "Trạng thái duyệt không hợp lệ."
        )

    if (
        action == "REJECTED"
        and not reason
    ):
        return error_response(
            "Vui lòng nhập lý do từ chối."
        )

    if len(reason) > 2000:
        return error_response(
            "Lý do từ chối quá dài."
        )

    article.status = action
    article.rejection_reason = (
        reason if action == "REJECTED"
        else None
    )

    article.reviewed_by = user.id
    article.reviewed_at = (
        datetime.now(timezone.utc)
        .replace(tzinfo=None)
    )

    db.session.commit()

    return jsonify({
        "message": (
            "Đã cập nhật trạng thái bài báo."
        ),
        "article": article.to_dict(),
    })