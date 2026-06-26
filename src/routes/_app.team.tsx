import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MoreVertical, Plus, X, Copy, Pencil, BadgeCheck } from "lucide-react";
import { AGENTS, type Agent, initials, avatarColor } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/team")({ component: TeamPage });

function TeamPage() {
  const [drawer, setDrawer] = useState<Agent | null>(null);
  const [tab, setTab] = useState<"Details" | "Channels assigned">("Details");

  return (
    <div className="flex h-screen">
      <div className="w-[220px] bg-white border-r flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold">Teams</h2>
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <div className="px-3 py-2 text-[10px] uppercase font-semibold text-gray-500">Organisation teams</div>
        <ul className="flex-1">
          <li><button className="w-full px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-800 text-left flex justify-between"><span>All members</span><span>13</span></button></li>
          <li><button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex justify-between"><span>Akshit Giri's team</span><span className="text-xs text-gray-400">12 members</span></button></li>
        </ul>
        <div className="p-3 border-t">
          <button className="w-full h-9 rounded-md bg-[#0B6E4F] text-white text-sm font-medium flex items-center justify-center gap-1"><Plus className="h-4 w-4" /> Invite Members</button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">All members</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{AGENTS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Agents count: 13 of 15</span>
            <button className="h-8 px-3 rounded-md border border-gray-200 text-xs">Sort ▾</button>
            <input placeholder="Search" className="h-8 px-3 rounded-md border border-gray-200 text-sm" />
            <button className="h-8 px-3 rounded-md border border-gray-200 text-xs">Team Settings</button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Number</th>
                <th className="px-4 py-2 text-left">Organisation role</th>
                <th className="px-4 py-2 text-left">Reporting manager</th>
                <th className="px-4 py-2 text-left">Assigned channels</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map(a => (
                <tr key={a.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setDrawer(a)}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: avatarColor(a.name) }}>{initials(a.name)}</div>
                      <span className="font-medium">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{a.phone}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded ${a.role === "Owner" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{a.role}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {a.role === "Owner" ? <span className="text-gray-400 text-xs">N/A</span> : (
                      <select className="h-7 px-2 rounded border border-gray-200 text-xs" onClick={e => e.stopPropagation()} defaultValue="Akshit Giri">
                        <option>Akshit Giri</option><option>Sonali Nayak</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{a.channels}</td>
                  <td className="px-4 py-2.5"><MoreVertical className="h-4 w-4 text-gray-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={() => setDrawer(null)}>
          <div className="bg-white w-[320px] h-full p-5 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Member profile</h3>
              <button onClick={() => setDrawer(null)}><X className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: avatarColor(drawer.name) }}>{initials(drawer.name)}</div>
              <div>
                <div className="flex items-center gap-1.5"><span className="font-semibold">{drawer.name}</span><Pencil className="h-3 w-3 text-gray-400" /><BadgeCheck className="h-4 w-4 text-blue-500" /></div>
                <div className="text-xs text-gray-500">12 members</div>
              </div>
            </div>
            <div className="flex border-b mt-4">
              {(["Details","Channels assigned"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm ${tab === t ? "border-b-2 border-[#0B6E4F] text-[#0B6E4F] font-medium" : "text-gray-500"}`}>{t}</button>
              ))}
            </div>
            {tab === "Details" ? (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="flex items-center justify-between mt-1 border-b pb-2">
                    <span className="text-sm">{drawer.email || "—"}</span>
                    <div className="flex gap-2 text-gray-400"><Copy className="h-3.5 w-3.5 cursor-pointer" /><Pencil className="h-3.5 w-3.5 cursor-pointer" /></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="flex items-center justify-between mt-1 border-b pb-2">
                    <span className="text-sm">{drawer.phone}</span>
                    <div className="flex gap-2 text-gray-400"><Copy className="h-3.5 w-3.5 cursor-pointer" /><Pencil className="h-3.5 w-3.5 cursor-pointer" /></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-600">
                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-[#25D366] text-white text-xs flex items-center justify-center">✓</div>Qualibytes IT Academy</div>
                  <span className="text-xs text-gray-500">{drawer.channels} channels</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
