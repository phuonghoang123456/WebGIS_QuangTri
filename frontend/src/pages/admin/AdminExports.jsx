import { useEffect, useState } from "react";
import { FileDown, RefreshCw } from "lucide-react";
import api from "../../services/api";

const TYPE_COLORS = {
  NDVI:    "badge-green",
  LST:     "badge-amber",
  TVDI:    "badge-red",
  CLIMATE: "badge-blue",
};

export default function AdminExports() {
  const [events, setEvents] = useState([]);
  const [total, setTotal]   = useState(0);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    setError("");

    api.get("/api/admin/usage/events", { params: { kind: "csv_export", limit: 100 } })
      .then((res) => {
        setEvents(res.data.events || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadData(); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Lịch sử xuất CSV</h1>
          <p>Theo dõi các lượt tải dữ liệu phân tích dưới dạng file CSV.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--accent-100)",
              color: "var(--accent-600)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <FileDown size={14} />
            {total} lượt
          </span>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="notice notice-error" role="alert">{error}</div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Tài khoản</th>
              <th>Chỉ số</th>
              <th>Tên file CSV</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--gray-400)", padding: "32px" }}>
                  Đang tải...
                </td>
              </tr>
            )}

            {!loading && events.length === 0 && !error && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--gray-400)", padding: "32px" }}>
                  Chưa có lịch sử xuất CSV.
                </td>
              </tr>
            )}

            {events.map((ev) => {
              const type = ev.analysis_type?.toUpperCase();
              return (
                <tr key={ev.id}>
                  <td style={{ fontSize: 12, color: "var(--gray-500)", whiteSpace: "nowrap" }}>
                    {new Date(ev.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                      {ev.username || "—"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${TYPE_COLORS[type] || "badge-gray"}`}>
                      {type}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--gray-600)" }}>
                    {ev.details || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ textAlign: "right" }}>
        Hiển thị tối đa 100 hoạt động gần nhất
      </p>
    </div>
  );
}