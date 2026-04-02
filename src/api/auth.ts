import axios from "axios";
import apiClient from "./client";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface AuthUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

interface LoginApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginApiResponse>("/auth/login", {
    email,
    password,
  });
  return {
    token: data.data.accessToken,
    user: data.data.user,
  };
}

const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function refreshAccessToken(): Promise<string> {
  const { data } = await refreshClient.post<{
    success: boolean;
    data: { accessToken: string };
  }>("/auth/refresh", {});
  return data.data.accessToken;
}

export async function logoutApi(): Promise<void> {
  await refreshClient.post("/auth/logout", {});
}
