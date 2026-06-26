import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Settings, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/_app/ad-insights")({ component: AdInsightsPage });

function AdInsightsPage() {
  const [tab, setTab] = useState<"ChatPilot Ads" | "Fetched Ads">("ChatPilot Ads");
  return (
    <div className="h-screen overflow-y-auto p-8">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Ad Performance</h1>
      <p className="text-sm text-gray-500 mt-1 mb-5">Monitor and manage your ad campaigns, track conversions and optimise performance metrics</p>

      <div className="flex border-b mb-4">
        {(["ChatPilot Ads","Fetched Ads"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm ${tab === t ? "border-b-2 border-[#0B6E4F] text-[#0B6E4F] font-medium" : "text-gray-500"}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-3 border-b flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input placeholder="Search by ad name" className="h-8 pl-7 pr-3 rounded-md border border-gray-200 text-sm w-64" />
          </div>
          <button className="h-8 px-3 rounded-md border border-gray-200 text-xs flex items-center gap-1">Last 30 Days <ChevronDown className="h-3 w-3" /></button>
          <button className="h-8 w-8 rounded-md border border-gray-200 flex items-center justify-center"><Settings className="h-4 w-4 text-gray-500" /></button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              {["Ad","Status","Impressions","Clicks","Chats","Cost per Chat","Conversion API","Spend","Actions"].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={9} className="text-center py-20 text-gray-400 text-sm">No data found</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
