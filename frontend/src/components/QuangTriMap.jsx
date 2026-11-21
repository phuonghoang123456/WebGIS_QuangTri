
import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  ScaleControl,
  ZoomControl,
  useMap,
} from "react-leaflet";

import {
  BASE_MAPS,
  MAP_CENTER,
  MAP_ZOOM,
} from "../services/mapLayers";

/**
 * Tự động cập nhật kích thước bản đồ
 * khi vùng chứa thay đổi.
 */
function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const updateMapSize = () => {
      map.invalidateSize({
        animate: false,
        pan: false,
      });
    };

    const observer = new ResizeObserver(
      updateMapSize
    );

    observer.observe(container);

    const frame = requestAnimationFrame(
      updateMapSize
    );

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [map]);

  return null;
}

/**
 * Lớp bản đồ nền OpenStreetMap / Esri.
 */
function BaseMapLayer({ baseMap }) {
  const selectedBaseMap =
    BASE_MAPS[baseMap] || BASE_MAPS.osm;

  return (
    <TileLayer
      key={baseMap}
      url={selectedBaseMap.url}
      attribution={selectedBaseMap.attribution}
      maxZoom={19}
      tileSize={256}
      keepBuffer={6}
      updateWhenIdle={true}
      updateWhenZooming={false}
      eventHandlers={{
        tileerror: (event) => {
          console.error(
            "[WebGIS] Lỗi tải tile bản đồ nền:",
            event.tile?.src,
            event.error
          );
        },
      }}
    />
  );
}

/**
 * Bản đồ Leaflet chính của hệ thống.
 *
 * Các lớp NDVI, LST, TVDI và ranh giới
 * được truyền qua children.
 */
export default function QuangTriMap({
  children,
  baseMap = "osm",
  center = MAP_CENTER,
  zoom = MAP_ZOOM,
  className = "",
  style = {},
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={5}
      maxZoom={19}
      zoomControl={false}
      scrollWheelZoom={true}
      preferCanvas={true}
      className={`quangtri-map ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 420,
        ...style,
      }}
    >
      <BaseMapLayer baseMap={baseMap} />

      <MapResizeHandler />

      <ZoomControl
        position="topright"
      />

      <ScaleControl
        position="bottomleft"
        metric={true}
        imperial={false}
      />

      {children}
    </MapContainer>
  );
}