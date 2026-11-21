
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyArticles,
  submitArticle,
} from "../services/articleService";

const CATEGORIES = [
  "Viễn thám",
  "GIS",
  "Biến đổi khí hậu",
  "Hạn hán",
  "Môi trường",
  "Khác",
];

const STATUS_LABELS = {
  PENDING: "Đang chờ duyệt",
  APPROVED: "Đã công khai",
  REJECTED: "Bị từ chối",
};

const INITIAL_FORM = {
  title: "",
  authors: "",
  publication_year: String(
    new Date().getFullYear()
  ),
  abstract: "",
  keywords: "",
  category: "Viễn thám",
  doi: "",
  source_url: "",
};

export default function SubmitArticle() {
  const [form, setForm] = useState(
    INITIAL_FORM
  );

  const [pdf, setPdf] = useState(null);
  const [myArticles, setMyArticles] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [fileInputKey, setFileInputKey] =
    useState(0);

  async function loadMyArticles() {
    try {
      const result = await getMyArticles();
      setMyArticles(result.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;

    getMyArticles()
      .then((result) => {
        if (active) {
          setMyArticles(result.items || []);
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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (
        pdf &&
        pdf.size > 15 * 1024 * 1024
      ) {
        throw new Error(
          "Tệp PDF không được vượt quá 15 MB."
        );
      }

      const formData = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      if (pdf) {
        formData.append("pdf", pdf);
      }

      const result = await submitArticle(
        formData
      );

      setMessage(result.message);
      setForm(INITIAL_FORM);
      setPdf(null);

      setFileInputKey(
        (previous) => previous + 1
      );

      await loadMyArticles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Đăng bài báo khoa học</h1>
          <p>
            Gửi công trình nghiên cứu để
            quản trị viên xem xét trước khi công khai.
          </p>
        </div>
      </div>

      <section className="panel">
        <h2>Thông tin bài báo</h2>

        <form onSubmit={handleSubmit}>
          {[
            ["title", "Tiêu đề bài báo", "text"],
            ["authors", "Tên tác giả", "text"],
            [
              "publication_year",
              "Năm công bố",
              "number",
            ],
            ["keywords", "Từ khóa", "text"],
            ["doi", "DOI (nếu có)", "text"],
            [
              "source_url",
              "Đường dẫn nguồn (nếu có)",
              "url",
            ],
          ].map(([name, label, type]) => (
            <div
              className="control-group"
              key={name}
              style={{ marginBottom: 16 }}
            >
              <label htmlFor={name}>
                {label}
              </label>

              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                required={[
                  "title",
                  "authors",
                  "publication_year",
                ].includes(name)}
                maxLength={
                  name === "title"
                    ? 300
                    : name === "authors"
                    ? 500
                    : undefined
                }
                min={
                  name === "publication_year"
                    ? 1900
                    : undefined
                }
                max={
                  name === "publication_year"
                    ? 2100
                    : undefined
                }
                style={{ width: "100%" }}
              />
            </div>
          ))}

          <div
            className="control-group"
            style={{ marginBottom: 16 }}
          >
            <label htmlFor="category">
              Lĩnh vực nghiên cứu
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div
            className="control-group"
            style={{ marginBottom: 16 }}
          >
            <label htmlFor="abstract">
              Tóm tắt bài báo
            </label>

            <textarea
              id="abstract"
              name="abstract"
              rows={7}
              maxLength={10000}
              value={form.abstract}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div
            className="control-group"
            style={{ marginBottom: 16 }}
          >
            <label htmlFor="pdf">
              Tệp PDF (tùy chọn, tối đa 15 MB)
            </label>

            <input
              key={fileInputKey}
              id="pdf"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) =>
                setPdf(
                  event.target.files?.[0] || null
                )
              }
            />
          </div>

          <p className="muted">
            Chỉ đăng tải bài báo do bạn sở hữu
            hoặc có quyền chia sẻ. Bài báo cần
            được ADMIN duyệt trước khi xuất hiện
            trong thư viện công khai.
          </p>

          {error && (
            <p className="notice notice-error">
              {error}
            </p>
          )}

          {message && (
            <p className="notice">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Đang gửi..."
              : "Gửi bài báo chờ duyệt"}
          </button>
        </form>
      </section>

      <section
        className="panel"
        style={{ marginTop: 20 }}
      >
        <h2>Bài báo tôi đã đăng</h2>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Năm</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {myArticles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>
                    {article.publication_year}
                  </td>
                  <td>
                    {STATUS_LABELS[
                      article.status
                    ] || article.status}

                    {article.status ===
                      "REJECTED" &&
                      article.rejection_reason && (
                        <p className="muted">
                          Lý do:{" "}
                          {article.rejection_reason}
                        </p>
                      )}
                  </td>
                  <td>
                    <Link
                      to={`/articles/${article.id}`}
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}

              {myArticles.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    Bạn chưa đăng bài báo nào.
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