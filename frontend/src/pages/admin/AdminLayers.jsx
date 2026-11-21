
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminLayers() {
  const [layers, setLayers] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/layers");
      const data = response.data;

      setLayers(
        Array.isArray(data)
          ? data
          : Array.isArray(data.layers)
            ? data.layers
            : []
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(layer) {
    setBusy(layer.id);

    try {
      await api.patch(
        `/api/admin/layers/${layer.id}`,
        {
          is_enabled: !layer.is_enabled,
        }
      );

      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="page">
      <h1>Quản lý lớp bản đồ</h1>
      <p>Bật hoặc tắt các lớp NDVI, LST và TVDI.</p>

      {error && (
        <p role="alert" className="auth-error">
          {error}
        </p>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {layers.map((layer) => (
              <tr key={layer.id}>
                <td>{layer.code}</td>
                <td>{layer.name}</td>
                <td>
                  {layer.is_enabled
                    ? "Đang bật"
                    : "Đã tắt"}
                </td>
                <td>
                  <button
                    disabled={busy === layer.id}
                    onClick={() => toggle(layer)}
                  >
                    {layer.is_enabled
                      ? "Tắt lớp"
                      : "Bật lớp"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}