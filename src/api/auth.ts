import axios from 'axios'
import apiClient from './client'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface AuthUser {
  id: string
  email: string
  firstname: string
  lastname: string
  role: string
}

interface LoginApiResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: AuthUser
  }
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: AuthUser
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginApiResponse>('/auth/login', { email, password })
  return {
    token: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    user: data.data.user,
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { data } = await axios.post<{ success: boolean; data: { accessToken: string } }>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  )
  return data.data.accessToken
}
