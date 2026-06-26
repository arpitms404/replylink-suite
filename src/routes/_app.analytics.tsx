import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Move, Maximize, Settings, Trash2 } from "lucide-react";
import { ANALYTICS } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

function Metric({ title, value, unit, period }: { title: string; value: string; unit: string; period: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="flex items-baseline justify-between mt-2">
        <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{value}</div>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>All Agents</span><span>{period}</span>
      </div>
    </div>
  );
}

function Chart({ title, dataKey, period }: { title: string; dataKey: "assigned" | "replied" | "closed"; period: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <button className="h-7 px-2 rounded-md border border-gray-200 text-[10px]">All Agents ▾</button>
            <input type="date" className="h-7 px-2 rounded-md border border-gray-200 text-[10px]" defaultValue="2026-06-26" />
            <span className="text-[10px] text-gray-400">{period}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Move className="h-3.5 w-3.5 cursor-pointer" /><Maximize className="h-3.5 w-3.5 cursor-pointer" />
          <Settings className="h-3.5 w-3.5 cursor-pointer" /><Trash2 className="h-3.5 w-3.5 cursor-pointer" />
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ANALYTICS.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Bar dataKey={dataKey} fill="#0B6E4F" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="h-screen overflow-y-auto p-8">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Response metrics</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">See how your team is responding to your customers</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Metric title="Conversations Open" value={String(ANALYTICS.convOpen)} unit="Count" period="Today" />
        <Metric title="Pending Replies with Window Open" value={String(ANALYTICS.pendingReplies)} unit="Count" period="Last 7 Days" />
        <Metric title="Response Time" value={ANALYTICS.responseTime} unit="Average" period="Today" />
        <Metric title="Response Time" value={ANALYTICS.responseTime} unit="Average" period="Today" />
      </div>

      <h2 className="text-lg font-semibold">Charts</h2>
      <p className="text-sm text-gray-500 mb-4">Graphs showing analytics of all conversations</p>

      <div className="grid grid-cols-2 gap-4">
        <Chart title="Conversations Assigned" dataKey="assigned" period="Today" />
        <Chart title="Conversations Replied" dataKey="replied" period="Today" />
        <Chart title="Conversations Replied" dataKey="replied" period="Yesterday" />
        <Chart title="Conversations Closed" dataKey="closed" period="Today" />
      </div>
    </div>
  );
}
