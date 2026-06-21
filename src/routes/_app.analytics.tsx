import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

const data = Array.from({length:30}).map((_,i) => ({
  day: `Jun ${i+1}`,
  sent: 6000 + Math.round(Math.sin(i/2)*1200) + i*30,
  delivered: 5700 + Math.round(Math.sin(i/2)*1100) + i*28,
}));

function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold text-ink">Analytics</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Deep-dive performance over time</p>
      <div className="bg-card border border-border rounded-xl shadow-card p-6">
        <h3 className="text-sm font-semibold text-ink mb-4">30-Day Volume</h3>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#25D366" stopOpacity={0.3}/><stop offset="100%" stopColor="#25D366" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid stroke="#F3F4F6" vertical={false}/>
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} interval={3}/>
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false}/>
            <Tooltip contentStyle={{ borderRadius:12, border:"1px solid #E5E7EB", fontSize:12 }}/>
            <Area type="monotone" dataKey="sent" stroke="#25D366" fill="url(#ag1)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
