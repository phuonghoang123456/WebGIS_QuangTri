
import { useState } from "react";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import {
  Link,
  Navigate,
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
  UserRound,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function field(key) {
    return (event) => {
      setForm((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));
    };
  }

  async function submit(event) {
    event.preventDefault();

    if (busy) return;

    setError("");

    if (form.username.trim().length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự.");
      return;
    }

    if (form.password.length < 12) {
      setError("Mật khẩu phải có ít nhất 12 ký tự.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setBusy(true);

    try {
      await api.post("/api/auth/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Đăng ký thất bại. Vui lòng thử lại."
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
              THAM GIA HỆ THỐNG WEBGIS
            </span>

            <h1>
              Kết nối dữ liệu.
              <br />
              Khám phá môi trường.
            </h1>

            <p>
              Tạo tài khoản để truy cập bản đồ viễn thám,
              phân tích dữ liệu khí hậu, theo dõi hạn hán
              và chia sẻ nghiên cứu khoa học.
            </p>

            <div className="webgis-auth-tags">
              <span>Bản đồ WebGIS</span>
              <span>Phân tích khí hậu</span>
              <span>Bài báo khoa học</span>
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
              TẠO TÀI KHOẢN MỚI
            </div>

            <h2>Bắt đầu khám phá!</h2>

            <p>
              Điền thông tin bên dưới để đăng ký
              tài khoản người dùng WebGIS Quảng Trị.
            </p>
          </div>

          <form
            className="webgis-auth-form"
            onSubmit={submit}
          >
            {error && (
              <div
                className="webgis-auth-alert error"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="webgis-auth-field">
              <label htmlFor="reg-username">
                Tên đăng nhập
              </label>

              <div className="webgis-auth-input-wrap">
                <UserRound size={19} />

                <input
                  id="reg-username"
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                  minLength={3}
                  required
                  value={form.username}
                  onChange={field("username")}
                />
              </div>
            </div>

            <div className="webgis-auth-field">
              <label htmlFor="reg-email">
                Địa chỉ email
              </label>

              <div className="webgis-auth-input-wrap">
                <Mail size={19} />

                <input
                  id="reg-email"
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={field("email")}
                />
              </div>
            </div>

            <div className="webgis-auth-field">
              <label htmlFor="reg-password">
                Mật khẩu
              </label>

              <div className="webgis-auth-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 12 ký tự"
                  autoComplete="new-password"
                  minLength={12}
                  required
                  value={form.password}
                  onChange={field("password")}
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

            <div className="webgis-auth-field">
              <label htmlFor="reg-confirm">
                Xác nhận mật khẩu
              </label>

              <div className="webgis-auth-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  minLength={12}
                  required
                  value={form.confirm}
                  onChange={field("confirm")}
                />

                <button
                  type="button"
                  className="webgis-auth-eye"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  aria-label={
                    showConfirm
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                >
                  {showConfirm ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <p className="webgis-auth-hint">
              Sử dụng mật khẩu dài ít nhất 12 ký tự.
            </p>

            <button
              className="webgis-auth-submit"
              type="submit"
              disabled={busy}
            >
              <span>
                {busy
                  ? "Đang tạo tài khoản..."
                  : "Tạo tài khoản"}
              </span>

              {!busy && <ArrowRight size={19} />}
            </button>

            <div className="webgis-auth-switch">
              Đã có tài khoản?{" "}
              <Link to="/login">
                Đăng nhập ngay
              </Link>
            </div>
          </form>

          <div className="webgis-auth-bottom">
            <ShieldCheck size={16} />
            Tài khoản mới sử dụng quyền USER
          </div>
        </div>
      </section>
    </main>
  );
}
