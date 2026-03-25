import apiClient from './client'

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
  user: AuthUser
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginApiResponse>('/auth/login', { email, password })
  return {
    token: data.data.accessToken,
    user: data.data.user,
  }
}
