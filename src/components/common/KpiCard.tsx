import { ArrowDown, ArrowUp, AlertCircle, RefreshCw, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type KpiProps = {
  label: string;
  value: string;
  trend?: { delta: number; positive?: boolean };
  tooltip?: string;
  onClick?: () => void;
  emptyState?: { text: string; cta: string; onCta?: () => void };
  error?: string;
  tone?: "default" | "warning";
};

export function KpiCard(p: KpiProps) {
  const [retried, setRetried] = useState(false);
  if (p.error && !retried) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 shadow-card flex flex-col">
        <div className="text-sm font-medium text-gray-500">{p.label}</div>
        <div className="flex-1 flex flex-col items-start justify-center gap-2 mt-3">
          <div className="flex items-center gap-2 text-error text-sm font-medium"><AlertCircle className="w-4 h-4"/> Couldn't load this data</div>
          <button onClick={() => setRetried(true)} className="text-xs font-semibold text-info hover:underline inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3"/> Retry
          </button>
        </div>
      </div>
    );
  }
  if (p.emptyState) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 shadow-card flex flex-col">
        <div className="text-sm font-medium text-gray-500">{p.label}</div>
        <div className="flex-1 flex flex-col items-start justify-center gap-2 mt-3">
          <div className="text-xs text-gray-500">{p.emptyState.text}</div>
          <button onClick={p.emptyState.onCta} className="text-xs font-semibold text-ink bg-gray-100 hover:bg-gray-200 h-7 px-2.5 rounded-md">{p.emptyState.cta}</button>
        </div>
      </div>
    );
  }
  return (
    <button onClick={p.onClick} disabled={!p.onClick} className={cn("bg-card border border-border rounded-xl p-5 shadow-card text-left transition-shadow w-full", p.onClick && "hover:shadow-card-hover cursor-pointer")}>
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
        {p.label}
        {p.tooltip && <span title={p.tooltip}><Info className="w-3.5 h-3.5 text-gray-400"/></span>}
      </div>
      <div className={cn("mt-2 text-[32px] leading-none font-bold tabular-nums", p.tone === "warning" ? "text-error" : "text-ink")}>{p.value}</div>
      {p.trend && (
        <div className={cn("mt-3 inline-flex items-center gap-1 h-6 px-2 rounded-md text-xs font-semibold",
          p.trend.positive ? "bg-success/10 text-success" : "bg-error/10 text-error")}>
          {p.trend.positive ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
          <span className="tabular-nums">{Math.abs(p.trend.delta)}%</span>
          <span className="text-gray-500 font-normal ml-0.5">vs. prev 30d</span>
        </div>
      )}
    </button>
  );
}
