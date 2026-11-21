
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Đăng nhập hệ thống</h1>
          <p>
            Quản lý quyền truy cập và tài khoản
            người dùng WebGIS.
          </p>
        </div>
      </div>

      <div className="login-wrapper">
        <section className="panel login-panel">
          <div className="login-icon">
            <LockKeyhole size={30} />
          </div>

          <h2>WebGIS Quảng Trị</h2>

          <p className="muted">
            Chức năng xác thực đang được chuẩn bị.
            Hiện tại hệ thống chỉ cung cấp các trang
            phân tích dữ liệu công khai.
          </p>

          <div className="notice">
            <ShieldCheck size={18} />
            Chưa có API đăng nhập hoặc quản lý
            tài khoản ở Backend.
          </div>

          <button
            type="button"
            className="primary-button"
            disabled
          >
            Đăng nhập — Chưa khả dụng
          </button>
        </section>
      </div>
    </div>
  );
}