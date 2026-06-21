import { useState } from "react";
import { X, Check, ChevronRight, ChevronLeft, Upload, AlertTriangle, FileSpreadsheet, Database } from "lucide-react";
import { useAppStore } from "@/lib/mock/store";
import { Pill } from "@/components/common/Pill";
import { cn } from "@/lib/utils";

const steps = ["Select Template", "Upload Contacts", "Schedule", "Review & Launch"];

export function CampaignWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { templates, workspace } = useAppStore();
  const [step, setStep] = useState(0);
  const [tplId, setTplId] = useState<string | null>(null);
  const [source, setSource] = useState<"csv" | "excel" | "list">("csv");
  const [uploaded, setUploaded] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [schedule, setSchedule] = useState<"now" | "later">("now");

  if (!open) return null;
  const selectedTpl = templates.find(t => t.id === tplId);
  const blocked = rowCount > workspace.contact_upload_limit;
  const validCount = Math.min(rowCount, workspace.contact_upload_limit) - 245;

  const canNext =
    (step === 0 && tplId) ||
    (step === 1 && uploaded && !blocked) ||
    (step === 2) ||
    (step === 3);

  const reset = () => { setStep(0); setTplId(null); setUploaded(false); setRowCount(0); };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-md w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-ink">Create Campaign</h2>
          <button onClick={() => { onClose(); reset(); }} className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center"><X className="w-4 h-4"/></button>
        </div>

        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={cn("flex items-center gap-2.5", i > step && "opacity-50")}>
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                    i < step ? "bg-brand text-white" : i === step ? "bg-ink text-white" : "bg-gray-100 text-gray-500")}>
                    {i < step ? <Check className="w-3.5 h-3.5"/> : i + 1}
                  </div>
                  <span className={cn("text-sm font-medium", i === step ? "text-ink" : "text-gray-500")}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-3"/>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Pick an approved template. Rejected templates can't be used.</p>
              <div className="grid grid-cols-2 gap-3">
                {templates.map(t => {
                  const disabled = t.approval_status === "rejected";
                  return (
                    <button key={t.id} disabled={disabled} onClick={() => setTplId(t.id)}
                      className={cn("text-left p-4 rounded-xl border-2 transition-all",
                        tplId === t.id ? "border-brand bg-brand-soft" : "border-border hover:border-gray-300",
                        disabled && "opacity-50 cursor-not-allowed")}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-ink text-sm">{t.name}</div>
                        {disabled ? <Pill tone="error">Rejected — cannot use</Pill> : t.approval_status === "approved" ? <Pill tone="success">Approved</Pill> : <Pill tone="warning">Pending</Pill>}
                      </div>
                      <div className="text-xs text-gray-500 capitalize mb-2">{t.category} · {t.language.toUpperCase()}</div>
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">{t.body}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex gap-1.5 mb-4">
                {[{k:"csv",l:"CSV Upload",i:FileSpreadsheet},{k:"excel",l:"Excel Upload",i:FileSpreadsheet},{k:"list",l:"Existing List",i:Database}].map(t => (
                  <button key={t.k} onClick={()=>setSource(t.k as any)}
                    className={cn("h-9 px-4 rounded-lg text-sm font-medium inline-flex items-center gap-2",
                      source===t.k ? "bg-ink text-white" : "bg-gray-100 text-gray-600")}>
                    <t.i className="w-4 h-4"/>{t.l}
                  </button>
                ))}
              </div>

              {!uploaded ? (
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3"/>
                  <p className="text-sm font-medium text-ink mb-1">Drop your file or click to browse</p>
                  <p className="text-xs text-gray-500 mb-4">CSV / XLSX up to 25 MB</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setUploaded(true); setRowCount(5320); }} className="h-9 px-4 rounded-lg bg-ink text-white text-sm font-semibold">Use sample file (5,320 rows)</button>
                    <button onClick={() => { setUploaded(true); setRowCount(50000); }} className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Use oversized file (50,000)</button>
                  </div>
                </div>
              ) : blocked ? (
                <div className="border border-error/30 bg-error/5 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5"/>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-ink">Upload exceeds your plan limit</h4>
                      <p className="text-sm text-gray-600 mt-1">Your Business plan supports up to {workspace.contact_upload_limit.toLocaleString()} contacts per upload. This file has {rowCount.toLocaleString()} rows.</p>
                      <div className="flex gap-2 mt-4">
                        <button className="h-9 px-4 rounded-lg bg-brand text-white text-sm font-semibold">Upgrade to Enterprise</button>
                        <button onClick={() => setRowCount(workspace.contact_upload_limit)} className="text-sm text-info font-medium hover:underline">Upload first {workspace.contact_upload_limit.toLocaleString()} contacts instead</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Validation summary</div>
                  <div className="grid grid-cols-4 gap-3">
                    <SummaryCard label="Will be added" value={validCount} tone="success"/>
                    <SummaryCard label="Skipped (opted-out)" value={180} tone="neutral"/>
                    <SummaryCard label="Skipped (invalid)" value={65} tone="warning"/>
                    <SummaryCard label="Merged duplicates" value={12} tone="info"/>
                  </div>
                  <div className="text-xs text-gray-500">Click any category to view/download that subset.</div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="max-w-md">
              <p className="text-sm text-gray-500 mb-4">When should this campaign be sent?</p>
              <div className="space-y-2">
                <label className={cn("flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer", schedule==="now"?"border-brand bg-brand-soft":"border-border")}>
                  <input type="radio" checked={schedule==="now"} onChange={()=>setSchedule("now")} className="mt-1"/>
                  <div><div className="font-medium text-ink text-sm">Send Now</div><div className="text-xs text-gray-500">Begin sending immediately after launch.</div></div>
                </label>
                <label className={cn("flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer", schedule==="later"?"border-brand bg-brand-soft":"border-border")}>
                  <input type="radio" checked={schedule==="later"} onChange={()=>setSchedule("later")} className="mt-1"/>
                  <div className="flex-1"><div className="font-medium text-ink text-sm">Schedule for Later</div><div className="text-xs text-gray-500 mb-3">Pick a date and time in {workspace.timezone}.</div>
                    {schedule==="later" && <input type="datetime-local" className="w-full h-10 px-3 rounded-lg border border-border text-sm"/>}
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <Row label="Template" value={selectedTpl?.name || "—"}/>
                <Row label="Audience" value={`${validCount.toLocaleString()} deliverable contacts`}/>
                <Row label="Schedule" value={schedule === "now" ? "Send immediately" : "Scheduled"}/>
              </div>
              {validCount <= 0 && <div className="text-sm text-error bg-error/5 border border-error/20 rounded-lg p-3">Audience size is 0 after filtering. Cannot launch.</div>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-5 border-t border-border bg-gray-50 rounded-b-2xl">
          <button onClick={() => step > 0 && setStep(step-1)} disabled={step === 0} className="h-10 px-4 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-40 inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4"/>Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => canNext && setStep(step+1)} disabled={!canNext} className="h-10 px-5 rounded-lg bg-ink text-white text-sm font-semibold inline-flex items-center gap-1 disabled:opacity-40">
              Next<ChevronRight className="w-4 h-4"/>
            </button>
          ) : (
            <button disabled={validCount<=0} onClick={() => { onClose(); reset(); }} className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-40">Launch Campaign</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "success"|"warning"|"info"|"neutral" }) {
  const colors = { success: "text-success bg-success/5 border-success/20", warning: "text-warning bg-warning/5 border-warning/20", info: "text-info bg-info/5 border-info/20", neutral: "text-gray-600 bg-gray-50 border-border" };
  return (
    <button className={cn("p-3 rounded-lg border text-left hover:opacity-90", colors[tone])}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-xl font-bold tabular-nums mt-0.5">{value.toLocaleString()}</div>
    </button>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm"><span className="text-gray-500">{label}</span><span className="font-medium text-ink">{value}</span></div>;
}
