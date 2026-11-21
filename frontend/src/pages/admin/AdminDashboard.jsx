import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  FileDown,
  Users,
  UserCheck,
  BarChart2,
  Thermometer,
  Leaf,
  CloudRain,
  TrendingUp,
} from "lucide-react";
import api from "../../services/api";

const METRIC_CONFIG = [
  {
    key: "analyses_total",
    title: "Tổng lượt phân tích",
    link: "/admin/analyses",
    icon: Activity,
    color: "blue",
  },
  {
    key: "exports_total",
    title: "Tổng lượt xuất CSV",
    link: "/admin/exports",
    icon: FileDown,
    color: "green",
  },
  {
    key: "users_total",
    title: "Tổng tài khoản",
    link: "/admin/users",
    icon: Users,
    color: "purple",
  },
  {
    key: "users_active",
    title: "Tài khoản hoạt động",
    link: "/admin/users",
    icon: UserCheck,
    color: "teal",
  },
  {
    key: "ndvi",
    title: "Phân tích NDVI",
    link: "/admin/analyses",
    icon: Leaf,
    color: "green",
    byType: true,
  },
  {
    key: "lst",
    title: "Phân tích LST",
    link: "/admin/analyses",
    icon: Thermometer,
    color: "amber",
    byType: true,
  },
  {
    key: "tvdi",
    title: "Phân tích TVDI",
    link: "/admin/analyses",
    icon: BarChart2,
    color: "red",
    byType: true,
  },
  {
    key: "climate",
    title: "Phân tích khí hậu",
    link: "/admin/analyses",
    icon: CloudRain,
    color: "blue",
    byType: true,
  },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.get("/api/admin/usage/summary")
      .then((res) => { if (active) { setData(res.data); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message); setLoading(false); } });

    return () => { active = false; };
  }, []);

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>Dashboard quản trị</h1>
          <p>Thống kê tổng quan hoạt động hệ thống WebGIS Quảng Trị</p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 999,
            background: "var(--accent-100)",
            color: "var(--accent-600)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <TrendingUp size={13} />
          Live từ PostgreSQL
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="notice notice-error" role="alert">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="notice">Đang tải dữ liệu thống kê...</div>
      )}

      {/* Metric cards */}
      {data && (
        <div className="admin-metrics">
          {METRIC_CONFIG.map((cfg) => {
            const value = cfg.byType
              ? (data.by_type?.[cfg.key] ?? 0)
              : (data[cfg.key] ?? 0);
            const Icon = cfg.icon;

            return (
              <Link
                key={cfg.key}
                to={cfg.link}
                className="admin-metric"
              >
                <div className={`stat-card-icon ${cfg.color}`}>
                  <Icon size={20} />
                </div>
                <span>{cfg.title}</span>
                <strong>{value.toLocaleString("vi-VN")}</strong>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick links */}
      {data && (
        <div className="panel">
          <h2>Truy cập nhanh</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {[
              { to: "/admin/users",    label: "Quản lý tài khoản" },
              { to: "/admin/analyses", label: "Lịch sử phân tích" },
              { to: "/admin/exports",  label: "Lịch sử xuất CSV" },
              { to: "/admin/articles", label: "Duyệt bài báo" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="btn btn-ghost"
                style={{ textDecoration: "none" }}
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}