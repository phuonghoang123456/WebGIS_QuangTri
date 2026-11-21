
import {
  useEffect,
  useMemo,
} from "react";

import {
  GeoJSON,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import QuangTriMap from "../QuangTriMap";

import {
  INDEX_CONFIG,
} from "../../services/mapLayers";

function FitBoundary({
  boundary,
  enabled = true,
}) {
  const map = useMap();

  const bounds = useMemo(() => {
    if (!boundary) {
      return null;
    }

    try {
      const layer = L.geoJSON(boundary);
      const result = layer.getBounds();

      return result.isValid()
        ? result
        : null;
    } catch {
      return null;
    }
  }, [boundary]);

  useEffect(() => {
    if (!enabled || !bounds) {
      return;
    }

    map.fitBounds(bounds, {
      padding: [25, 25],
      maxZoom: 11,
    });
  }, [map, bounds, enabled]);

  return null;
}

function BoundaryLayer({
  boundary,
  showBoundary,
}) {
  if (!boundary || !showBoundary) {
    return null;
  }

  return (
    <GeoJSON
      key="quangtri-boundary"
      data={boundary}
      style={{
        color: "#e11d48",
        weight: 2.5,
        opacity: 1,
        fillColor: "#e11d48",
        fillOpacity: 0.02,
      }}
    />
  );
}

function SatelliteLayer({
  tileUrl,
  index,
  year,
  opacity,
}) {
  if (!tileUrl || !index) {
    return null;
  }

  return (
    <TileLayer
      key={`${index}-${year}-${tileUrl}`}
      url={tileUrl}
      opacity={opacity}
      maxZoom={19}
      maxNativeZoom={13}
      zIndex={350}
      attribution="Google Earth Engine / Landsat"
    />
  );
}

function MapLegend({ index }) {
  const config = INDEX_CONFIG[index];

  if (!config) {
    return null;
  }

  const gradient = `linear-gradient(
    to right,
    ${config.colors.join(", ")}
  )`;

  return (
    <div className="map-legend">
      <strong>
        {config.label}
        {config.unit
          ? ` (${config.unit})`
          : ""}
      </strong>

      <div
        className="map-legend-gradient"
        style={{
          height: 12,
          borderRadius: 5,
          marginTop: 9,
          background: gradient,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginTop: 5,
        }}
      >
        <span>{config.min}</span>
        <span>{config.max}</span>
      </div>
    </div>
  );
}

export default function MapViewer({
  boundary = null,
  showBoundary = true,
  tileUrl = null,
  selectedIndex = "ndvi",
  year = 2020,
  opacity = 0.85,
  baseMap = "osm",
  fitToBoundary = true,
  height = 600,
}) {
  return (
    <div
      className="map-viewer"
      style={{
        height,
        minHeight: 420,
        position: "relative",
      }}
    >
      <QuangTriMap
        baseMap={baseMap}
        style={{
          height: "100%",
          minHeight: 420,
        }}
      >
        <FitBoundary
          boundary={boundary}
          enabled={fitToBoundary}
        />

        <SatelliteLayer
          tileUrl={tileUrl}
          index={selectedIndex}
          year={year}
          opacity={opacity}
        />

        <BoundaryLayer
          boundary={boundary}
          showBoundary={showBoundary}
        />
      </QuangTriMap>

      {tileUrl && selectedIndex && (
        <MapLegend index={selectedIndex} />
      )}
    </div>
  );
}