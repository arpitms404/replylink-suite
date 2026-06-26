import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, RefreshCw, LayoutGrid, List, Plus, X } from "lucide-react";
import { TEMPLATES, type Template } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/templates")({ component: TemplatesPage });

const CAT_COLORS: Record<string, string> = {
  MARKETING: "bg-amber-100 text-amber-800",
  UTILITY: "bg-blue-100 text-blue-800",
  AUTHENTICATION: "bg-purple-100 text-purple-800",
};

function TemplatesPage() {
  const [hover, setHover] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="h-screen overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Templates</h1>
        <button onClick={() => setShowNew(true)} className="h-9 px-4 rounded-md bg-[#0B6E4F] text-white text-sm font-medium flex items-center gap-1"><Plus className="h-4 w-4" /> New Template</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-3 border-b flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input placeholder="Search template..." className="h-8 pl-7 pr-3 rounded-md border border-gray-200 text-sm w-56" />
          </div>
          {["All Channels", "All status", "All categories", "All agents"].map(p => (
            <button key={p} className="h-8 px-3 rounded-md border border-gray-200 text-xs">{p} ▾</button>
          ))}
          <div className="flex-1" />
          <button className="h-8 w-8 rounded-md border border-gray-200 flex items-center justify-center"><RefreshCw className="h-4 w-4 text-gray-500" /></button>
          <button className="h-8 w-8 rounded-md border border-gray-200 flex items-center justify-center"><LayoutGrid className="h-4 w-4 text-gray-500" /></button>
          <button className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center"><List className="h-4 w-4 text-gray-700" /></button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Template name</th>
              <th className="px-4 py-2 text-left">Preview</th>
              <th className="px-4 py-2 text-left">Created by</th>
              <th className="px-4 py-2 text-left">Created on</th>
              <th className="px-4 py-2 text-left">Last updated</th>
              <th className="px-4 py-2 text-left">Last used on</th>
            </tr>
          </thead>
          <tbody>
            {TEMPLATES.map((t: Template) => (
              <tr key={t.name} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${CAT_COLORS[t.category]}`}>{t.category}</span>
                    <span className="text-xs text-gray-500">{t.lang}</span>
                  </div>
                </td>
                <td className="px-4 py-3 relative max-w-xs" onMouseEnter={() => setHover(t.name)} onMouseLeave={() => setHover(null)}>
                  <span className="text-xs text-gray-600 line-clamp-1">{t.body}</span>
                  {hover === t.name && (
                    <div className="absolute z-20 left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
                      <div className="bg-[#DCF8C6] rounded-lg p-3 text-xs">
                        {t.body}
                        <div className="text-[10px] text-gray-500 text-right mt-1">4:39 pm ✓✓</div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-emerald-700 font-medium">✓ Approved</span>
                        <span className="text-gray-500">1 Number</span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{t.createdBy}</td>
                <td className="px-4 py-3 text-gray-600">{t.createdOn}</td>
                <td className="px-4 py-3 text-gray-600">{t.createdOn}</td>
                <td className="px-4 py-3 text-gray-600">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && <NewTemplateModal onClose={() => setShowNew(false)} />}
    </div>
  );
}

function NewTemplateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("Hi {{1}}, your order {{2}} has shipped.");
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Template</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Template name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium">Category</label>
              <select className="mt-1 w-full h-9 px-3 rounded-md border border-gray-200 text-sm"><option>Marketing</option><option>Utility</option><option>Authentication</option></select>
            </div>
            <div>
              <label className="text-xs font-medium">Language</label>
              <select className="mt-1 w-full h-9 px-3 rounded-md border border-gray-200 text-sm"><option>English</option><option>English (US)</option><option>English (UK)</option><option>Hindi</option></select>
            </div>
            <div>
              <label className="text-xs font-medium">Body</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Preview</label>
            <div className="mt-1 bg-[#ECE5DD] rounded-2xl p-6 h-80 flex items-start">
              <div className="bg-[#DCF8C6] rounded-lg p-3 text-xs max-w-xs shadow-sm">
                {body.split(/(\{\{\d+\}\})/g).map((p, i) => /\{\{\d+\}\}/.test(p) ? <span key={i} className="bg-amber-200 px-0.5 rounded">{p}</span> : <span key={i}>{p}</span>)}
                <div className="text-[10px] text-gray-500 text-right mt-1">12:00 pm ✓✓</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="h-9 px-4 rounded-md border border-gray-200 text-sm">Save as Draft</button>
          <button onClick={onClose} className="h-9 px-4 rounded-md bg-[#0B6E4F] text-white text-sm font-medium">Submit for Approval</button>
        </div>
      </div>
    </div>
  );
}
