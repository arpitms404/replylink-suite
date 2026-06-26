import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Mail, Radio, Key, MessageSquare, ClipboardList, Clock, Tag, BarChart3, Zap, Pencil, Lock } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

const ITEMS = [
  { icon: User, title: "Your profile", desc: "Edit your personal details" },
  { icon: Bell, title: "Push Notifications", desc: "Configure desktop notifications" },
  { icon: Mail, title: "Email alerts", desc: "Configure email alerts for your organisation" },
  { icon: Radio, title: "Manage channels", desc: "Manage all of your channels and assignees" },
  { icon: Key, title: "Roles", desc: "Edit and create your roles" },
  { icon: MessageSquare, title: "Chat activity logs", desc: "See each bot and user activities in chat window" },
  { icon: ClipboardList, title: "Custom Contact Fields", desc: "Setup custom fields for your customers" },
  { icon: Clock, title: "Pending requests", desc: "Manage your pending requests", locked: true },
  { icon: Tag, title: "Manage tags", desc: "Edit or delete chat tags" },
  { icon: BarChart3, title: "CX Overview", desc: "Manage your CX issues" },
  { icon: Zap, title: "Quick Replies", desc: "Manage your quick replies" },
];

function SettingsPage() {
  const [active, setActive] = useState("Your profile");
  return (
    <div className="flex h-screen">
      <div className="w-[280px] bg-white border-r flex flex-col">
        <div className="p-3 border-b">
          <input placeholder="Search settings..." className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm" />
        </div>
        <ul className="flex-1 overflow-y-auto py-2">
          {ITEMS.map(it => {
            const Icon = it.icon;
            return (
              <li key={it.title}>
                <button onClick={() => setActive(it.title)} className={`w-full text-left px-4 py-2.5 flex items-start gap-3 ${active === it.title ? "bg-emerald-50" : "hover:bg-gray-50"}`}>
                  <Icon className={`h-4 w-4 mt-0.5 ${active === it.title ? "text-emerald-700" : "text-gray-500"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium flex items-center gap-1">{it.title} {it.locked && <Lock className="h-3 w-3 text-gray-400" />}</div>
                    <div className="text-xs text-gray-500 truncate">{it.desc}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{active}</h1>
        {active === "Your profile" ? (
          <div className="bg-white border border-gray-200 rounded-xl divide-y max-w-3xl">
            {[
              { label: "Name", value: "Akshit Giri" },
              { label: "Email", value: "ceo@qualibytes.com" },
              { label: "Phone Number", value: "+918377032324" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between p-4">
                <div>
                  <div className="text-xs text-gray-500">{r.label}</div>
                  <div className="text-sm font-medium mt-0.5">{r.value}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><Pencil className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="text-xs text-gray-500">Primary Channel</div>
                <div className="text-sm font-medium mt-0.5 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#25D366] text-white text-xs flex items-center justify-center">✓</span>
                  Qualibytes IT Academy <span className="text-gray-500 font-normal">+919717995529</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><Pencil className="h-4 w-4" /></button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm max-w-3xl">
            Configuration for "{active}" — settings panel.
          </div>
        )}
      </div>
    </div>
  );
}
