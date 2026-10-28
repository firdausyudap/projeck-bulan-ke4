import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/client";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  avatarUrl?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get("/auth/me");
      if (res.data.success && res.data.data?.user) {
        setUser(res.data.data.user);
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success && res.data.data) {
      const { user: u, token } = res.data.data;
      if (token) localStorage.setItem("token", token);
      setUser(u);
    } else {
      throw new Error(res.data.message || "Login failed");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await api.post("/auth/register", { email, password, name });
    if (res.data.success && res.data.data) {
      const { user: u, token } = res.data.data;
      if (token) localStorage.setItem("token", token);
      setUser(u);
    } else {
      throw new Error(res.data.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
