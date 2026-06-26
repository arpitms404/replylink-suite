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

const DEMO_USER_KEY = "skilllogic.demoUser";
const DEMO_EMAIL = "Arpit@skilllogic.in";
const DEMO_PASSWORD = "Arpit@1122";
const DEMO_USER: AuthUser = {
  id: "demo-user",
  email: DEMO_EMAIL,
  full_name: "Arpit Sharma",
  role: "super_admin",
  workspace_id: "demo-workspace",
};

function readDemoUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!API_CONFIGURED) {
        const u = readDemoUser();
        if (!cancelled) { setUser(u); setLoading(false); }
        return;
      }
      if (!getToken()) { setLoading(false); return; }
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
    if (!API_CONFIGURED) {
      // Demo mode — accept seed credentials so the UI is usable without a backend.
      if (email.trim().toLowerCase() !== DEMO_EMAIL.toLowerCase() || password !== DEMO_PASSWORD) {
        throw new Error("Invalid credentials. Use the seed admin account to sign in.");
      }
      window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      return;
    }
    const { token, user } = await api.post<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(DEMO_USER_KEY);
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
