
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminArticles,
  reviewArticle,
} from "../../services/articleService";

const STATUS_LABELS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export default function AdminArticles() {
  const [articles, setArticles] =
    useState([]);

  const [status, setStatus] =
    useState("PENDING");

  const [loading, setLoading] =
    useState(false);

  const [processingId, setProcessingId] =
    useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadArticles(
    selectedStatus = status
  ) {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminArticles(
        selectedStatus
      );

      setArticles(result.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getAdminArticles("PENDING")
      .then((result) => {
        if (active) {
          setArticles(result.items || []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleReview(
    article,
    action
  ) {
    if (processingId !== null) return;

    let reason = "";

    if (action === "REJECTED") {
      const input = window.prompt(
        "Nhập lý do từ chối bài báo:"
      );

      if (input === null) return;

      reason = input.trim();

      if (!reason) {
        setError(
          "Bạn phải nhập lý do từ chối."
        );
        return;
      }
    }

    if (action === "APPROVED") {
      const confirmed = window.confirm(
        `Bạn có chắc muốn công khai bài báo "${article.title}"?`
      );

      if (!confirmed) return;
    }

    setProcessingId(article.id);
    setError("");
    setMessage("");

    try {
      const result = await reviewArticle(
        article.id,
        action,
        reason
      );

      setMessage(result.message);

      await loadArticles(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Quản lý bài báo khoa học</h1>
          <p>
            Xem xét và duyệt các bài báo
            do người dùng gửi lên hệ thống.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="filter-row">
          <div className="control-group">
            <label htmlFor="review-status">
              Trạng thái
            </label>

            <select
              id="review-status"
              value={status}
              onChange={(event) => {
                const next = event.target.value;
                setStatus(next);
                loadArticles(next);
              }}
            >
              <option value="PENDING">
                Chờ duyệt
              </option>

              <option value="APPROVED">
                Đã duyệt
              </option>

              <option value="REJECTED">
                Đã từ chối
              </option>

              <option value="">
                Tất cả
              </option>
            </select>
          </div>

          <button
            type="button"
            className="primary-button"
            disabled={loading}
            onClick={() =>
              loadArticles(status)
            }
          >
            {loading
              ? "Đang tải..."
              : "Làm mới"}
          </button>
        </div>
      </section>

      {error && (
        <div className="notice notice-error">
          {error}
        </div>
      )}

      {message && (
        <div className="notice">
          {message}
        </div>
      )}

      <section
        className="panel"
        style={{ marginTop: 20 }}
      >
        <h2>Danh sách bài báo</h2>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Năm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>
                      {article.title}
                    </strong>
                  </td>

                  <td>
                    {article.authors}
                  </td>

                  <td>
                    {article.publication_year}
                  </td>

                  <td>
                    {STATUS_LABELS[
                      article.status
                    ]}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <Link
                        to={`/articles/${article.id}`}
                      >
                        Xem bài
                      </Link>

                      {article.status ===
                        "PENDING" && (
                          <>
                            <button
                              type="button"
                              disabled={
                                processingId !== null
                              }
                              onClick={() =>
                                handleReview(
                                  article,
                                  "APPROVED"
                                )
                              }
                            >
                              Duyệt
                            </button>

                            <button
                              type="button"
                              disabled={
                                processingId !== null
                              }
                              onClick={() =>
                                handleReview(
                                  article,
                                  "REJECTED"
                                )
                              }
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {articles.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    Không có bài báo phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}