
import { useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  House,
  LayoutDashboard,
  Map,
  CloudSun,
  Droplets,
  ChartColumn,
  Satellite,
  Users,
  FileDown,
  Activity,
  LogOut,
  ShieldCheck,
  BookOpen,
  FileCheck,
  Menu,
  X,
  Leaf,
} from "lucide-react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import WebGISMap from "./pages/WebGISMap";
import ClimateAnalysis from "./pages/ClimateAnalysis";
import DroughtMonitoring from "./pages/DroughtMonitoring";
import Statistics from "./pages/Statistics";

import ScientificArticles from "./pages/ScientificArticles";
import ArticleDetail from "./pages/ArticleDetail";
import SubmitArticle from "./pages/SubmitArticle";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalyses from "./pages/admin/AdminAnalyses";
import AdminExports from "./pages/admin/AdminExports";
import AdminArticles from "./pages/admin/AdminArticles";

import "./HorizontalNav.css";

// ================================
// MENU NGƯỜI DÙNG
// ================================

const userNav = [
  {
    path: "/home",
    label: "Trang chủ",
    icon: House,
  },
  {
    path: "/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    path: "/map",
    label: "Bản đồ WebGIS",
    icon: Map,
  },
  {
    path: "/climate",
    label: "Phân tích khí hậu",
    icon: CloudSun,
  },
  {
    path: "/drought",
    label: "Giám sát hạn hán",
    icon: Droplets,
  },
  {
    path: "/statistics",
    label: "Thống kê",
    icon: ChartColumn,
  },
  {
    path: "/articles",
    label: "Bài báo khoa học",
    icon: BookOpen,
  },
  {
    path: "/articles/submit",
    label: "Đăng bài báo",
    icon: FileCheck,
  },
];

// ================================
// MENU QUẢN TRỊ VIÊN
// ================================

const adminNav = [
  {
    path: "/admin",
    label: "Dashboard quản trị",
    icon: ShieldCheck,
  },
  {
    path: "/admin/analyses",
    label: "Quản lý phân tích",
    icon: Activity,
  },
  {
    path: "/admin/exports",
    label: "Quản lý xuất CSV",
    icon: FileDown,
  },
  {
    path: "/admin/users",
    label: "Quản lý tài khoản",
    icon: Users,
  },
  {
    path: "/admin/articles",
    label: "Duyệt bài báo khoa học",
    icon: BookOpen,
  },
];

// ================================
// GIAO DIỆN USER - MENU NGANG
// ================================

function UserLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="horizontal-app">
      <header className="horizontal-header">
        <NavLink
          to="/home"
          className="horizontal-brand"
          onClick={() => setMenuOpen(false)}
        >
          <div className="horizontal-brand-icon">
            <Leaf size={29} strokeWidth={2.4} />
          </div>

          <div className="horizontal-brand-text">
            <strong>WebGIS Quảng Trị</strong>
            <small>Phân tích môi trường & biến đổi khí hậu</small>
          </div>
        </NavLink>

        <nav
          className={`horizontal-navigation ${
            menuOpen ? "horizontal-navigation-open" : ""
          }`}
          aria-label="Điều hướng người dùng"
        >
          {userNav.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === "/articles" ||
                  item.path === "/home"
                }
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `horizontal-nav-link ${
                    isActive ? "horizontal-nav-active" : ""
                  }`
                }
              >
                <Icon size={16} className="horizontal-nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="horizontal-header-actions">
          <div className="horizontal-account">
            <div className="horizontal-avatar">
              {initials}
            </div>

            <span className="horizontal-username">
              {user?.username}
            </span>
          </div>

          <button
            type="button"
            className="horizontal-logout"
            onClick={logout}
            title="Đăng xuất"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>

          <button
            type="button"
            className="horizontal-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main className="horizontal-main">
        <Outlet />
      </main>

      <footer className="horizontal-footer">
        <span>WebGIS Quảng Trị</span>
        <span>Viễn thám · Google Earth Engine · GIS</span>
      </footer>
    </div>
  );
}

// ================================
// GIAO DIỆN ADMIN - GIỮ MENU DỌC
// ================================

function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Satellite size={22} color="#fff" />
          </div>

          <div>
            <strong>WebGIS Quảng Trị</strong>
            <small>Viễn thám & Khí hậu</small>
          </div>
        </div>

        <div className="sidebar-section-label">
          Quản trị hệ thống
        </div>

        <nav className="sidebar-navigation">
          {adminNav.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `navigation-link${isActive ? " active" : ""}`
                }
              >
                <span className="nav-icon-wrap">
                  <Icon size={18} />
                </span>

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-title">
            Khu vực nghiên cứu
          </div>

          <div className="sidebar-footer-sub">
            Quảng Trị · Viễn thám & Khí hậu
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Mở menu quản trị"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="topbar-title">
                QUẢN TRỊ HỆ THỐNG WEBGIS
              </div>

              <div className="topbar-subtitle">
                Quản lý tài khoản, phân tích và bài báo khoa học
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-user-chip">
              <div className="user-avatar">
                {initials}
              </div>

              <span className="user-name">
                {user?.username}
              </span>

              <span className="user-role admin">
                Admin
              </span>
            </div>

            <button
              type="button"
              className="logout-btn"
              onClick={logout}
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ================================
// ĐIỀU HƯỚNG MẶC ĐỊNH
// ================================

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/home" replace />;
}

// ================================
// ROUTES
// ================================

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomeRedirect />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* USER */}
      <Route
        element={
          <ProtectedRoute roles={["USER"]} />
        }
      >
        <Route element={<UserLayout />}>
          <Route
            path="/home"
            element={<HomePage />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/map"
            element={<WebGISMap />}
          />

          <Route
            path="/climate"
            element={<ClimateAnalysis />}
          />

          <Route
            path="/drought"
            element={<DroughtMonitoring />}
          />

          <Route
            path="/statistics"
            element={<Statistics />}
          />

          <Route
            path="/articles"
            element={<ScientificArticles />}
          />

          <Route
            path="/articles/submit"
            element={<SubmitArticle />}
          />

          <Route
            path="/articles/:id"
            element={<ArticleDetail />}
          />
        </Route>
      </Route>

      {/* ADMIN */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN"]} />
        }
      >
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/analyses"
            element={<AdminAnalyses />}
          />

          <Route
            path="/admin/exports"
            element={<AdminExports />}
          />

          <Route
            path="/admin/articles"
            element={<AdminArticles />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<HomeRedirect />}
      />
    </Routes>
  );
}

// ================================
// APP
// ================================

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
