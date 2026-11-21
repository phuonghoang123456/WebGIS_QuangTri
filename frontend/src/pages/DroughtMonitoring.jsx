import DateRangeFilter from "./DateRangeFilter";

import { useEffect, useState } from "react";

import MapViewer from "../components/maps/MapViewer";
import { recordAnalysis } from "../services/usageService";

import { getBoundary } from "../services/geeApi";

import {
  getDroughtTiles,
  getDroughtStatistics,
  classifyTVDI,
} from "../services/droughtService";

const droughtLevels = [
  { range: "0,0 – <0,2", label: "Rất ẩm", color: "#2166ac" },
  { range: "0,2 – <0,4", label: "Ẩm", color: "#67a9cf" },
  { range: "0,4 – <0,6", label: "Trung bình", color: "#fddbc7" },
  { range: "0,6 – <0,8", label: "Khô", color: "#ef8a62" },
  { range: "0,8 – 1,0", label: "Rất khô", color: "#b2182b" },
];

function formatValue(value) {
  return value == null || !Number.isFinite(Number(value))
    ? "—"
    : Number(value).toFixed(3);
}

export default function DroughtMonitoring() {
  const [start, setStart] = useState("2020-01-01");
  const [end, setEnd] = useState("2020-12-31");
  const [period, setPeriod] = useState(null);
  const [boundary, setBoundary] = useState(null);
  const [tileUrl, setTileUrl] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [boundaryError, setBoundaryError] = useState("");

  useEffect(() => {
    let active = true;

    getBoundary()
      .then((result) => {
        if (active) setBoundary(result);
      })
      .catch((err) => {
        if (active) setBoundaryError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  async function analyze() {
    if (!start || !end || start > end) return;
    setLoading(true); setError(""); setTileUrl(null); setStats(null); setPeriod(null);
    try {
      const params = {start_date:start, end_date:end};
      const [tiles, statistics] = await Promise.all([getDroughtTiles(params), getDroughtStatistics(params)]);
      setTileUrl(tiles.tile_url); setStats(statistics); setPeriod({start,end});
      try {
        await recordAnalysis("tvdi", `Giám sát hạn hán TVDI từ ${start} đến ${end}`);
      } catch (historyError) {
        console.error("Không thể ghi lịch sử giám sát hạn hán:", historyError);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const classification = classifyTVDI(stats?.mean);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Giám sát hạn hán bằng TVDI</h1>
          <p>
            Đánh giá mức độ khô hạn tương đối từ quan hệ
            NDVI và nhiệt độ bề mặt đất.
          </p>
        </div>

      </div>

      <DateRangeFilter start={start} end={end} onStart={setStart} onEnd={setEnd} onAnalyze={analyze} loading={loading} label="Phân tích hạn hán" />
      {period && <p>Khoảng đã phân tích: {period.start} đến {period.end}</p>}
      {loading && (
        <div className="notice">
          Đang tính toán TVDI theo khoảng ngày...
        </div>
      )}

      {error && (
        <div className="notice notice-error">
          {error}
        </div>
      )}

      {boundaryError && (
        <div className="notice notice-error">
          Không tải được ranh giới: {boundaryError}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>TVDI trung bình</p>
            <h2>{formatValue(stats?.mean)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>TVDI nhỏ nhất</p>
            <h2>{formatValue(stats?.min)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>TVDI lớn nhất</p>
            <h2>{formatValue(stats?.max)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>Phân nhóm giá trị trung bình</p>
            <h2
              style={{
                color: classification.color,
                fontSize: 22,
              }}
            >
              {classification.label}
            </h2>
          </div>
        </div>
      </div>

      <section className="panel">
        <h2>Bản đồ chỉ số TVDI</h2>

        <MapViewer
          boundary={boundary}
          showBoundary={true}
          tileUrl={tileUrl}
          selectedIndex="tvdi"
          year={period ? Number(period.start.slice(0,4)) : 2020}
          height={560}
        />
      </section>

      <section className="panel">
        <h2>Thang phân loại TVDI tham khảo</h2>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khoảng giá trị</th>
                <th>Mức độ</th>
                <th>Màu biểu diễn</th>
              </tr>
            </thead>

            <tbody>
              {droughtLevels.map((level) => (
                <tr key={level.label}>
                  <td>{level.range}</td>
                  <td>{level.label}</td>
                  <td>
                    <span
                      className="color-swatch"
                      style={{
                        background: level.color,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </section>
    </div>
  );
}