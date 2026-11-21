
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  LayoutDashboard,
  Map,
  CloudSun,
  Droplets,
  ChartColumn,
  LogIn,
  Satellite,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import WebGISMap from "./pages/WebGISMap";
import ClimateAnalysis from "./pages/ClimateAnalysis";
import DroughtMonitoring from "./pages/DroughtMonitoring";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";

const navigation = [
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
    path: "/login",
    label: "Đăng nhập",
    icon: LogIn,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Satellite size={28} />

        <div>
          <strong>WebGIS Quảng Trị</strong>
          <small>Viễn thám và khí hậu</small>
        </div>
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navigation-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <strong>Khu vực nghiên cứu</strong>
        <span>Quảng Trị trước năm 2025</span>
        <span>
          Landsat 8/9 · Google Earth Engine
        </span>
      </div>
    </aside>
  );
}

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <header className="topbar">
          <div>
            <strong>
              HỆ THỐNG WEBGIS GIÁM SÁT MÔI TRƯỜNG
            </strong>

            <p>
              Phân tích NDVI, LST, TVDI và biến động khí hậu
            </p>
          </div>

          <span className="topbar-status">
            Google Earth Engine
          </span>
        </header>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
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
              path="/login"
              element={<Login />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}