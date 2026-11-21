
import { apiGet } from "./api";

export const SUPPORTED_INDICES = [
  "ndvi",
  "lst",
  "tvdi",
];

function validateIndex(index) {
  const normalized = String(
    index || ""
  ).toLowerCase();

  if (!SUPPORTED_INDICES.includes(normalized)) {
    throw new Error(
      `Chỉ số không hợp lệ: ${index}`
    );
  }

  return normalized;
}

function validateYear(year) {
  const value = Number(year);

  if (
    !Number.isInteger(value) ||
    value < 2013 ||
    value > 2025
  ) {
    throw new Error(
      "Năm phải nằm trong khoảng 2013–2025."
    );
  }

  return value;
}

export async function getBoundary() {
  return apiGet("/api/boundary");
}

export async function getBoundaryStatistics() {
  return apiGet(
    "/api/boundary/statistics"
  );
}

export async function getSatelliteTiles(
  index,
  year
) {
  const selectedIndex = validateIndex(index);
  const params = typeof year === "object" ? year : { year: validateYear(year) };

  return apiGet(
    `/api/${selectedIndex}/tiles`,
    {
      ...params,
    }
  );
}

export async function getSatelliteStatistics(
  index,
  year
) {
  const selectedIndex = validateIndex(index);
  const params = typeof year === "object" ? year : { year: validateYear(year) };

  return apiGet(
    `/api/${selectedIndex}/statistics`,
    {
      ...params,
    }
  );
}

export async function getNdviTiles(year) {
  return getSatelliteTiles("ndvi", year);
}

export async function getLstTiles(year) {
  return getSatelliteTiles("lst", year);
}

export async function getTvdiTiles(year) {
  return getSatelliteTiles("tvdi", year);
}

export async function getNdviStatistics(year) {
  return getSatelliteStatistics("ndvi", year);
}

export async function getLstStatistics(year) {
  return getSatelliteStatistics("lst", year);
}

export async function getTvdiStatistics(year) {
  return getSatelliteStatistics("tvdi", year);
}