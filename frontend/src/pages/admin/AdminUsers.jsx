import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ChevronLeft, ChevronRight, Users } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user } = useAuth();

  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]     = useState(null);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.get("/api/admin/users", {
        params: { page, per_page: 20 },
      });
      const d = res.data;
      setUsers(Array.isArray(d.items) ? d.items : []);
      setTotal(d.total ?? 0);
      setPages(d.pages ?? 1);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function updateUser(account, kind, value) {
    if (Number(account.id) === Number(user?.id)) {
      setError("Không thể thay đổi tài khoản đang đăng nhập.");
      return;
    }

    const action = kind === "role" ? "thay đổi vai trò" : value ? "mở khóa" : "khóa";

    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản "${account.username}"?`)) return;

    setBusy(account.id);
    setError("");
    setSuccess("");

    try {
      await api.patch(
        `/api/admin/users/${account.id}/${kind}`,
        kind === "role" ? { role: value } : { is_active: value }
      );
      setSuccess(`Đã cập nhật tài khoản "${account.username}".`);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Không thể cập nhật tài khoản.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Quản lý tài khoản</h1>
          <p>Xem, phân quyền và khóa tài khoản người dùng trong hệ thống.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--brand-50)",
              color: "var(--brand-700)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <Users size={14} />
            {total} tài khoản
          </span>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={loadUsers}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="notice notice-error" role="alert">{error}</div>
      )}
      {success && (
        <div className="notice notice-success" role="status">{success}</div>
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--gray-400)", padding: "32px" }}>
                  Đang tải...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--gray-400)", padding: "32px" }}>
                  Không có tài khoản để hiển thị.
                </td>
              </tr>
            )}

            {users.map((account) => {
              const isSelf = Number(account.id) === Number(user?.id);
              const isAdmin = account.role === "ADMIN";

              return (
                <tr key={account.id}>
                  <td style={{ color: "var(--gray-400)", fontSize: 12 }}>#{account.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: isAdmin
                            ? "linear-gradient(135deg, #6d28d9, #7c3aed)"
                            : "linear-gradient(135deg, var(--brand-600), var(--brand-500))",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {account.username.slice(0, 2).toUpperCase()}
                      </div>
                      <strong style={{ fontSize: 13 }}>{account.username}</strong>
                      {isSelf && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "1px 6px",
                            borderRadius: 999,
                            background: "var(--gray-100)",
                            color: "var(--gray-500)",
                          }}
                        >
                          bạn
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: "var(--gray-600)", fontSize: 13 }}>{account.email}</td>
                  <td>
                    <span className={`badge ${isAdmin ? "badge-purple" : "badge-blue"}`}>
                      {account.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${account.is_active ? "badge-green" : "badge-red"}`}>
                      {account.is_active ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--gray-500)" }}>
                    {account.created_at
                      ? new Date(account.created_at).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        disabled={busy !== null || isSelf}
                        onClick={() =>
                          updateUser(account, "role", isAdmin ? "USER" : "ADMIN")
                        }
                      >
                        {isAdmin ? "→ User" : "→ Admin"}
                      </button>
                      <button
                        type="button"
                        disabled={busy !== null || isSelf}
                        style={
                          account.is_active
                            ? { borderColor: "#fca5a5", color: "var(--danger-600)" }
                            : { borderColor: "#6ee7b7", color: "var(--success-600)" }
                        }
                        onClick={() =>
                          updateUser(account, "status", !account.is_active)
                        }
                      >
                        {account.is_active ? "Khóa" : "Mở khóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft size={14} /> Trước
        </button>

        <span className="pagination-info">
          Trang <strong>{page}</strong> / {pages}
        </span>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={page >= pages || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Sau <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}