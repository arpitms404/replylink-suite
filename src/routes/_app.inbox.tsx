import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MoreVertical, Paperclip, Smile, Send, FileText, HelpCircle, LayoutGrid, ChevronDown, Plus } from "lucide-react";
import { CONVERSATIONS, MESSAGES_1, initials, avatarColor } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/inbox")({ component: InboxPage });

const FILTER_GROUPS = [
  { label: "All chats", items: [
    { name: "Open", count: "1K+" }, { name: "Closed", count: "11" },
    { name: "Awaiting reply", count: "1K+" }, { name: "Unread", count: "1K+" }, { name: "All", count: "" },
  ]},
  { label: "My chats", items: [{ name: "Open", count: "23" }, { name: "Closed", count: "5" }] },
  { label: "Unassigned", items: [{ name: "Open", count: "8" }] },
];

function InboxPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [open, setOpen] = useState<Record<string, boolean>>({ "All chats": true, "My chats": false, "Unassigned": false });
  const [activeFilter, setActiveFilter] = useState("Open");
  const [draft, setDraft] = useState("");

  const conv = CONVERSATIONS.find(c => c.id === selectedId) || null;

  return (
    <div className="flex h-screen">
      {/* COL 1 — Filter panel */}
      <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Inbox</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <HelpCircle className="h-4 w-4 cursor-pointer" />
            <LayoutGrid className="h-4 w-4 cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 text-sm">
          {FILTER_GROUPS.map(g => (
            <div key={g.label} className="mb-2">
              <button onClick={() => setOpen(s => ({ ...s, [g.label]: !s[g.label] }))} className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                {g.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${open[g.label] ? "" : "-rotate-90"}`} />
              </button>
              {open[g.label] && (
                <ul className="mt-1">
                  {g.items.map(it => (
                    <li key={it.name}>
                      <button onClick={() => setActiveFilter(it.name)} className={`flex w-full items-center justify-between px-3 py-1.5 rounded-md ${activeFilter === it.name ? "bg-emerald-50 text-emerald-800" : "hover:bg-gray-50"}`}>
                        <span>{it.name}</span>
                        {it.count && <span className="text-xs text-emerald-700 font-medium">{it.count}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-3 border-t pt-3 px-2">
            <div className="flex gap-1 mb-3">
              <button className="flex-1 h-7 rounded-md bg-gray-100 text-xs font-medium">All Chats</button>
              <button className="flex-1 h-7 rounded-md text-xs text-gray-500">Groups</button>
            </div>
            <label className="text-xs text-gray-500">Team member</label>
            <button className="mt-1 w-full h-8 rounded-md border border-gray-200 px-2 text-left text-xs text-gray-500 flex items-center justify-between">Filter by member <ChevronDown className="h-3 w-3" /></button>
            <label className="text-xs text-gray-500 mt-3 block">Tags</label>
            <button className="mt-1 w-full h-8 rounded-md border border-gray-200 px-2 text-left text-xs text-gray-500 flex items-center justify-between">Filter by tags <ChevronDown className="h-3 w-3" /></button>
            <label className="text-xs text-gray-500 mt-3 block">Channels</label>
            <button className="mt-1 w-full h-8 rounded-md border border-gray-200 px-2 text-left text-xs text-gray-500 flex items-center justify-between">Filter by Channels <ChevronDown className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="p-3 border-t">
          <button className="w-full h-9 rounded-md bg-[#0B6E4F] text-white text-sm font-medium flex items-center justify-center gap-1"><Plus className="h-4 w-4" /> New</button>
        </div>
      </div>

      {/* COL 2 — Conversation list */}
      <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">All chats</h3>
          <div className="flex items-center gap-2 text-gray-400">
            <Search className="h-4 w-4 cursor-pointer" />
            <MoreVertical className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
        <div className="px-3 py-2 flex gap-2 border-b">
          <button className="px-3 h-6 rounded-full bg-gray-100 text-xs">All</button>
          <button className="px-3 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs">Yes 2</button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map(c => (
            <li key={c.id}>
              <button onClick={() => setSelectedId(c.id)} className={`w-full flex items-start gap-3 px-3 py-3 border-b border-gray-50 text-left hover:bg-gray-50 ${selectedId === c.id ? "bg-emerald-50/50" : ""}`}>
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: avatarColor(c.contact) }}>
                  {initials(c.contact)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{c.contact}</span>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-500 truncate">{c.lastMsg}</span>
                    {c.unread > 0 && <span className="ml-2 h-4 min-w-4 px-1 rounded-full bg-[#0B6E4F] text-white text-[10px] font-bold flex items-center justify-center">{c.unread}</span>}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* COL 3 — Thread */}
      <div className="flex-1 flex flex-col bg-[#ECE5DD]">
        {conv ? (
          <>
            <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: avatarColor(conv.contact) }}>{initials(conv.contact)}</div>
                <div>
                  <div className="text-sm font-semibold">{conv.contact}</div>
                  <div className="text-xs text-gray-500">{conv.phone}</div>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs">{conv.status}</span>
              </div>
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {MESSAGES_1.map((m, i) => (
                <div key={i} className={`flex ${m.dir === "outbound" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md px-3 py-2 rounded-lg text-sm shadow-sm ${m.dir === "outbound" ? "bg-[#DCF8C6] text-gray-900" : "bg-white text-gray-900"}`}>
                    <div>{m.body}</div>
                    <div className="text-[10px] text-gray-500 text-right mt-1">{m.time} {m.dir === "outbound" && (m.status === "read" ? "✓✓" : "✓")}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-t p-3 flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600"><Paperclip className="h-5 w-5" /></button>
              <button className="text-gray-400 hover:text-gray-600"><Smile className="h-5 w-5" /></button>
              <button className="text-gray-400 hover:text-gray-600" title="Templates"><FileText className="h-5 w-5" /></button>
              <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message…" className="flex-1 h-10 px-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              <button className="h-10 px-4 rounded-full bg-[#0B6E4F] text-white text-sm font-medium flex items-center gap-1"><Send className="h-4 w-4" /> Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Start by clicking any chat in left panel</div>
        )}
      </div>
    </div>
  );
}
