import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo } from "@/lib/permissions";
import { Search, Paperclip, Smile, Send, Clock, AlertTriangle, FileText, MoreVertical, Lock } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/inbox")({ component: InboxPage });

function InboxPage() {
  const { conversations, messages, currentRole } = useAppStore();
  const [activeId, setActiveId] = useState(conversations[0]?.contact_id);
  const canReply = canUserDo(currentRole, "reply_inbox");
  const active = conversations.find(c => c.contact_id === activeId);
  const thread = messages.filter(m => m.contact_id === activeId);

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-[360px] border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-semibold text-ink mb-3">Inbox</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input placeholder="Search conversations..." className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-100 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <button key={c.contact_id} onClick={() => setActiveId(c.contact_id)}
              className={cn("w-full p-3.5 border-b border-border text-left flex gap-3 hover:bg-gray-50", activeId === c.contact_id && "bg-brand-soft/40")}>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-ink text-xs font-semibold flex items-center justify-center">{c.contactName.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                {c.slaBreached && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-warning border-2 border-white" title="SLA breached"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-ink truncate">{c.contactName}</div>
                  <div className="text-[10px] text-gray-400 shrink-0">{formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: false })}</div>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-500 truncate flex-1">{c.lastMessage}</p>
                  {c.unread > 0 && <span className="bg-brand text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{c.unread}</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {!c.assigned_agent_id && <span className="text-[10px] font-medium text-info bg-info/10 px-1.5 rounded">Unassigned</span>}
                  {c.windowStatus === "closed" && <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 rounded">Window closed</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {active ? (
          <>
            <div className="h-16 px-5 border-b border-border bg-card flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-ink text-xs font-semibold flex items-center justify-center">{active.contactName.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
              <div>
                <div className="font-semibold text-sm text-ink">{active.contactName}</div>
                <div className="text-xs text-gray-500">+91 98765 43210 · Mumbai</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {active.windowClosesInMin && <div className="text-xs text-warning bg-warning/10 px-2.5 h-7 rounded-full font-medium inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/>Window closes in {active.windowClosesInMin} min</div>}
                {!active.assigned_agent_id && <button className="text-xs bg-brand text-white px-3 h-7 rounded-md font-semibold">Take</button>}
                <button className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center"><MoreVertical className="w-4 h-4 text-gray-500"/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {thread.length === 0 && <div className="text-center text-sm text-gray-400 py-12">No messages yet</div>}
              {thread.map(m => (
                <div key={m.id} className={cn("flex", m.direction === "outbound" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-md rounded-xl px-3.5 py-2.5 shadow-card",
                    m.direction === "outbound" ? "bg-brand-soft text-ink rounded-br-sm" : "bg-card border border-border rounded-bl-sm")}>
                    <p className="text-sm">{m.body}</p>
                    <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 justify-end">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {m.direction === "outbound" && <span className={m.status === "read" ? "text-info" : "text-gray-400"}>✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
                <div className="text-[10px] font-semibold text-yellow-700 uppercase mb-1">Internal Note</div>
                <p className="text-xs text-gray-700">Customer asked about delivery — follow up tomorrow.</p>
              </div>
            </div>

            <div className="border-t border-border bg-card p-4 shrink-0">
              {!canReply ? (
                <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500"><Lock className="w-4 h-4"/>You have view-only access to conversations.</div>
              ) : active.windowStatus === "closed" ? (
                <div className="bg-warning/5 border border-warning/30 rounded-lg p-3 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0"/>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">This conversation window has closed</div>
                    <div className="text-xs text-gray-500">Send a template message to re-engage this contact.</div>
                  </div>
                  <button className="h-9 px-4 rounded-lg bg-ink text-white text-sm font-semibold inline-flex items-center gap-1.5"><FileText className="w-4 h-4"/>Pick Template</button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <button className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"><Paperclip className="w-4 h-4"/></button>
                  <button className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"><Smile className="w-4 h-4"/></button>
                  <textarea rows={1} placeholder="Type a message..." className="flex-1 min-h-[40px] max-h-32 px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"/>
                  <button className="h-9 w-9 rounded-lg bg-brand text-white flex items-center justify-center"><Send className="w-4 h-4"/></button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
}
