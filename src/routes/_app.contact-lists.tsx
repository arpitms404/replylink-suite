import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { useState } from "react";

export const Route = createFileRoute("/_app/contact-lists")({ component: ContactListsPage });

const lists = [
  { id: "l1", name: "VIP Customers", count: 1240, updated: "2 days ago" },
  { id: "l2", name: "Cart Abandoners — Last 7d", count: 3820, updated: "5 hours ago" },
  { id: "l3", name: "Newsletter Subscribers", count: 18420, updated: "Yesterday" },
];

function ContactListsPage() {
  const [empty, setEmpty] = useState(false);
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Contact Lists</h1>
          <p className="text-sm text-gray-500 mt-1">Reusable audience segments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setEmpty(e=>!e)} className="h-10 px-3 text-xs text-gray-500 border border-border rounded-lg">Toggle empty (demo)</button>
          <button className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Create List</button>
        </div>
      </div>
      {empty ? (
        <div className="bg-card border border-border rounded-xl shadow-card">
          <EmptyState icon={FolderKanban} title="No contact lists yet" description="Group contacts into reusable audience segments for targeted campaigns." cta="Create your first list"/>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {lists.map(l => (
            <div key={l.id} className="bg-card border border-border rounded-xl shadow-card p-5">
              <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center mb-3"><FolderKanban className="w-5 h-5 text-success"/></div>
              <h3 className="font-semibold text-ink">{l.name}</h3>
              <div className="text-xs text-gray-500 mt-1">{l.count.toLocaleString()} contacts · Updated {l.updated}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
