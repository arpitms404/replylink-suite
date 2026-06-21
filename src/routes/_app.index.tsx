import { createFileRoute, Link } from "@tanstack/react-router";
import { KpiCard } from "@/components/common/KpiCard";
import { Pill } from "@/components/common/Pill";
import { useAppStore } from "@/lib/mock/store";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/")({ component: Dashboard });

const trend7 = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  sent: 4800 + i * 320 + (i % 2 ? 600 : 0),
  delivered: 4600 + i * 300,
  read: 3100 + i * 220,
  failed: 60 + (i % 3) * 25,
}));
const readRateData = trend7.map(d => ({ day: d.day, rate: Math.round((d.read / d.delivered) * 100), avg: 72 }));
const campaignBars = [
  { name: "VIP Loyalty Drop", rate: 19 },
  { name: "Cart Recovery", rate: 17 },
  { name: "Diwali Mega", rate: 14 },
  { name: "Welcome Onboarding", rate: 11 },
  { name: "Order Confirmation", rate: 8 },
];
const funnel = [
  { stage: "Sent", v: 12400 },
  { stage: "Delivered", v: 11960 },
  { stage: "Read", v: 8240 },
  { stage: "Replied", v: 2140 },
];

function Dashboard() {
  const { campaigns, contacts, dashboardCardError, scenario } = useAppStore();
  const [goalModal, setGoalModal] = useState(false);

  const sent = campaigns.reduce((a, c) => a + c.stats.sent, 0);
  const delivered = campaigns.reduce((a, c) => a + c.stats.delivered, 0);
  const read = campaigns.reduce((a, c) => a + c.stats.read, 0);
  const replied = campaigns.reduce((a, c) => a + c.stats.replied, 0);
  const failed = campaigns.reduce((a, c) => a + c.stats.failed, 0);
  const running = campaigns.filter(c => c.status === "running").length;
  const hasGoal = campaigns.some(c => c.hasGoal);

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const pct = (num: number, den: number) => den === 0 ? "—" : `${((num / den) * 100).toFixed(1)}%`;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Last 30 days · Asia/Kolkata</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-success pulse-dot"/><span className="relative w-2 h-2 rounded-full bg-success"/></span>
          Live · refreshing every 60s
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Messages Sent Today" value={fmt(8420)} trend={{ delta: 12.4, positive: true }} />
        <KpiCard label="Delivered Rate" value={pct(delivered, sent)} trend={{ delta: 1.8, positive: true }} />
        <KpiCard label="Read Rate" value={pct(read, delivered)} tooltip="Read rate excludes contacts with read receipts disabled."
          trend={{ delta: 3.2, positive: true }} error={dashboardCardError === "Reply Rate" ? undefined : undefined} />
        <KpiCard label="Reply Rate" value={pct(replied, delivered)}
          tooltip="Unique contacts who replied within 48h ÷ unique contacts messaged."
          trend={{ delta: 0.9, positive: false }}
          error={scenario === "dashboard_error" ? "fail" : undefined} />
        <KpiCard label="Failed Messages" value={fmt(failed)} tone="warning" onClick={() => alert("Filter messages by status=failed")} />
        {hasGoal ? (
          <KpiCard label="Conversion Rate" value="4.2%" trend={{ delta: 0.6, positive: true }} />
        ) : (
          <KpiCard label="Conversion Rate" value="—" emptyState={{ text: "Set a conversion goal to track this.", cta: "Configure Goal", onCta: () => setGoalModal(true) }} />
        )}
        <KpiCard label="Active Campaigns" value={String(running)} trend={{ delta: 50, positive: true }} />
        <KpiCard label="Total Contacts" value={fmt(contacts.length * 980)} trend={{ delta: 8.4, positive: true }} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="Messages Sent vs Delivered" right={<RangeTabs />}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend7}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#25D366" stopOpacity={0.3}/><stop offset="100%" stopColor="#25D366" stopOpacity={0}/></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.25}/><stop offset="100%" stopColor="#2563EB" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Area type="monotone" dataKey="sent" stroke="#25D366" fill="url(#g1)" strokeWidth={2}/>
              <Area type="monotone" dataKey="delivered" stroke="#2563EB" fill="url(#g2)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Read Rate Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={readRateData}>
              <CartesianGrid stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Line type="monotone" dataKey="rate" stroke="#25D366" strokeWidth={2.5} dot={{ r: 3 }}/>
              <Line type="monotone" dataKey="avg" stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1.5} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="Top Campaigns by Reply Rate">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={campaignBars} layout="vertical">
              <CartesianGrid stroke="#F3F4F6" horizontal={false}/>
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={140} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Bar dataKey="rate" fill="#25D366" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Daily Messaging Activity">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trend7}>
              <CartesianGrid stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Bar dataKey="delivered" stackId="a" fill="#25D366" radius={[0,0,0,0]}/>
              <Bar dataKey="read" stackId="a" fill="#2563EB"/>
              <Bar dataKey="failed" stackId="a" fill="#DC2626" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card p-6">
        <h3 className="text-sm font-semibold text-ink mb-4">Response Funnel</h3>
        <div className="grid grid-cols-4 gap-3">
          {funnel.map((s, i) => {
            const pctv = (s.v / funnel[0].v) * 100;
            return (
              <div key={s.stage}>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">{s.stage}</div>
                <div className="h-20 rounded-lg flex items-end justify-center text-white font-bold text-lg p-3 tabular-nums"
                  style={{ backgroundColor: ["#25D366","#22B85A","#1E9D4D","#178040"][i] }}>
                  {fmt(s.v)}
                </div>
                <div className="text-[11px] text-gray-500 mt-1.5">{pctv.toFixed(1)}% of sent</div>
              </div>
            );
          })}
        </div>
      </div>

      {goalModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4" onClick={() => setGoalModal(false)}>
          <div className="bg-card rounded-xl shadow-md w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-ink">Configure Conversion Goal</h3>
            <p className="text-sm text-gray-500 mt-1">Track conversions across your campaigns.</p>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-gray-600">Goal type</label>
              <select className="w-full h-10 rounded-lg border border-border px-3 text-sm bg-white">
                <option>Link click in message</option><option>Reply keyword</option><option>CRM tagged conversion</option>
              </select>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setGoalModal(false)} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium">Cancel</button>
              <button onClick={() => setGoalModal(false)} className="flex-1 h-10 rounded-lg bg-brand text-white text-sm font-semibold">Save Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tt = { borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px -2px rgb(17 24 39 / 0.08)", fontSize: 12 } as const;

function ChartCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}
function RangeTabs() {
  const [active, setActive] = useState("7D");
  return (
    <div className="flex bg-gray-100 rounded-md p-0.5">
      {["7D","30D","90D"].map(r => (
        <button key={r} onClick={() => setActive(r)} className={`h-7 px-2.5 text-xs font-medium rounded ${active===r?"bg-white text-ink shadow-sm":"text-gray-500"}`}>{r}</button>
      ))}
    </div>
  );
}
