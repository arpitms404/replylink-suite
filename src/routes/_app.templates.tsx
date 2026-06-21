import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo } from "@/lib/permissions";
import { Pill, StatusPill } from "@/components/common/Pill";
import { Plus, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/templates")({ component: TemplatesPage });

function TemplatesPage() {
  const { templates, currentRole } = useAppStore();
  const canCreate = canUserDo(currentRole, "create_template");

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Pre-approved message templates by Meta</p>
        </div>
        {canCreate && <button className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Create Template</button>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl shadow-card p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <Pill tone="neutral" className="capitalize">{t.category}</Pill>
              <StatusPill status={t.approval_status}/>
            </div>
            <h3 className="font-semibold text-ink mb-1">{t.name}</h3>
            <div className="text-xs text-gray-500 mb-3">{t.language.toUpperCase()} · Updated {t.updatedAt}</div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg flex-1 mb-3">{t.body}</div>
            {t.rejection_reason && (
              <div className="text-xs text-error bg-error/5 border border-error/20 rounded-lg p-2.5 mb-3 flex gap-2 items-start">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5"/><span>Rejected: {t.rejection_reason}</span>
              </div>
            )}
            <div className="flex gap-2">
              {t.approval_status === "rejected" ? (
                <button className="flex-1 h-9 rounded-lg bg-ink text-white text-sm font-semibold">Edit & Resubmit</button>
              ) : t.approval_status === "pending" ? (
                <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium">View Status</button>
              ) : (
                <>
                  <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium">Edit</button>
                  <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium">Duplicate</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
