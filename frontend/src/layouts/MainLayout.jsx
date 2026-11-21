
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  {
    path: "/",
    icon: "📊",
    label: "Tổng quan",
    end: true,
  },
  {
    path: "/map",
    icon: "🗺️",
    label: "Bản đồ WebGIS",
  },
  {
    path: "/climate",
    icon: "🌦️",
    label: "Phân tích khí hậu",
  },
  {
    path: "/drought",
    icon: "🌱",
    label: "Giám sát khô hạn",
  },
  {
    path: "/statistics",
    icon: "📈",
    label: "Thống kê - Báo cáo",
  },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">🌍</div>
          <div>
            <h2>WebGIS Quảng Trị</h2>
            <p>Giám sát khí hậu và khô hạn</p>
          </div>
        </div>

        <div className="sidebar-section-title">
          HỆ THỐNG QUẢN LÝ
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `menu-item ${isActive ? "menu-item-active" : ""}`
              }
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot"></span>
            Hệ thống WebGIS
          </div>
          <small>Quảng Trị | Giai đoạn 2010–2025</small>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Mở hoặc đóng menu"
            >
              ☰
            </button>

            <div>
              <h1>HỆ THỐNG WEBGIS QUẢNG TRỊ</h1>
              <p>
                Phân tích biến động khí hậu và giám sát khô hạn
              </p>
            </div>
          </div>

          <div className="topbar-right">
            <span className="topbar-badge">
              2010 – 2025
            </span>

            <NavLink to="/login" className="user-button">
              Đăng nhập
            </NavLink>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <footer className="main-footer">
          WebGIS Quảng Trị | Dữ liệu khí hậu và viễn thám
        </footer>
      </div>
    </div>
  );
}