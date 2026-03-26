import axios from 'axios'
import { refreshAccessToken } from './auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthRoute = original.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (storedRefreshToken) {
        try {
          const newToken = await refreshAccessToken(storedRefreshToken)
          localStorage.setItem('token', newToken)
          original.headers.Authorization = `Bearer ${newToken}`
          return apiClient(original)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
