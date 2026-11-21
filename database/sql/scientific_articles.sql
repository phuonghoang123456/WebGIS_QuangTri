
-- Chạy trên PostgreSQL: webgis_quangtri
-- Giả định bảng người dùng hiện có là "users",
-- khóa chính "id" kiểu INTEGER.
-- Nếu bảng hiện tại có tên khác, sửa khóa ngoại.

CREATE TABLE IF NOT EXISTS scientific_articles (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    title VARCHAR(300) NOT NULL,
    authors VARCHAR(500) NOT NULL,
    publication_year INTEGER NOT NULL,

    abstract TEXT NOT NULL,
    keywords VARCHAR(500),
    category VARCHAR(100) NOT NULL,

    doi VARCHAR(255),
    source_url TEXT,

    pdf_filename VARCHAR(255),
    original_filename VARCHAR(255),

    status VARCHAR(20) NOT NULL
        DEFAULT 'PENDING',

    rejection_reason TEXT,

    reviewed_by INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_article_status
        CHECK (
            status IN (
                'PENDING',
                'APPROVED',
                'REJECTED'
            )
        ),

    CONSTRAINT chk_article_year
        CHECK (
            publication_year
            BETWEEN 1900 AND 2100
        )
);

CREATE INDEX IF NOT EXISTS idx_article_status
    ON scientific_articles(status);

CREATE INDEX IF NOT EXISTS idx_article_user
    ON scientific_articles(user_id);

CREATE INDEX IF NOT EXISTS idx_article_created
    ON scientific_articles(created_at DESC);