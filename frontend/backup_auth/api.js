
import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Không thể kết nối tới máy chủ.";

    return Promise.reject(
      new Error(message)
    );
  }
);

export async function apiGet(path, params = {}) {
  const response = await api.get(path, {
    params,
  });

  return response.data;
}

export async function checkHealth() {
  return apiGet("/api/health");
}

export async function getApiRoutes() {
  return apiGet("/api/routes");
}

export default api;