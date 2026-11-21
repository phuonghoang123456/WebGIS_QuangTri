
import { useEffect, useRef, useState } from "react";

import MapViewer from "../components/maps/MapViewer";
import { recordAnalysis } from "../services/usageService";

import {
  getBoundary,
  getSatelliteTiles,
  getSatelliteStatistics,
} from "../services/geeApi";

import {
  INDEX_CONFIG,
  BASE_MAPS,
} from "../services/mapLayers";

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: 3,
  });
}

export default function WebGISMap() {
  const [startDate, setStartDate] =
    useState("2020-01-01");

  const [endDate, setEndDate] =
    useState("2020-12-31");

  const [selectedIndex, setSelectedIndex] =
    useState("ndvi");

  const [baseMap, setBaseMap] = useState("osm");
  const [showBoundary, setShowBoundary] =
    useState(true);
  const [opacity, setOpacity] = useState(0.85);

  const [boundaryState, setBoundaryState] =
    useState({
      data: null,
      error: "",
    });

  const [layerState, setLayerState] =
    useState({
      tileUrl: null,
      statistics: null,
      period: null,
      index: null,
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestId = useRef(0);

  const invalidPeriod =
    !startDate ||
    !endDate ||
    startDate > endDate;

  // Chỉ tải ranh giới nền khi mở trang.
  // Không tự động tính toán NDVI, LST hoặc TVDI.
  useEffect(() => {
    let active = true;

    getBoundary()
      .then((result) => {
        if (!active) return;

        setBoundaryState({
          data: result,
          error: "",
        });
      })
      .catch((err) => {
        if (!active) return;

        setBoundaryState({
          data: null,
          error: err.message,
        });
      });

    return () => {
      active = false;
    };
  }, []);

  // Khi đổi ngày hoặc chỉ số, kết quả cũ
  // không còn được xem là kết quả hiện tại.
  function resetAnalysis() {
    requestId.current += 1;

    setLayerState({
      tileUrl: null,
      statistics: null,
      period: null,
      index: null,
    });

    setLoading(false);
    setError("");
  }

  function handleStartDateChange(value) {
    setStartDate(value);
    resetAnalysis();
  }

  function handleEndDateChange(value) {
    setEndDate(value);
    resetAnalysis();
  }

  function handleIndexChange(value) {
    setSelectedIndex(value);
    resetAnalysis();
  }

  async function handleAnalyze() {
    if (invalidPeriod || loading) return;

    const currentRequest = ++requestId.current;

    const params = {
      start_date: startDate,
      end_date: endDate,
    };

    setLoading(true);
    setError("");

    setLayerState({
      tileUrl: null,
      statistics: null,
      period: null,
      index: null,
    });

    try {
      const [tiles, statistics] = await Promise.all([
        getSatelliteTiles(selectedIndex, params),
        getSatelliteStatistics(selectedIndex, params),
      ]);

      // Bỏ qua kết quả nếu người dùng
      // đã thay đổi bộ lọc trong lúc tải.
      if (currentRequest !== requestId.current) {
        return;
      }

      if (!tiles?.tile_url) {
        throw new Error(
          "API không trả về đường dẫn lớp ảnh vệ tinh."
        );
      }

      setLayerState({
        tileUrl: tiles.tile_url,
        statistics,
        period: {
          start: startDate,
          end: endDate,
        },
        index: selectedIndex,
      });

      // Ghi nhận sau khi đã lấy được dữ liệu; lỗi ghi lịch sử không xóa kết quả.
      try {
        await recordAnalysis(selectedIndex, `Phân tích ${selectedIndex.toUpperCase()} từ ${startDate} đến ${endDate}`);
      } catch (historyError) {
        console.error("Không thể ghi lịch sử phân tích bản đồ:", historyError);
      }
    } catch (err) {
      if (currentRequest !== requestId.current) {
        return;
      }

      setError(
        err.message ||
          "Không thể phân tích dữ liệu vệ tinh."
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }

  const statistics = layerState.statistics;
  const analyzedPeriod = layerState.period;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Bản đồ WebGIS Quảng Trị</h1>
          <p>
            Phân tích và hiển thị NDVI, LST, TVDI
            theo khoảng thời gian từ Google Earth Engine.
          </p>
        </div>
      </div>

      <div className="map-page-layout">
        <aside className="panel">
          <h2>Bộ lọc phân tích</h2>

          <div className="control-group">
            <label htmlFor="map-start-date">
              Từ ngày
            </label>

            <input
              id="map-start-date"
              type="date"
              min="2013-01-01"
              max="2025-12-31"
              value={startDate}
              onChange={(event) =>
                handleStartDateChange(event.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div
            className="control-group"
            style={{ marginTop: 14 }}
          >
            <label htmlFor="map-end-date">
              Đến ngày
            </label>

            <input
              id="map-end-date"
              type="date"
              min="2013-01-01"
              max="2025-12-31"
              value={endDate}
              onChange={(event) =>
                handleEndDateChange(event.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div
            className="control-group"
            style={{ marginTop: 14 }}
          >
            <label htmlFor="map-index">
              Chỉ số phân tích
            </label>

            <select
              id="map-index"
              value={selectedIndex}
              onChange={(event) =>
                handleIndexChange(event.target.value)
              }
              style={{ width: "100%" }}
            >
              {Object.entries(INDEX_CONFIG).map(
                ([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} - {config.description}
                  </option>
                )
              )}
            </select>
          </div>

          {invalidPeriod && (
            <p className="notice notice-error">
              Ngày bắt đầu phải trước
              hoặc bằng ngày kết thúc.
            </p>
          )}

          <button
            type="button"
            className="primary-button"
            onClick={handleAnalyze}
            disabled={invalidPeriod || loading}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "12px",
            }}
          >
            {loading
              ? "Đang phân tích..."
              : "Phân tích bản đồ"}
          </button>

          <hr style={{ margin: "24px 0" }} />

          <h3>Hiển thị bản đồ</h3>

          <div className="control-group">
            <label htmlFor="map-basemap">
              Bản đồ nền
            </label>

            <select
              id="map-basemap"
              value={baseMap}
              onChange={(event) =>
                setBaseMap(event.target.value)
              }
              style={{ width: "100%" }}
            >
              {Object.entries(BASE_MAPS).map(
                ([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                )
              )}
            </select>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 16,
            }}
          >
            <input
              type="checkbox"
              checked={showBoundary}
              onChange={(event) =>
                setShowBoundary(event.target.checked)
              }
            />
            Hiển thị ranh giới Quảng Trị
          </label>

          <div
            className="control-group"
            style={{ marginTop: 18 }}
          >
            <label htmlFor="map-opacity">
              Độ trong suốt lớp dữ liệu:{" "}
              {Math.round(opacity * 100)}%
            </label>

            <input
              id="map-opacity"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(event) =>
                setOpacity(Number(event.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          <hr style={{ margin: "24px 0" }} />

          <div className="map-statistics">
            <h3>Thống kê chỉ số</h3>

            <p>
              <strong>Trung bình:</strong>{" "}
              {formatNumber(statistics?.mean)}
            </p>

            <p>
              <strong>Nhỏ nhất:</strong>{" "}
              {formatNumber(statistics?.min)}
            </p>

            <p>
              <strong>Lớn nhất:</strong>{" "}
              {formatNumber(statistics?.max)}
            </p>

            {analyzedPeriod ? (
              <p>
                <strong>Thời gian:</strong>
                <br />
                {analyzedPeriod.start}
                {" đến "}
                {analyzedPeriod.end}
              </p>
            ) : (
              <p className="muted">
                Chưa thực hiện phân tích.
              </p>
            )}

            {layerState.index === "lst" && (
              <p className="muted">
                Đơn vị nhiệt độ: °C
              </p>
            )}
          </div>
        </aside>

        <section className="map-content">
          {loading && (
            <div className="notice">
              Đang phân tích{" "}
              {selectedIndex.toUpperCase()}{" "}
              trong khoảng thời gian đã chọn...
            </div>
          )}

          {error && (
            <div className="notice notice-error">
              Lỗi dữ liệu vệ tinh: {error}
            </div>
          )}

          {boundaryState.error && (
            <div className="notice notice-error">
              Lỗi ranh giới: {boundaryState.error}
            </div>
          )}

          <MapViewer
            boundary={boundaryState.data}
            showBoundary={showBoundary}
            tileUrl={layerState.tileUrl}
            selectedIndex={
              layerState.index || selectedIndex
            }
            year={
              analyzedPeriod
                ? Number(
                    analyzedPeriod.start.slice(0, 4)
                  )
                : 2020
            }
            opacity={opacity}
            baseMap={baseMap}
            height={620}
          />

          {analyzedPeriod && (
            <div
              className="panel"
              style={{ marginTop: 16 }}
            >
              <strong>
                Kết quả phân tích{" "}
                {layerState.index?.toUpperCase()}
              </strong>

              <p>
                Từ {analyzedPeriod.start} đến{" "}
                {analyzedPeriod.end}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}