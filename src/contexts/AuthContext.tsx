import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "../api/auth";
import { refreshAccessToken, logoutApi } from "../api/auth";
import { getAccessToken, setAccessToken } from "../api/tokenMemory";
import { onForceLogout } from "../lib/authEvents";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    const silentRefresh = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const newToken = await refreshAccessToken();
        setToken(newToken);
        setAccessToken(newToken);
      } catch {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();
  }, []);

  function setAuth(newToken: string, newUser: AuthUser) {
    setToken(newToken);
    setAccessToken(newToken);
    setUser(newUser);
  }

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");

    logoutApi().catch(() => {});
  }, []);

  useEffect(() => {
    return onForceLogout(logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        setAuth,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
