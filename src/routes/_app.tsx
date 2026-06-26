import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChatPilotSidebar } from "@/components/chatpilot/Sidebar";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#F6F7F9]" style={{ fontFamily: "Inter, sans-serif" }}>
      <ChatPilotSidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
