
import { apiGet } from "./api";

export async function getClimateMonthly(year) {
  return apiGet("/api/climate/monthly", typeof year === "object" ? year : { year: Number(year) });
}

export async function getClimateSummary(year) {
  return apiGet("/api/climate/summary", typeof year === "object" ? year : { year: Number(year) });
}

export function formatClimateNumber(value, digits = 2) {
  if (value === null || value === undefined) {
    return "Không có dữ liệu";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString("vi-VN", {
        maximumFractionDigits: digits,
      })
    : "Không có dữ liệu";
}

export function summarizeClimate(monthly = []) {
  const temperatures = monthly.filter(item => item.temperature_c != null && Number.isFinite(Number(item.temperature_c)));

  const rainfalls = monthly.map(item => item.rainfall_mm).filter(value => value != null && Number.isFinite(Number(value)));

  return {
    meanTemperature:
      temperatures.length > 0
        ? temperatures.reduce((a, b) => a + Number(b.temperature_c) * (b.days || 1), 0) /
          temperatures.reduce((a,b) => a + (b.days || 1), 0)
        : null,
    totalRainfall:
      rainfalls.length > 0
        ? rainfalls.reduce((a, b) => a + b, 0)
        : null,
    availableMonths: temperatures.length,
  };
}