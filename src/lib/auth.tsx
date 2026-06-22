import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, API_CONFIGURED, getToken, setToken } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "admin" | "marketing_manager" | "support_agent";
  workspace_id: string;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  apiConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!API_CONFIGURED || !getToken()) { setLoading(false); return; }
      try {
        const { user } = await api.get<{ user: AuthUser }>("/api/auth/me");
        if (!cancelled) setUser(user);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    boot();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.post<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/login";
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, isAuthenticated: !!user, apiConfigured: API_CONFIGURED, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthProvider missing");
  return v;
}
