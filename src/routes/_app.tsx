import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { GlobalBanner } from "@/components/layout/GlobalBanner";
import { DemoPanel } from "@/components/layout/DemoPanel";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
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
