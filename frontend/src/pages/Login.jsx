
import { useState } from "react";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();

    if (busy) return;

    setError("");
    setBusy(true);

    try {
      const account = await login(email.trim(), password);

      navigate(
        account.role === "ADMIN" ? "/admin" : "/home",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin" : "/home"}
        replace
      />
    );
  }

  return (
    <main className="webgis-auth">
      <section className="webgis-auth-visual">
        <div className="webgis-auth-visual-content">
          <div className="webgis-auth-brand">
            <div className="webgis-auth-brand-icon">
              <Leaf size={27} />
            </div>
            <div>
              <strong>WebGIS Quảng Trị</strong>
              <span>Viễn thám & Biến đổi khí hậu</span>
            </div>
          </div>

          <div className="webgis-auth-hero">
            <span className="webgis-auth-eyebrow">
              NỀN TẢNG WEBGIS MÔI TRƯỜNG
            </span>

            <h1>
              Khám phá môi trường
              <br />
              qua dữ liệu vệ tinh.
            </h1>

            <p>
              Hệ thống phân tích thảm thực vật, nhiệt độ
              bề mặt, hạn hán và dữ liệu khí hậu tại
              khu vực nghiên cứu Quảng Trị.
            </p>

            <div className="webgis-auth-tags">
              <span>NDVI</span>
              <span>LST</span>
              <span>TVDI</span>
              <span>Google Earth Engine</span>
            </div>
          </div>

          <div className="webgis-auth-visual-footer">
            <span>WebGIS Quảng Trị</span>
            <span>Landsat · Sentinel-2 · ERA5-Land</span>
          </div>
        </div>
      </section>

      <section className="webgis-auth-panel">
        <div className="webgis-auth-panel-inner">
          <div className="webgis-auth-mobile-brand">
            <Leaf size={25} />
            <strong>WebGIS Quảng Trị</strong>
          </div>

          <div className="webgis-auth-form-heading">
            <div className="webgis-auth-welcome">
              <ShieldCheck size={16} />
              CỔNG THÔNG TIN WEBGIS
            </div>

            <h2>Chào mừng trở lại!</h2>

            <p>
              Đăng nhập để tiếp tục khám phá dữ liệu
              môi trường và khí hậu Quảng Trị.
            </p>
          </div>

          <form
            className="webgis-auth-form"
            onSubmit={submit}
          >
            {location.state?.registered && (
              <div
                className="webgis-auth-alert success"
                role="status"
              >
                Tạo tài khoản thành công.
                Vui lòng đăng nhập để tiếp tục.
              </div>
            )}

            {error && (
              <div
                className="webgis-auth-alert error"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="webgis-auth-field">
              <label htmlFor="login-email">
                Địa chỉ email
              </label>

              <div className="webgis-auth-input-wrap">
                <Mail size={19} />

                <input
                  id="login-email"
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="webgis-auth-field">
              <label htmlFor="login-password">
                Mật khẩu
              </label>

              <div className="webgis-auth-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="webgis-auth-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              className="webgis-auth-submit"
              type="submit"
              disabled={busy}
            >
              <span>
                {busy
                  ? "Đang đăng nhập..."
                  : "Đăng nhập"}
              </span>

              {!busy && <ArrowRight size={19} />}
            </button>
            <GoogleSignIn />

           
            <div className="webgis-auth-switch">
              Chưa có tài khoản?{" "}
              <Link to="/register">
                Đăng ký ngay
              </Link>
            </div>
          </form>

          <div className="webgis-auth-bottom">
            <ShieldCheck size={16} />
            Kết nối với hệ thống WebGIS Quảng Trị
          </div>
        </div>
      </section>
    </main>
  );
}
