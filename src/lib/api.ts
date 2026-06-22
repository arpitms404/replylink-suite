// Minimal fetch client for the SkillLogic API server (Node/Express).
// Configure with VITE_API_URL in the frontend project's environment.
//
// In development without an API URL, calls throw — the AppStoreProvider
// then falls back to the local mock data so the UI stays usable.

const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
export const API_BASE = RAW_BASE ? RAW_BASE.replace(/\/$/, "") : null;
export const API_CONFIGURED = !!API_BASE;

const TOKEN_KEY = "skilllogic.jwt";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new ApiError("API not configured (set VITE_API_URL)", 0);
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.error || msg; } catch { /* ignore */ }
    if (res.status === 401) setToken(null);
    throw new ApiError(msg, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:  <T,>(p: string) => apiFetch<T>(p),
  post: <T,>(p: string, body?: unknown) => apiFetch<T>(p, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch:<T,>(p: string, body?: unknown) => apiFetch<T>(p, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  del:  <T,>(p: string) => apiFetch<T>(p, { method: "DELETE" }),
};
