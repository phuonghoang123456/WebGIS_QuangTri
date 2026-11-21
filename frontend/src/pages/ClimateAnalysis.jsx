
import DateRangeFilter from "./DateRangeFilter";
import { useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  getClimateMonthly,
  summarizeClimate,
  formatClimateNumber,
} from "../services/climateService";

import {
  recordAnalysis,
} from "../services/usageService";

export default function ClimateAnalysis() {
  const [start, setStart] = useState("2020-01-01");
  const [end, setEnd] = useState("2020-12-31");
  const [period, setPeriod] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  async function analyze() {
    if (loading) return;

    if (!start || !end || start > end) {
      setError("Khoảng ngày không hợp lệ.");
      return;
    }

    setLoading(true);
    setError("");
    setHistoryError("");
    setData(null);
    setPeriod(null);

    try {
      const result = await getClimateMonthly({
        start_date: start,
        end_date: end,
      });

      setData(result);
      setPeriod({ start, end });

      // Chỉ ghi lịch sử sau khi phân tích thành công.
      try {
        await recordAnalysis(
          "climate",
          `Phân tích khí hậu từ ${start} đến ${end}`
        );
      } catch (historyErr) {
        console.error(
          "Không lưu được lịch sử phân tích:",
          historyErr
        );

        setHistoryError(
          `Đã phân tích thành công nhưng chưa lưu được lịch sử: ${
            historyErr.message || "Lỗi không xác định"
          }`
        );
      }
    } catch (err) {
      setError(
        err.message || "Không thể phân tích khí hậu."
      );
    } finally {
      setLoading(false);
    }
  }

  const monthly = data?.monthly ?? [];
  const summary = summarizeClimate(monthly);

  const chartData = monthly.map((item) => ({
    month: `T${item.month}/${
      item.year ?? period?.start.slice(0, 4)
    }`,
    temperature:
      item.temperature_c == null
        ? null
        : Number(item.temperature_c),
    rainfall:
      item.rainfall_mm == null
        ? null
        : Number(item.rainfall_mm),
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Phân tích khí hậu Quảng Trị</h1>
          <p>
            Phân tích nhiệt độ không khí và lượng mưa
            theo tháng từ ERA5-Land.
          </p>
        </div>
      </div>

      <DateRangeFilter
        start={start}
        end={end}
        onStart={setStart}
        onEnd={setEnd}
        onAnalyze={analyze}
        loading={loading}
        label="Phân tích khí hậu"
      />

      {period && (
        <p>
          Khoảng đã phân tích: {period.start} đến{" "}
          {period.end}
        </p>
      )}

      {loading && (
        <div className="notice">
          Đang phân tích khí hậu theo khoảng ngày...
        </div>
      )}

      {historyError && (
        <div
          className="notice notice-error"
          role="alert"
        >
          {historyError}
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
            <p>Nhiệt độ trung bình kỳ</p>
            <h2>
              {formatClimateNumber(
                summary.meanTemperature
              )}
              <small> °C</small>
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>Tổng lượng mưa kỳ</p>
            <h2>
              {formatClimateNumber(
                summary.totalRainfall
              )}
              <small> mm</small>
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>Số tháng có dữ liệu nhiệt độ</p>
            <h2>{summary.availableMonths}</h2>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <h2>Nhiệt độ không khí theo tháng</h2>

          {chartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="month" />
                  <YAxis unit="°C" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Nhiệt độ (°C)"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted">
              Chưa có dữ liệu.
            </p>
          )}
        </section>

        <section className="panel chart-panel">
          <h2>Lượng mưa theo tháng</h2>

          {chartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="month" />
                  <YAxis unit="mm" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="rainfall"
                    name="Lượng mưa (mm)"
                    fill="#0284c7"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted">
              Chưa có dữ liệu.
            </p>
          )}
        </section>
      </div>

      <section className="panel">
        <h2>Bảng số liệu khí hậu</h2>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Nhiệt độ (°C)</th>
                <th>Lượng mưa (mm)</th>
              </tr>
            </thead>

            <tbody>
              {monthly.map((item) => (
                <tr
                  key={`${item.year}-${item.month}`}
                >
                  <td>
                    Tháng {item.month}/{item.year}
                  </td>
                  <td>
                    {formatClimateNumber(
                      item.temperature_c
                    )}
                  </td>
                  <td>
                    {formatClimateNumber(
                      item.rainfall_mm
                    )}
                  </td>
                </tr>
              ))}

              {monthly.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    Chưa có dữ liệu khí hậu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}