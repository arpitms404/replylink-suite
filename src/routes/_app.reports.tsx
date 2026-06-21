import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { useAppStore } from "@/lib/mock/store";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

function ReportsPage() {
  const { campaigns } = useAppStore();
  const sent = campaigns.reduce((a,c)=>a+c.stats.sent,0);
  const delivered = campaigns.reduce((a,c)=>a+c.stats.delivered,0);
  const read = campaigns.reduce((a,c)=>a+c.stats.read,0);
  const replied = campaigns.reduce((a,c)=>a+c.stats.replied,0);
  const pct = (a:number,b:number)=>b===0?"—":`${((a/b)*100).toFixed(1)}%`;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Cross-campaign performance summary</p>
        </div>
        <div className="flex border border-border rounded-lg overflow-hidden bg-card">
          {["PDF","Excel","CSV"].map((f,i) => (
            <button key={f} className={`h-10 px-4 text-sm font-medium inline-flex items-center gap-1.5 ${i>0?"border-l border-border":""} hover:bg-gray-50`}>
              <Download className="w-3.5 h-3.5"/>{f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Messages" value={sent.toLocaleString()} trend={{ delta: 14.2, positive: true }}/>
        <KpiCard label="Delivery Rate" value={pct(delivered,sent)} trend={{ delta: 1.6, positive: true }}/>
        <KpiCard label="Read Rate" value={pct(read,delivered)} trend={{ delta: 2.9, positive: true }}/>
        <KpiCard label="Reply Rate" value={pct(replied,delivered)} trend={{ delta: 0.4, positive: false }}/>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-card mt-6 p-6">
        <h3 className="text-sm font-semibold text-ink mb-4">Campaign Summary Table</h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-border">
            <tr><th className="text-left font-medium p-2">Campaign</th><th className="text-right font-medium p-2">Sent</th><th className="text-right font-medium p-2">Delivered %</th><th className="text-right font-medium p-2">Read %</th><th className="text-right font-medium p-2">Reply %</th></tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="p-2 font-medium text-ink">{c.name}</td>
                <td className="p-2 text-right tabular-nums">{c.stats.sent.toLocaleString()}</td>
                <td className="p-2 text-right tabular-nums">{pct(c.stats.delivered,c.stats.sent)}</td>
                <td className="p-2 text-right tabular-nums">{pct(c.stats.read,c.stats.delivered)}</td>
                <td className="p-2 text-right tabular-nums">{pct(c.stats.replied,c.stats.delivered)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
