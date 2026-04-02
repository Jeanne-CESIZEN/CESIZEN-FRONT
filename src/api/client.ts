import axios from "axios";
import { emitForceLogout } from "../lib/authEvents";
import { refreshAccessToken } from "./auth";
import { getAccessToken, setAccessToken } from "./tokenMemory";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRoute = original.url?.startsWith("/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;

      try {
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        setAccessToken(null);
        emitForceLogout();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
