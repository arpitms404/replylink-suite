import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { GlobalBanner } from "@/components/layout/GlobalBanner";
import { DemoPanel } from "@/components/layout/DemoPanel";
import { useAuth } from "@/lib/auth";
import { API_CONFIGURED } from "@/lib/api";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { isAuthenticated, loading, apiConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only enforce auth when the API is actually configured.
    // Without VITE_API_URL we run in demo/mock mode and skip the gate.
    if (!API_CONFIGURED) return;
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);

  if (apiConfigured && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>
    );
  }
  if (apiConfigured && !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <GlobalBanner />
        <Header />
        <main className="flex-1 min-w-0"><Outlet /></main>
      </div>
      <DemoPanel />
    </div>
  );
}
