import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo } from "@/lib/permissions";
import { Wifi, WifiOff, Building2, Webhook, Bell, Shield, Palette, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

const allTabs = [
  { id: "api", label: "WhatsApp API", icon: Wifi, restricted: true },
  { id: "meta", label: "Meta Business", icon: Building2, restricted: true },
  { id: "webhooks", label: "Webhooks", icon: Webhook, restricted: true },
  { id: "notifications", label: "Notifications", icon: Bell, restricted: false },
  { id: "security", label: "Security", icon: Shield, restricted: true },
  { id: "branding", label: "Branding", icon: Palette, restricted: true },
];

function SettingsPage() {
  const { currentRole, workspace, triggerScenario } = useAppStore();
  const canEditApi = canUserDo(currentRole, "edit_api_config");
  const tabs = allTabs.filter(t => !t.restricted || canEditApi);
  const [active, setActive] = useState(tabs[0]?.id || "notifications");
  const t = tabs.find(t => t.id === active)!;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold text-ink mb-6">Settings</h1>
      <div className="flex gap-6">
        <aside className="w-60 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tb => {
              const Icon = tb.icon;
              return (
                <button key={tb.id} onClick={()=>setActive(tb.id)}
                  className={cn("w-full flex items-center gap-2.5 h-10 px-3 rounded-lg text-sm font-medium transition-colors",
                    active === tb.id ? "bg-ink text-white" : "text-gray-600 hover:bg-gray-100")}>
                  <Icon className="w-4 h-4"/>{tb.label}
                </button>
              );
            })}
          </nav>
          {!canEditApi && <p className="mt-4 text-xs text-gray-500 px-3">Some settings are hidden — only Super Admins can access API and infrastructure settings.</p>}
        </aside>

        <div className="flex-1 bg-card border border-border rounded-xl shadow-card p-8 min-w-0">
          {active === "api" && (
            <div>
              <h2 className="text-lg font-semibold text-ink mb-1">WhatsApp API Configuration</h2>
              <p className="text-sm text-gray-500 mb-6">Connection to Meta's WhatsApp Business API</p>
              <div className={cn("rounded-xl border p-5 flex items-center gap-4",
                workspace.whatsapp_connection_status === "connected" ? "bg-success/5 border-success/20" : "bg-error/5 border-error/30")}>
                {workspace.whatsapp_connection_status === "connected" ? <CheckCircle2 className="w-8 h-8 text-success"/> : <WifiOff className="w-8 h-8 text-error"/>}
                <div className="flex-1">
                  <div className="font-semibold text-ink">{workspace.whatsapp_connection_status === "connected" ? "Connected" : "Connection expired"}</div>
                  <div className="text-sm text-gray-500">Phone: +91 80000 12345 · Display name: Acme Marketing</div>
                </div>
                {workspace.whatsapp_connection_status !== "connected" && (
                  <button onClick={()=>triggerScenario(null)} className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold">Reconnect</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Field label="Access token" placeholder="EAA...XYZ"/>
                <Field label="Phone number ID" placeholder="1234567890"/>
                <Field label="Business account ID" placeholder="9876543210"/>
                <Field label="Verify token" placeholder="••••••••"/>
              </div>
            </div>
          )}
          {active === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold text-ink mb-1">Notifications</h2>
              <p className="text-sm text-gray-500 mb-6">Choose what you want to be notified about</p>
              {["Campaign completed","Campaign failed","Daily summary","New inbound message","Template approved/rejected"].map(label => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="text-sm font-medium text-ink">{label}</div>
                  <input type="checkbox" defaultChecked className="w-10 h-6 accent-brand"/>
                </div>
              ))}
            </div>
          )}
          {!["api","notifications"].includes(active) && (
            <div className="text-sm text-gray-500">
              <h2 className="text-lg font-semibold text-ink mb-1">{t.label}</h2>
              <p>Configuration for {t.label.toLowerCase()} goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input placeholder={placeholder} className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm"/>
    </div>
  );
}
