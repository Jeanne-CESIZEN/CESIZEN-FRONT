import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AuthUser } from '../api/auth'
import { onForceLogout } from '../lib/authEvents'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as AuthUser) : null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  function setAuth(newToken: string, newRefreshToken: string, newUser: AuthUser) {
    setToken(newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
    setUser(newUser)
  }

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }, [])

  useEffect(() => {
    return onForceLogout(logout)
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
