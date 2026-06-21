import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo } from "@/lib/permissions";
import { Pill, StatusPill } from "@/components/common/Pill";
import { Upload, Download, FolderPlus, Search, Plus } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/contacts")({ component: ContactsPage });

function ContactsPage() {
  const { contacts, currentRole } = useAppStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const canDelete = canUserDo(currentRole, "delete_contacts");

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query));
  const toggle = (id: string) => { const n = new Set(selected); n.has(id)?n.delete(id):n.add(id); setSelected(n); };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">{contacts.length.toLocaleString()} contacts in this workspace</p>
        </div>
        <button className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Add Contact</button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name or phone..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"/>
          </div>
          <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm"><option>All tags</option></select>
          <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm"><option>All cities</option></select>
          <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm"><option>All statuses</option></select>
        </div>

        {selected.size > 0 && (
          <div className="px-4 h-12 border-b border-border bg-brand-soft/50 flex items-center gap-2 text-sm">
            <span className="font-medium text-ink">{selected.size} selected</span>
            <div className="ml-auto flex gap-2">
              <button className="h-8 px-3 rounded-md bg-white border border-border text-xs font-medium inline-flex items-center gap-1.5"><Upload className="w-3.5 h-3.5"/>Import</button>
              <button className="h-8 px-3 rounded-md bg-white border border-border text-xs font-medium inline-flex items-center gap-1.5"><Download className="w-3.5 h-3.5"/>Export</button>
              <button className="h-8 px-3 rounded-md bg-white border border-border text-xs font-medium inline-flex items-center gap-1.5"><FolderPlus className="w-3.5 h-3.5"/>Create List</button>
              <button disabled={!canDelete} title={canDelete?"":"You don't have permission to do this. Contact your Admin."}
                className="h-8 px-3 rounded-md text-xs font-medium text-error disabled:opacity-40 disabled:cursor-not-allowed">Delete</button>
            </div>
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-border">
            <tr>
              <th className="w-10 p-3"><input type="checkbox" onChange={e=>setSelected(e.target.checked?new Set(filtered.map(c=>c.id)):new Set())}/></th>
              <th className="text-left font-medium p-3">Name</th>
              <th className="text-left font-medium p-3">Mobile Number</th>
              <th className="text-left font-medium p-3">Tags</th>
              <th className="text-left font-medium p-3">City</th>
              <th className="text-left font-medium p-3">Last Interaction</th>
              <th className="text-left font-medium p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" checked={selected.has(c.id)} onChange={()=>toggle(c.id)}/></td>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-ink text-xs font-semibold flex items-center justify-center">{c.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                    <span className="font-medium text-ink">{c.name}</span>
                  </div>
                </td>
                <td className="p-3 tabular-nums text-gray-700">{c.phone}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {c.tags.slice(0,2).map(t=><Pill key={t} tone="brand">{t}</Pill>)}
                  </div>
                </td>
                <td className="p-3 text-gray-600">{c.city}</td>
                <td className="p-3 text-gray-500">{formatDistanceToNow(new Date(c.last_interaction_at), { addSuffix: true })}</td>
                <td className="p-3"><StatusPill status={c.opt_in_status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
