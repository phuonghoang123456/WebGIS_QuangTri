
import {
  getSatelliteTiles,
  getSatelliteStatistics,
} from "./geeApi";

export async function getDroughtTiles(year) {
  return getSatelliteTiles("tvdi", year);
}

export async function getDroughtStatistics(year) {
  return getSatelliteStatistics("tvdi", year);
}

export function classifyTVDI(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return {
      label: "Chưa có dữ liệu",
      color: "#64748b",
    };
  }

  const tvdi = Number(value);

  if (tvdi < 0 || tvdi > 1) {
    return {
      label: "Giá trị ngoài phạm vi",
      color: "#64748b",
    };
  }

  if (tvdi < 0.2) {
    return {
      label: "Rất ẩm",
      color: "#2166ac",
    };
  }

  if (tvdi < 0.4) {
    return {
      label: "Ẩm",
      color: "#67a9cf",
    };
  }

  if (tvdi < 0.6) {
    return {
      label: "Trung bình",
      color: "#fddbc7",
    };
  }

  if (tvdi < 0.8) {
    return {
      label: "Khô",
      color: "#ef8a62",
    };
  }

  return {
    label: "Rất khô",
    color: "#b2182b",
  };
}