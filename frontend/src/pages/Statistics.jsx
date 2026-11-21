import DateRangeFilter from "./DateRangeFilter";
import api from "../services/api";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { apiGet } from "../services/api";
import { INDEX_CONFIG } from "../services/mapLayers";

function formatNumber(value) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "—";
  }

  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: 4,
  });
}

export default function Statistics() {
  const [start, setStart] = useState("2020-01-01");
  const [end, setEnd] = useState("2020-12-31");
  const [period, setPeriod] = useState(null);
  const [index, setIndex] = useState("ndvi");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!start || !end || start > end) return;
    setLoading(true); setError(""); setData(null); setPeriod(null);
    try {
      const result = await apiGet("/api/statistics/index", {start_date:start, end_date:end, index});
      setData(result); setPeriod({start,end,index});
      try { await api.post("/api/usage/events", {kind:"analysis", analysis_type:index, details:`${start} - ${end}`}); }
      catch (logError) { console.warn("Không thể ghi nhận lượt phân tích", logError); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const config = INDEX_CONFIG[index];

  const chartData = data
    ? [
        { name: "Nhỏ nhất", value: data.min },
        { name: "Trung bình", value: data.mean },
        { name: "Lớn nhất", value: data.max },
      ]
    : [];

  async function exportCSV() {
    if (!data) return;

    try { await api.post("/api/usage/events", {kind:"csv_export", analysis_type:period.index, details:`quangtri_${period.index}_${period.start}_${period.end}.csv`}); }
    catch (err) { setError(`Không thể ghi nhận lượt xuất CSV: ${err.message}`); return; }
    const lines = [
      "start_date,end_date,index,min,mean,max,scale_m",
      [
        period.start,
        period.end,
        period.index,
        data.min ?? "",
        data.mean ?? "",
        data.max ?? "",
        data.scale_m ?? "",
      ].join(","),
    ];

    const blob = new Blob(
      [lines.join("\r\n")],
      { type: "text/csv;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `quangtri_${period.index}_${period.start}_${period.end}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Thống kê dữ liệu viễn thám</h1>
          <p>
            Tổng hợp các giá trị nhỏ nhất, trung bình
            và lớn nhất của chỉ số được chọn.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="filter-row">
          <div className="control-group">
            <label htmlFor="stats-index">
              Chỉ số
            </label>

            <select
              id="stats-index"
              value={index}
              onChange={(event) =>
                { setIndex(event.target.value); setData(null); setPeriod(null); }
              }
            >
              {Object.entries(INDEX_CONFIG).map(
                ([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={exportCSV}
            disabled={!data || loading || !period || period.start !== start || period.end !== end || period.index !== index}
          >
            Xuất CSV
          </button>
        </div>
      </section>

      <DateRangeFilter start={start} end={end} onStart={setStart} onEnd={setEnd} onAnalyze={analyze} loading={loading} label="Thống kê" />
      {loading && (
        <div className="notice">
          Đang tính toán thống kê...
        </div>
      )}

      {error && (
        <div className="notice notice-error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>Giá trị nhỏ nhất</p>
            <h2>{formatNumber(data?.min)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>Giá trị trung bình</p>
            <h2>{formatNumber(data?.mean)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>Giá trị lớn nhất</p>
            <h2>{formatNumber(data?.max)}</h2>
          </div>
        </div>
      </div>

      <section className="panel chart-panel">
        <h2>
          Biểu đồ thống kê {config.label} {period ? `(${period.start} đến ${period.end})` : ""}
        </h2>

        {chartData.length > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  name={config.label}
                  fill="#0d9488"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted">
            Chưa có dữ liệu thống kê.
          </p>
        )}
      </section>

      <section className="panel">
        <h2>Thông tin phương pháp</h2>
        <p>
          Chỉ số: <strong>{config.fullName}</strong>
        </p>
        <p>
          Khoảng thời gian: <strong>{period ? `${period.start} đến ${period.end}` : "Chưa phân tích"}</strong>
        </p>
        <p>
          Độ phân giải tính toán:{" "}
          <strong>{data?.scale_m ?? "—"} m</strong>
        </p>

      </section>
    </div>
  );
}