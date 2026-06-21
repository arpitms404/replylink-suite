import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo } from "@/lib/permissions";
import { StatusPill } from "@/components/common/Pill";
import { MoreHorizontal, Plus, Search, AlertTriangle, Lock } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CampaignWizard } from "@/components/campaigns/CampaignWizard";

export const Route = createFileRoute("/_app/campaigns")({
  validateSearch: (s: Record<string, unknown>) => ({
    status: (s.status as string) || "all",
    q: (s.q as string) || "",
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const { campaigns, currentRole } = useAppStore();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const canLaunch = canUserDo(currentRole, "launch_campaigns");
  const canDelete = canUserDo(currentRole, "delete_campaign");

  const filtered = campaigns.filter(c =>
    (search.status === "all" || c.status === search.status) &&
    c.name.toLowerCase().includes(search.q.toLowerCase())
  );

  const pct = (a: number, b: number) => b === 0 ? "—" : `${((a/b)*100).toFixed(1)}%`;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your WhatsApp campaigns</p>
        </div>
        {canLaunch ? (
          <button onClick={() => setWizardOpen(true)} className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Create New Campaign</button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 h-10 rounded-lg"><Lock className="w-3.5 h-3.5"/>View-only access</div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input defaultValue={search.q} onChange={e=>navigate({ search: (prev: any) => ({ ...prev, q: e.target.value }) })}
              placeholder="Search campaigns..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"/>
          </div>
          <div className="flex gap-1.5">
            {["all","running","scheduled","paused","completed","failed","draft"].map(s => (
              <button key={s} onClick={()=>navigate({ search: (prev: any) => ({ ...prev, status: s }) })}
                className={`h-8 px-3 rounded-full text-xs font-medium capitalize ${search.status===s?"bg-ink text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-border">
            <tr>
              <th className="text-left font-medium p-3">Campaign</th>
              <th className="text-left font-medium p-3">Status</th>
              <th className="text-left font-medium p-3">Template</th>
              <th className="text-right font-medium p-3">Audience</th>
              <th className="text-right font-medium p-3">Sent</th>
              <th className="text-right font-medium p-3">Delivered</th>
              <th className="text-right font-medium p-3">Read</th>
              <th className="text-right font-medium p-3">Replies</th>
              <th className="text-left font-medium p-3">Created</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const failRate = c.stats.sent > 0 ? c.stats.failed / c.stats.sent : 0;
              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium text-ink flex items-center gap-2">
                      {c.name}
                      {failRate > 0.2 && <span title="High failure rate" className="inline-flex items-center gap-1 text-warning text-[11px] font-semibold bg-warning/10 px-1.5 py-0.5 rounded"><AlertTriangle className="w-3 h-3"/>{Math.round(failRate*100)}% failed</span>}
                    </div>
                    {c.status === "paused" && c.pauseReason === "insufficient_credits" && (
                      <div className="text-[11px] text-warning mt-1 font-medium">⏸ Paused — insufficient credits</div>
                    )}
                    {c.status === "scheduled" && (
                      <div className="text-[11px] text-info mt-1 font-medium">Scheduled for {new Date(c.scheduledAt!).toLocaleString()}</div>
                    )}
                  </td>
                  <td className="p-3"><StatusPill status={c.status}/></td>
                  <td className="p-3 text-gray-600">{c.templateName}</td>
                  <td className="p-3 text-right tabular-nums text-gray-700">{c.audienceSize.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums text-gray-700">{c.stats.sent.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums text-gray-700">{pct(c.stats.delivered, c.stats.sent)}</td>
                  <td className="p-3 text-right tabular-nums text-gray-700">{pct(c.stats.read, c.stats.delivered)}</td>
                  <td className="p-3 text-right tabular-nums text-gray-700">{c.stats.replied.toLocaleString()}</td>
                  <td className="p-3 text-gray-500">{c.created_at}</td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-8 h-8 rounded-md hover:bg-gray-200 flex items-center justify-center"><MoreHorizontal className="w-4 h-4 text-gray-500"/></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        {canLaunch && c.status === "draft" && <DropdownMenuItem>Launch</DropdownMenuItem>}
                        {canLaunch && c.status === "running" && <DropdownMenuItem>Pause</DropdownMenuItem>}
                        {canLaunch && c.status === "paused" && <DropdownMenuItem>Resume</DropdownMenuItem>}
                        {canLaunch && (c.status === "draft" || c.status === "scheduled") && <DropdownMenuItem>Edit</DropdownMenuItem>}
                        {canLaunch && <DropdownMenuItem>Duplicate</DropdownMenuItem>}
                        {canDelete && <><DropdownMenuSeparator/><DropdownMenuItem className="text-error">Delete</DropdownMenuItem></>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CampaignWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
