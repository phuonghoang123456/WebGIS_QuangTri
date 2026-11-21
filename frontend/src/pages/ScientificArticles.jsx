
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Search,
  Plus,
  FileText,
} from "lucide-react";

import { getArticles } from "../services/articleService";

const CATEGORIES = [
  "Viễn thám",
  "GIS",
  "Biến đổi khí hậu",
  "Hạn hán",
  "Môi trường",
  "Khác",
];

export default function ScientificArticles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadArticles() {
    setLoading(true);
    setError("");

    try {
      const result = await getArticles({
        search,
        category,
      });

      setArticles(result.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getArticles()
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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>
            <BookOpen
              size={25}
              style={{
                display: "inline",
                marginRight: 10,
              }}
            />
            Bài báo khoa học
          </h1>

          <p>
            Thư viện các công trình nghiên cứu
            về GIS, viễn thám, khí hậu và môi trường.
          </p>
        </div>

        <Link
          to="/articles/submit"
          className="primary-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <Plus size={18} />
          Đăng bài báo
        </Link>
      </div>

      <section className="panel">
        <div className="filter-row">
          <div className="control-group">
            <label htmlFor="article-search">
              Tìm kiếm
            </label>

            <input
              id="article-search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Tiêu đề, tác giả, từ khóa..."
            />
          </div>

          <div className="control-group">
            <label htmlFor="article-category">
              Lĩnh vực
            </label>

            <select
              id="article-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="">
                Tất cả lĩnh vực
              </option>

              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={loadArticles}
            disabled={loading}
          >
            <Search size={16} />
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </section>

      {error && (
        <div className="notice notice-error">
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 16,
          marginTop: 20,
        }}
      >
        {articles.map((article) => (
          <article
            className="panel"
            key={article.id}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <FileText
                size={34}
                color="#0d9488"
              />

              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0 }}>
                  {article.title}
                </h2>

                <p>
                  <strong>Tác giả:</strong>{" "}
                  {article.authors}
                </p>

                <p>
                  <strong>Năm:</strong>{" "}
                  {article.publication_year}
                  {" | "}
                  <strong>Lĩnh vực:</strong>{" "}
                  {article.category}
                </p>

                <p>
                  {article.abstract.length > 250
                    ? article.abstract.slice(0, 250) +
                      "..."
                    : article.abstract}
                </p>

                <Link
                  to={`/articles/${article.id}`}
                  className="primary-button"
                  style={{
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </article>
        ))}

        {!loading && articles.length === 0 && (
          <section className="panel">
            <p>
              Chưa có bài báo khoa học
              phù hợp với bộ lọc.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}