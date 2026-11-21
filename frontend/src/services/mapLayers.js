
export const MAP_CENTER = [
  16.75,
  107.05,
];

export const MAP_ZOOM = 9;

export const BASE_MAPS = {
  osm: {
    name: "OpenStreetMap",
    url:
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },

  satellite: {
    name: "Ảnh vệ tinh Esri",
    url:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri",
  },
};

export const INDEX_CONFIG = {
  ndvi: {
    label: "NDVI",
    fullName:
      "Normalized Difference Vegetation Index",
    unit: "",
    min: -0.2,
    max: 0.9,
    colors: [
      "#8c510a",
      "#d8b365",
      "#f6e8c3",
      "#c7eae5",
      "#5ab4ac",
      "#01665e",
    ],
    description:
      "Chỉ số thực vật chuẩn hóa.",
  },

  lst: {
    label: "LST",
    fullName:
      "Land Surface Temperature",
    unit: "°C",
    min: 15,
    max: 45,
    colors: [
      "#313695",
      "#74add1",
      "#ffffbf",
      "#fdae61",
      "#a50026",
    ],
    description:
      "Nhiệt độ bề mặt đất.",
  },

  tvdi: {
    label: "TVDI",
    fullName:
      "Temperature Vegetation Dryness Index",
    unit: "",
    min: 0,
    max: 1,
    colors: [
      "#2166ac",
      "#67a9cf",
      "#d1e5f0",
      "#fddbc7",
      "#ef8a62",
      "#b2182b",
    ],
    description:
      "Chỉ số khô hạn nhiệt độ–thảm thực vật.",
  },
};

export const GEOSERVER_WMS_URL =
  import.meta.env.VITE_GEOSERVER_WMS_URL ||
  "http://localhost:8080/geoserver/workspace_quangtri/wms";

export function getRasterLayer(index, year) {
  const config = INDEX_CONFIG[index];

  if (!config) {
    return null;
  }

  return {
    index,
    year: Number(year),
    label: config.label,
    source: "gee",
    min: config.min,
    max: config.max,
    colors: config.colors,
  };
}

export function getWmsConfig(layerName) {
  if (!layerName) {
    return null;
  }

  return {
    url: GEOSERVER_WMS_URL,
    layers: layerName,
    format: "image/png",
    transparent: true,
    version: "1.1.1",
  };
}