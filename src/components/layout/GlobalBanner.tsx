import { AlertTriangle, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";

export function GlobalBanner() {
  const { workspace, triggerScenario } = useAppStore();
  if (workspace.whatsapp_connection_status === "connected") return null;
  return (
    <div className="bg-error text-white px-6 h-11 flex items-center gap-3 text-sm font-medium">
      <AlertTriangle className="w-4 h-4" />
      <span>WhatsApp connection lost — running campaigns have stopped. Reconnect to resume messaging.</span>
      <Link to="/settings" className="ml-auto bg-white text-error rounded-md px-3 h-7 inline-flex items-center font-semibold hover:bg-white/90">Reconnect Now</Link>
      <button onClick={() => triggerScenario(null)} className="opacity-70 hover:opacity-100" title="Dismiss (demo only)">
        <X className="w-4 h-4"/>
      </button>
    </div>
  );
}
