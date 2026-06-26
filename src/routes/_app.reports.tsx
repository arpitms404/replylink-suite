import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

const RANGES = ["Today","Yesterday","This week","Last week","This month","Last month","Last 7 days","Last 30 days","Custom date range"];

function ReportsPage() {
  const [agentRange, setAgentRange] = useState("");
  const [summaryRange, setSummaryRange] = useState("");
  return (
    <div className="h-screen overflow-y-auto p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Generate report</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <Activity className="h-8 w-8 text-emerald-700 mb-3" />
          <h3 className="text-lg font-semibold">Agent activity</h3>
          <p className="text-sm text-gray-500 mb-4">Activity analytics of all agents</p>
          <select value={agentRange} onChange={e => setAgentRange(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm">
            <option value="">Select date range</option>
            {RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="mt-3 h-10 px-4 rounded-md bg-[#0B6E4F] text-white text-sm font-medium">Generate</button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <FileText className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold">Account summary</h3>
          <p className="text-sm text-gray-500 mb-4">Get a summary of all transactions</p>
          <select value={summaryRange} onChange={e => setSummaryRange(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm">
            <option value="">Select date range</option>
            {RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button disabled={!summaryRange} className={`mt-3 h-10 px-4 rounded-md text-sm font-medium ${summaryRange ? "bg-[#0B6E4F] text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>
            Download excel
          </button>
        </div>
      </div>
    </div>
  );
}
