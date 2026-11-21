
import {
  Layers,
  CalendarDays,
  Map,
  SlidersHorizontal,
} from "lucide-react";

import {
  INDEX_CONFIG,
} from "../../services/mapLayers";

const YEARS = Array.from(
  { length: 2025 - 2013 + 1 },
  (_, i) => 2025 - i
);

export default function MapControls({
  year = 2020,
  onYearChange = () => {},
  selectedIndex = "ndvi",
  onIndexChange = () => {},
  showBoundary = true,
  onBoundaryChange = () => {},
  baseMap = "osm",
  onBaseMapChange = () => {},
  opacity = 0.85,
  onOpacityChange = () => {},
  layerAvailable = true,
  loading = false,
}) {
  return (
    <div className="map-controls">
      <div className="panel-heading">
        <SlidersHorizontal size={19} />
        <h3>Điều khiển bản đồ</h3>
      </div>

      <div className="control-group">
        <label htmlFor="map-year">
          <CalendarDays size={16} />
          Năm phân tích
        </label>

        <select
          id="map-year"
          value={year}
          onChange={(event) =>
            onYearChange(
              Number(event.target.value)
            )
          }
        >
          {YEARS.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="map-index">
          <Layers size={16} />
          Chỉ số viễn thám
        </label>

        <select
          id="map-index"
          value={selectedIndex}
          onChange={(event) =>
            onIndexChange(
              event.target.value
            )
          }
        >
          <option value="">
            Không hiển thị chỉ số
          </option>

          {Object.entries(
            INDEX_CONFIG
          ).map(([key, config]) => (
            <option
              key={key}
              value={key}
            >
              {config.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="base-map">
          <Map size={16} />
          Bản đồ nền
        </label>

        <select
          id="base-map"
          value={baseMap}
          onChange={(event) =>
            onBaseMapChange(
              event.target.value
            )
          }
        >
          <option value="osm">
            OpenStreetMap
          </option>

          <option value="satellite">
            Ảnh vệ tinh Esri
          </option>
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="map-opacity">
          Độ hiển thị lớp ảnh:{" "}
          {Math.round(opacity * 100)}%
        </label>

        <input
          id="map-opacity"
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(event) =>
            onOpacityChange(
              Number(event.target.value)
            )
          }
        />
      </div>

      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showBoundary}
            onChange={(event) =>
              onBoundaryChange(
                event.target.checked
              )
            }
          />

          Hiển thị ranh giới Quảng Trị
        </label>
      </div>

      <div className="map-control-status">
        {loading ? (
          <span>
            Đang tải dữ liệu GEE...
          </span>
        ) : layerAvailable ? (
          <span>
            Sẵn sàng hiển thị bản đồ
          </span>
        ) : (
          <span>
            Chưa có lớp ảnh để hiển thị
          </span>
        )}
      </div>
    </div>
  );
}