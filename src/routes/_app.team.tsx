import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo, permissionMatrix, type Action } from "@/lib/permissions";
import type { Role } from "@/lib/mock/data";
import { Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/team")({ component: TeamPage });

const actionLabels: Record<Action, string> = {
  launch_campaigns: "Launch campaigns", delete_contacts: "Delete contacts",
  reply_inbox: "Reply in Inbox", manage_billing: "Manage billing",
  invite_team: "Invite/remove team members", edit_api_config: "Edit WhatsApp API config",
  view_inbox: "View Inbox", create_template: "Create template",
  edit_permissions: "Edit permissions", delete_campaign: "Delete campaign",
};
const roles: Role[] = ["Super Admin", "Admin", "Marketing Manager", "Support Agent"];

function TeamPage() {
  const { team, currentRole } = useAppStore();
  const [tab, setTab] = useState<"members"|"permissions">("members");
  const [invite, setInvite] = useState(false);
  const canInvite = canUserDo(currentRole, "invite_team");

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage members and role permissions</p>
        </div>
        {canInvite && tab === "members" && (
          <button onClick={()=>setInvite(true)} className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Invite Member</button>
        )}
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={()=>setTab("members")} className={cn("h-8 px-4 rounded-md text-sm font-medium", tab==="members"?"bg-white text-ink shadow-sm":"text-gray-500")}>Members ({team.length})</button>
        <button onClick={()=>setTab("permissions")} className={cn("h-8 px-4 rounded-md text-sm font-medium", tab==="permissions"?"bg-white text-ink shadow-sm":"text-gray-500")}>Permissions Matrix</button>
      </div>

      {tab === "members" ? (
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-b border-border">
              <tr><th className="text-left font-medium p-3">Member</th><th className="text-left font-medium p-3">Role</th><th className="text-left font-medium p-3">Last Active</th><th></th></tr>
            </thead>
            <tbody>
              {team.map(m => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-ink text-xs font-semibold flex items-center justify-center">{m.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                      <div>
                        <div className="font-medium text-ink">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className="text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-full">{m.role}</span></td>
                  <td className="p-3 text-gray-500">{m.lastActive}</td>
                  <td className="p-3 text-right">
                    <button disabled={!canInvite} title={canInvite?"":"You don't have permission to do this. Contact your Admin."}
                      className="text-xs font-medium text-error h-7 px-2 rounded hover:bg-error/5 disabled:opacity-30 disabled:cursor-not-allowed">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-border bg-gray-50">
            <div className="text-sm text-gray-600">
              {canUserDo(currentRole, "edit_permissions") ? "You can edit role permissions." : "View-only — only Super Admins can edit permissions."}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-b border-border">
              <tr>
                <th className="text-left font-medium p-3">Action</th>
                {roles.map(r => <th key={r} className="text-center font-medium p-3">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(actionLabels) as Action[]).map(a => (
                <tr key={a} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-ink">{actionLabels[a]}</td>
                  {roles.map(r => {
                    const allowed = permissionMatrix[a].includes(r);
                    return (
                      <td key={r} className="p-3 text-center">
                        <div className={cn("inline-flex w-7 h-7 rounded-full items-center justify-center",
                          allowed ? "bg-success/15 text-success" : "bg-gray-100 text-gray-400")}>
                          {allowed ? <Check className="w-4 h-4"/> : <X className="w-4 h-4"/>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invite && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4" onClick={()=>setInvite(false)}>
          <div onClick={e=>e.stopPropagation()} className="bg-card rounded-xl shadow-md w-full max-w-md p-6">
            <h3 className="text-base font-bold text-ink">Invite Team Member</h3>
            <div className="space-y-3 mt-4">
              <div><label className="text-xs font-medium text-gray-600">Full name</label><input className="mt-1 w-full h-10 rounded-lg border border-border px-3 text-sm"/></div>
              <div><label className="text-xs font-medium text-gray-600">Email</label><input type="email" className="mt-1 w-full h-10 rounded-lg border border-border px-3 text-sm"/></div>
              <div><label className="text-xs font-medium text-gray-600">Role</label>
                <select className="mt-1 w-full h-10 rounded-lg border border-border px-3 text-sm bg-white">
                  {roles.filter(r => r !== "Super Admin").map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={()=>setInvite(false)} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium">Cancel</button>
              <button onClick={()=>setInvite(false)} className="flex-1 h-10 rounded-lg bg-brand text-white text-sm font-semibold">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
