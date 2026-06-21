import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "error" | "info" | "brand";
const tones: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  info: "bg-info/10 text-info",
  brand: "bg-brand-soft text-success",
};

export function Pill({ tone = "neutral", children, dot, className }: { tone?: Tone; children: React.ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium", tones[tone], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current"/>}
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, Tone> = {
    running: "success", scheduled: "info", paused: "warning", completed: "neutral",
    failed: "error", draft: "neutral",
    approved: "success", pending: "warning", rejected: "error",
    subscribed: "success", opted_out: "neutral", unreachable: "warning",
  };
  return <Pill tone={map[status] || "neutral"} dot>{status.replace("_", " ")}</Pill>;
}
