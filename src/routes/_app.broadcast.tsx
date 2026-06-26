import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Check, MoreVertical, ChevronRight, Upload, FileSpreadsheet, Zap, ChevronDown, Plus, HelpCircle, Send } from "lucide-react";
import { BROADCAST_LISTS, CONTACTS, initials, avatarColor } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/broadcast")({ component: BroadcastPage });

function BroadcastPage() {
  const [selected, setSelected] = useState(BROADCAST_LISTS[0].name);
  const list = BROADCAST_LISTS.find(l => l.name === selected)!;
  const members = CONTACTS.filter(c => c.list === selected);

  return (
    <div className="flex h-screen">
      {/* COL 1 */}
      <div className="w-[240px] bg-white border-r flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold">Broadcast lists</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Search className="h-4 w-4" /><Check className="h-4 w-4" /><MoreVertical className="h-4 w-4" />
          </div>
        </div>
        <div className="p-3 border-b">
          <button className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-600 flex items-center justify-between">
            Sort by Date created - new to old <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {BROADCAST_LISTS.map(l => (
            <li key={l.name}>
              <button onClick={() => setSelected(l.name)} className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${selected === l.name ? "bg-emerald-50/60 border-l-2 border-l-[#0B6E4F]" : ""}`}>
                <div className="text-sm font-medium">{l.name}</div>
                <div className="text-xs text-gray-500">{l.count} Members</div>
              </button>
            </li>
          ))}
        </ul>
        <div className="p-3 border-t">
          <button className="w-full h-9 rounded-md bg-[#0B6E4F] text-white text-sm font-medium flex items-center justify-center gap-1"><Plus className="h-4 w-4" /> New List</button>
        </div>
      </div>

      {/* COL 2 */}
      <div className="w-[480px] bg-[#F6F7F9] border-r flex flex-col">
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#0B6E4F] text-white flex items-center justify-center text-xs font-bold">{initials(list.name)}</div>
            <div>
              <div className="text-sm font-semibold">{list.name}</div>
              <div className="text-xs text-gray-500">{list.count} Members</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-md border border-gray-200 text-xs">Manage Access</button>
            <button className="h-8 px-3 rounded-md border border-gray-200 text-xs flex items-center gap-1"><Upload className="h-3.5 w-3.5" /> Import</button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { icon: <FileSpreadsheet className="h-5 w-5 text-emerald-700" />, label: "Excel Import" },
            { icon: <FileSpreadsheet className="h-5 w-5 text-blue-600" />, label: "Sample File" },
            { icon: <Zap className="h-5 w-5 text-amber-500" />, label: "Quick Import" },
          ].map(c => (
            <button key={c.label} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-emerald-300 flex flex-col items-center gap-2">
              {c.icon}<span className="text-xs font-medium">{c.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 max-w-md w-full text-center">
            <FileSpreadsheet className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
            <div className="text-base font-semibold mb-1">Get started</div>
            <p className="text-sm text-gray-600">Drag and drop your contacts file</p>
            <p className="text-xs text-gray-400 mt-1">You can upload: xls, xlsx, csv, .ods</p>
            <button className="mt-4 h-9 px-4 rounded-md bg-[#0B6E4F] text-white text-sm font-medium">Upload from Computer</button>
            <div className="mt-3 text-xs">
              <a className="text-emerald-700 font-medium">⬇ Download sample file</a>
            </div>
            <div className="my-4 text-xs text-gray-400">— or —</div>
            <button className="h-9 px-4 rounded-md border border-gray-300 text-xs flex items-center gap-1 mx-auto"><Zap className="h-3.5 w-3.5 text-amber-500" /> Copy paste contacts for Quick Import</button>
          </div>
        </div>

        <div className="p-3 border-t bg-white text-xs text-gray-500 flex items-center gap-2">
          <HelpCircle className="h-4 w-4" /> Need Help? Learn about broadcasting from ChatPilot Learn Centre
        </div>
      </div>

      {/* COL 3 */}
      <div className="w-[240px] bg-white flex flex-col">
        <div className="p-3 border-b">
          <input placeholder="Search for members" className="w-full h-8 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {members.length === 0 && <li className="p-4 text-xs text-gray-400 text-center">No members yet</li>}
          {members.map(m => (
            <li key={m.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: avatarColor(m.name) }}>{initials(m.name)}</div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{m.name}</div>
                <div className="text-xs text-gray-500">{m.phone}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-3 border-t">
          <button className="w-full h-8 text-sm text-emerald-700 font-medium flex items-center justify-center gap-1"><Plus className="h-3.5 w-3.5" /> Add a member</button>
        </div>
      </div>

      {/* Bottom action - floats over the right portion */}
      <div className="fixed bottom-4 right-6">
        <button className="h-10 px-5 rounded-md bg-[#0B6E4F] text-white text-sm font-medium flex items-center gap-2 shadow-lg"><Send className="h-4 w-4" /> Send WhatsApp Template</button>
      </div>
    </div>
  );
}
