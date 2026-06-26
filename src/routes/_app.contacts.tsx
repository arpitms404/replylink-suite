import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, FileSpreadsheet, Zap, MoreVertical, Download, Settings } from "lucide-react";
import { CONTACTS, BROADCAST_LISTS } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/contacts")({ component: ContactsPage });

function ContactsPage() {
  const lists = useMemo(() => Array.from(new Set(CONTACTS.map(c => c.list))), []);
  const [selected, setSelected] = useState<string>("All");
  const rows = selected === "All" ? CONTACTS : CONTACTS.filter(c => c.list === selected);

  return (
    <div className="flex h-screen">
      <div className="w-[220px] bg-white border-r flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold">Customer segments</h2>
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 border-b">
          <button className="bg-white border border-gray-200 rounded-md p-2 hover:border-emerald-300 flex flex-col items-center gap-1">
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" /><span className="text-[10px]">Excel Import</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-md p-2 hover:border-emerald-300 flex flex-col items-center gap-1">
            <FileSpreadsheet className="h-4 w-4 text-blue-600" /><span className="text-[10px]">Sample File</span>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          <li>
            <button onClick={() => setSelected("All")} className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${selected === "All" ? "bg-emerald-50 text-emerald-800 font-medium" : "hover:bg-gray-50"}`}>
              <Zap className="h-3.5 w-3.5 text-amber-500" /> All customers
            </button>
          </li>
          {lists.map(l => {
            const cnt = BROADCAST_LISTS.find(b => b.name === l)?.count ?? CONTACTS.filter(c => c.list === l).length;
            return (
              <li key={l}>
                <button onClick={() => setSelected(l)} className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${selected === l ? "bg-emerald-50 text-emerald-800 font-medium" : "hover:bg-gray-50"}`}>
                  <span className="truncate">{l}</span><span className="text-xs text-gray-400">{cnt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{selected === "All" ? "All customers" : selected}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{rows.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input placeholder="Search Customers" className="h-8 pl-7 pr-3 rounded-md border border-gray-200 text-sm w-56" />
            </div>
            <button className="h-8 px-3 rounded-md border border-gray-200 text-xs flex items-center gap-1"><Download className="h-3.5 w-3.5" /> Export</button>
            <button className="h-8 px-3 rounded-md border border-gray-200 text-xs flex items-center gap-1"><Settings className="h-3.5 w-3.5" /> View Options</button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-3 py-2 w-8"><input type="checkbox" /></th>
                <th className="px-3 py-2 text-left">Name ↕</th>
                <th className="px-3 py-2 text-left">Phone Number ↕</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2"><input type="checkbox" /></td>
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2 text-gray-600">{c.phone}</td>
                  <td className="px-3 py-2"><MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
