
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        const currentUser =
          response.data.user ?? response.data;

        if (active) setUser(currentUser);
      } catch {
        sessionStorage.removeItem("access_token");
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    const { access_token, user: loggedInUser } =
      response.data;

    if (!access_token || !loggedInUser) {
      throw new Error("Phản hồi đăng nhập không hợp lệ.");
    }

    sessionStorage.setItem("access_token", access_token);
    setUser(loggedInUser);

    return loggedInUser;
  }

  async function logout() {
    try {
      if (sessionStorage.getItem("access_token")) {
        await api.post("/api/auth/logout");
      }
    } catch (error) {
      console.warn("Không thể thu hồi phiên:", error.message);
    } finally {
      sessionStorage.removeItem("access_token");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider chưa được cấu hình.");
  }

  return context;
}