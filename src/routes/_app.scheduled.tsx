import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";

export const Route = createFileRoute("/_app/scheduled")({ component: ScheduledPage });

function ScheduledPage() {
  return (
    <div className="h-screen p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Scheduled Broadcasts</h1>
      <div className="bg-white border border-gray-200 rounded-xl h-[60vh] flex flex-col items-center justify-center">
        <CalendarClock className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-400 text-sm">No scheduled broadcasts</p>
      </div>
    </div>
  );
}
