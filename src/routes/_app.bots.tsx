import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, HelpCircle, Copy, MoreVertical, X, ChevronDown, ZoomIn, ZoomOut, Maximize, Lock, Pencil, ArrowLeft, AlertTriangle } from "lucide-react";
import { BOTS, BOT_LOGS } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/bots")({ component: BotsPage });

const DEFAULT_BOTS = [
  { name: "Welcome bot", status: "Active", runs: 124, date: "1st Jan 2026 09:00 AM", by: "System" },
  { name: "Out-of-office", status: "Inactive", runs: 0, date: "1st Jan 2026 09:00 AM", by: "System" },
  { name: "Quick reply", status: "Active", runs: 56, date: "1st Jan 2026 09:00 AM", by: "System" },
];

const TRIGGER_GROUPS = [
  { label: "MESSAGE & CONVERSATION", items: [
    "💬 Message from CTWA","🔄 On Close Conversation","📅 On First Daily Message","💬 On Message","🔓 On Open Conversation","💬 On no keyword match"
  ]},
  { label: "LEADS & CONTACTS", items: ["🎯 Lead From CTWA","👤 On Agent Assign","📝 On Attribute Changed","➕ On New Lead"] },
  { label: "TEMPLATES", items: ["📄 On Template Delivered"] },
  { label: "SCHEDULING & EVENTS", items: ["⏰ On SLA breached 🔒"] },
];

function BotsPage() {
  const [view, setView] = useState<"list" | "builder" | "logs">("list");
  const [showDefaults, setShowDefaults] = useState(false);

  if (view === "builder") return <BotBuilder onClose={() => setView("list")} />;
  if (view === "logs") return <BotLogs onBack={() => setView("list")} />;

  return (
    <div className="h-screen overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Bot Studio</h1>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-emerald-700">Learn about bots</button>
          <button onClick={() => setView("logs")} className="h-9 px-3 rounded-md border border-gray-200 text-sm">Bot logs</button>
          <button onClick={() => setView("builder")} className="h-9 px-4 rounded-md bg-[#0B6E4F] text-white text-sm font-medium flex items-center gap-1"><Plus className="h-4 w-4" /> Create new bot</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-3 border-b flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input placeholder="Search bot..." className="h-8 pl-7 pr-3 rounded-md border border-gray-200 text-sm w-56" />
          </div>
          {["All Bots", "All Channels", "All Agents", "Newest first"].map(p => (
            <button key={p} className="h-8 px-3 rounded-md border border-gray-200 text-xs flex items-center gap-1">{p} <ChevronDown className="h-3 w-3" /></button>
          ))}
        </div>

        <div className="border-b">
          <button onClick={() => setShowDefaults(v => !v)} className="w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50">
            <ChevronDown className={`h-4 w-4 transition-transform ${showDefaults ? "" : "-rotate-90"}`} />
            Default bots <span className="text-xs text-gray-400">{DEFAULT_BOTS.length}</span>
          </button>
          {showDefaults && DEFAULT_BOTS.map(b => <BotRow key={b.name} bot={b as any} onOpen={() => setView("builder")} />)}
        </div>

        <div>
          <div className="px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2 bg-gray-50">
            <ChevronDown className="h-4 w-4" /> My Bots <span className="text-xs text-gray-400">{BOTS.length}</span>
          </div>
          {BOTS.map(b => <BotRow key={b.name} bot={b} onOpen={() => setView("builder")} />)}
        </div>
      </div>
    </div>
  );
}

function BotRow({ bot, onOpen }: { bot: any; onOpen: () => void }) {
  const isActive = bot.status === "Active";
  return (
    <div onClick={onOpen} className="flex items-center justify-between px-4 py-3 border-t hover:bg-gray-50 cursor-pointer text-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="font-medium">{bot.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>{bot.status}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><div className="h-4 w-4 rounded-full bg-[#25D366]" /> All Channels</span>
        <span>{bot.runs} runs</span>
        <span>{bot.date}</span>
        <span>{bot.by}</span>
        <Copy className="h-3.5 w-3.5 cursor-pointer" /><MoreVertical className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function BotBuilder({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"Triggers" | "Actions">("Triggers");
  const [name, setName] = useState("Untitled Bot");

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      <div className="px-6 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold">Bot Builder</h2>
        <button onClick={onClose}><X className="h-5 w-5" /></button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[260px] border-r flex flex-col">
          <div className="flex border-b">
            {(["Triggers","Actions"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm ${tab === t ? "border-b-2 border-[#0B6E4F] text-[#0B6E4F] font-medium" : "text-gray-500"}`}>{t}</button>
            ))}
          </div>
          <div className="p-3 border-b">
            <input placeholder="Search Action and Triggers" className="w-full h-8 px-3 rounded-md border border-gray-200 text-xs" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 text-xs">
            {TRIGGER_GROUPS.map(g => (
              <div key={g.label} className="mb-3">
                <div className="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase">{g.label}</div>
                {g.items.map(it => (
                  <button key={it} className="w-full text-left px-2 py-2 rounded hover:bg-gray-50">{it}</button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input value={name} onChange={e => setName(e.target.value)} className="text-sm font-medium px-2 py-1 border border-transparent hover:border-gray-200 rounded" />
              <Pencil className="h-3.5 w-3.5 text-gray-400" />
              <label className="flex items-center gap-2 ml-4 text-xs text-gray-500">
                <input type="checkbox" className="rounded" /> Disabled
              </label>
            </div>
            <button className="h-8 px-4 rounded-md bg-[#0B6E4F] text-white text-sm font-medium">Save</button>
          </div>
          <div className="flex-1 relative" style={{ backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            <div className="absolute bottom-4 left-4 flex flex-col gap-1 bg-white border border-gray-200 rounded-md shadow-sm">
              <button className="p-2 hover:bg-gray-50"><ZoomIn className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-50"><ZoomOut className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-50"><Maximize className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-50"><Lock className="h-4 w-4" /></button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Drag triggers and actions here to build your bot</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BotLogs({ onBack }: { onBack: () => void }) {
  const [selectedLog, setSelectedLog] = useState<number | null>(null);
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-white">
        <button onClick={onBack} className="text-sm text-gray-600 flex items-center gap-1 mb-2"><ArrowLeft className="h-4 w-4" /> Bot logs</button>
        <div className="flex items-center gap-2 flex-wrap">
          {["All bots", "All Channels", "All Status"].map(p => (
            <button key={p} className="h-8 px-3 rounded-md border border-gray-200 text-xs flex items-center gap-1">{p} <ChevronDown className="h-3 w-3" /></button>
          ))}
          <input placeholder="Search for number" className="h-8 px-3 rounded-md border border-gray-200 text-sm" />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[360px] bg-white border-r overflow-y-auto">
          {BOT_LOGS.map((l, i) => (
            <button key={i} onClick={() => setSelectedLog(i)} className={`w-full text-left p-3 border-b hover:bg-gray-50 ${selectedLog === i ? "bg-emerald-50/40" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{l.contact}</div>
                <span className="text-[10px] text-gray-400">{l.time}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{l.bot}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{l.status}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#F6F7F9]">
          {selectedLog === null ? (
            <div className="text-center text-gray-500">
              <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <p className="text-sm">No journeys available for selected bot history at the moment</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Journey for {BOT_LOGS[selectedLog].contact} — loaded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
