
import api from "./api";

export async function recordAnalysis(analysisType, details = "") {
  const response = await api.post("/api/usage/events", {
    kind: "analysis",
    analysis_type: analysisType,
    details,
  });
  return response.data;
}

export async function recordCsvExport(analysisType, details = "") {
  const response = await api.post("/api/usage/events", {
    kind: "csv_export",
    analysis_type: analysisType,
    details,
  });
  return response.data;
}