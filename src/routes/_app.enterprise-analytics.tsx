import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/enterprise-analytics")({
  component: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <TrendingUp className="h-10 w-10 text-emerald-700 mx-auto mb-3" />
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Enterprise Analytics — Coming Soon</h2>
        <p className="text-sm text-gray-500 mt-2">Advanced cohort & funnel analytics for enterprise plans.</p>
      </div>
    </div>
  ),
});
