import { useState } from "react";
import { Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { useAppStore, type Scenario } from "@/lib/mock/store";
import { cn } from "@/lib/utils";

const scenarios: { id: Scenario; label: string; desc: string }[] = [
  { id: "token_expired", label: "WhatsApp token expired", desc: "Global banner + running campaigns go to failed" },
  { id: "credits_out", label: "Credits run out mid-campaign", desc: "Running campaigns auto-pause" },
  { id: "dashboard_error", label: "Dashboard card fetch fails", desc: "One KPI shows inline error" },
  { id: "high_failure", label: "High failure rate on campaign", desc: "Top campaign jumps to ~25% failure" },
];

export function DemoPanel() {
  const [open, setOpen] = useState(true);
  const { scenario, triggerScenario } = useAppStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] bg-card border border-border rounded-xl shadow-md overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full h-11 px-4 flex items-center gap-2 border-b border-border bg-gray-50">
        <Sparkles className="w-4 h-4 text-brand" />
        <span className="text-sm font-semibold text-ink">Demo: Trigger Scenarios</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400 ml-auto"/> : <ChevronUp className="w-4 h-4 text-gray-400 ml-auto"/>}
      </button>
      {open && (
        <div className="p-3 space-y-2">
          {scenarios.map(s => (
            <button key={s.id} onClick={() => triggerScenario(s.id)}
              className={cn("w-full text-left p-2.5 rounded-lg border transition-colors",
                scenario === s.id ? "border-brand bg-brand-soft" : "border-border hover:bg-gray-50")}>
              <div className="text-sm font-medium text-ink">{s.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
            </button>
          ))}
          <button onClick={() => triggerScenario(null)} className="w-full h-8 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100">
            Reset to default state
          </button>
        </div>
      )}
    </div>
  );
}
