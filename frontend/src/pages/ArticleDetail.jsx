
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getArticleDetail,
  downloadArticlePdf,
} from "../services/articleService";

export default function ArticleDetail() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getArticleDetail(id)
      .then((result) => {
        if (active) {
          setArticle(result);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleDownload() {
    if (!article?.has_pdf) return;

    setDownloading(true);
    setError("");

    try {
      await downloadArticlePdf(
        article.id,
        article.original_filename ||
          "article.pdf"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        Đang tải bài báo...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page">
        <p>
          {error || "Không tìm thấy bài báo."}
        </p>
        <Link to="/articles">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/articles">
        ← Quay lại thư viện
      </Link>

      <section
        className="panel"
        style={{ marginTop: 18 }}
      >
        <h1>{article.title}</h1>

        <p>
          <strong>Tác giả:</strong>{" "}
          {article.authors}
        </p>

        <p>
          <strong>Năm công bố:</strong>{" "}
          {article.publication_year}
        </p>

        <p>
          <strong>Lĩnh vực:</strong>{" "}
          {article.category}
        </p>

        <p>
          <strong>Từ khóa:</strong>{" "}
          {article.keywords || "Không có"}
        </p>

        {article.doi && (
          <p>
            <strong>DOI:</strong>{" "}
            {article.doi}
          </p>
        )}

        <h2>Tóm tắt nghiên cứu</h2>

        <p style={{ whiteSpace: "pre-wrap" }}>
          {article.abstract}
        </p>

        {article.source_url && (
          <p>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem nguồn bài báo
            </a>
          </p>
        )}

        {article.has_pdf && (
          <button
            type="button"
            className="primary-button"
            disabled={downloading}
            onClick={handleDownload}
          >
            {downloading
              ? "Đang tải PDF..."
              : "Tải bài báo PDF"}
          </button>
        )}

        {error && (
          <p className="notice notice-error">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}