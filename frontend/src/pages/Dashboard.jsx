
import { useState } from "react";
import {
  Activity,
  Leaf,
  Thermometer,
  Droplets,
  MapPinned,
  CloudRain,
  RefreshCw,
} from "lucide-react";

import { apiGet } from "../services/api";

function formatNumber(value, digits = 2) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
  });
}

function StatCard({ title, value, unit, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <Icon size={23} />
      </div>

      <div>
        <p>{title}</p>
        <h2>
          {value}
          {unit && <small> {unit}</small>}
        </h2>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [startDate, setStartDate] =
    useState("2020-01-01");

  const [endDate, setEndDate] =
    useState("2020-12-31");

  const [data, setData] = useState(null);
  const [analyzedPeriod, setAnalyzedPeriod] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const invalidPeriod =
    !startDate ||
    !endDate ||
    startDate > endDate;

  async function handleAnalyze() {
    if (invalidPeriod || loading) return;

    setLoading(true);
    setError("");
    setData(null);
    setAnalyzedPeriod(null);

    try {
      const result = await apiGet(
        "/api/statistics/dashboard",
        {
          start_date: startDate,
          end_date: endDate,
        }
      );

      setData(result);
      setAnalyzedPeriod({
        start: startDate,
        end: endDate,
      });
    } catch (err) {
      setError(
        err.message ||
          "Không thể phân tích dữ liệu tổng quan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tổng quan WebGIS Quảng Trị</h1>
          <p>
            Giám sát thảm thực vật, nhiệt độ bề mặt,
            khô hạn và khí hậu theo khoảng thời gian.
          </p>
        </div>
      </div>

      <section className="panel">
        <h2>Lựa chọn thời gian phân tích</h2>

        <div className="filter-row">
          <div className="control-group">
            <label htmlFor="dashboard-start">
              Từ ngày
            </label>

            <input
              id="dashboard-start"
              type="date"
              value={startDate}
              min="2013-01-01"
              max="2025-12-31"
              onChange={(event) =>
                setStartDate(event.target.value)
              }
            />
          </div>

          <div className="control-group">
            <label htmlFor="dashboard-end">
              Đến ngày
            </label>

            <input
              id="dashboard-end"
              type="date"
              value={endDate}
              min="2013-01-01"
              max="2025-12-31"
              onChange={(event) =>
                setEndDate(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="primary-button"
            disabled={invalidPeriod || loading}
            onClick={handleAnalyze}
          >
            {loading
              ? "Đang phân tích..."
              : "Phân tích tổng quan"}
          </button>
        </div>

        {invalidPeriod && (
          <p className="notice notice-error">
            Vui lòng chọn khoảng thời gian hợp lệ.
            Ngày bắt đầu không được sau ngày kết thúc.
          </p>
        )}

        <p className="muted">
          Dữ liệu chỉ được tính toán sau khi
          nhấn nút Phân tích tổng quan.
        </p>
      </section>

      {loading && (
        <div className="notice">
          <RefreshCw size={18} />
          Đang tổng hợp dữ liệu từ Google Earth Engine...
        </div>
      )}

      {error && (
        <div className="notice notice-error">
          Không thể tải Dashboard: {error}
        </div>
      )}

      {analyzedPeriod && (
        <div className="notice">
          Kết quả phân tích từ{" "}
          <strong>{analyzedPeriod.start}</strong>
          {" "}đến{" "}
          <strong>{analyzedPeriod.end}</strong>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          title="Diện tích nghiên cứu"
          value={formatNumber(data?.area_km2)}
          unit="km²"
          icon={MapPinned}
        />

        <StatCard
          title="NDVI trung bình"
          value={formatNumber(data?.ndvi?.mean, 3)}
          icon={Leaf}
        />

        <StatCard
          title="LST trung bình"
          value={formatNumber(data?.lst?.mean)}
          unit="°C"
          icon={Thermometer}
        />

        <StatCard
          title="TVDI trung bình"
          value={formatNumber(data?.tvdi?.mean, 3)}
          icon={Droplets}
        />

        <StatCard
          title="Nhiệt độ không khí"
          value={formatNumber(
            data?.climate?.mean_temperature_c
          )}
          unit="°C"
          icon={Activity}
        />

        <StatCard
          title="Tổng lượng mưa trong kỳ"
          value={formatNumber(
            data?.climate?.total_rainfall_mm
          )}
          unit="mm"
          icon={CloudRain}
        />
      </div>

      <section className="panel">
        <h2>Thông tin dữ liệu</h2>

        <p>
          <strong>Khu vực:</strong>{" "}
          Quảng Trị trước năm 2025
        </p>

        <p>
          <strong>Khoảng thời gian:</strong>{" "}
          {analyzedPeriod
            ? `${analyzedPeriod.start} đến ${analyzedPeriod.end}`
            : "Chưa thực hiện phân tích"}
        </p>

        <p>
          <strong>Dữ liệu viễn thám:</strong>{" "}
          Landsat 8/9 Collection 2 Level 2
        </p>

        <p>
          <strong>Dữ liệu khí hậu:</strong>{" "}
          ERA5-Land
        </p>

        
      </section>
    </div>
  );
}