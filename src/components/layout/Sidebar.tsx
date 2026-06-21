import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Users, FolderKanban, Megaphone, FileText, MessagesSquare, Inbox, BarChart3, FileBarChart, UserCog, CreditCard, Settings, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

const groups = [
  { label: "Workspace", items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Audience", items: [
    { to: "/contacts", label: "Contacts", icon: Users },
    { to: "/contact-lists", label: "Contact Lists", icon: FolderKanban },
  ]},
  { label: "Messaging", items: [
    { to: "/campaigns", label: "Campaigns", icon: Megaphone },
    { to: "/templates", label: "Templates", icon: FileText },
    { to: "/conversations", label: "Conversations", icon: MessagesSquare },
    { to: "/inbox", label: "Inbox", icon: Inbox },
  ]},
  { label: "Insights", items: [
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/reports", label: "Reports", icon: FileBarChart },
  ]},
  { label: "Organization", items: [
    { to: "/team", label: "Team Members", icon: UserCog },
    { to: "/billing", label: "Billing", icon: CreditCard },
    { to: "/settings", label: "Settings", icon: Settings },
  ]},
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <aside className={cn("flex flex-col border-r border-border bg-sidebar transition-[width] duration-200 shrink-0 h-screen sticky top-0", collapsed ? "w-[72px]" : "w-[260px]")}>
      <div className="h-16 flex items-center px-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">SL</span>
        </div>
        {!collapsed && (
          <div className="ml-3 leading-tight">
            <div className="font-bold text-[15px] text-ink">SkillLogic</div>
            <div className="text-[11px] text-gray-500 font-medium">WhatsApp CRM</div>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {groups.map(g => (
          <div key={g.label} className="mb-5">
            {!collapsed && <div className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{g.label}</div>}
            <ul className="space-y-0.5">
              {g.items.map(item => {
                const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to} title={collapsed ? item.label : undefined}
                      className={cn("flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors",
                        active ? "bg-ink text-white" : "text-gray-600 hover:bg-gray-100 hover:text-ink")}>
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <button onClick={() => setCollapsed(c => !c)} className="h-12 border-t border-border flex items-center justify-center text-gray-500 hover:bg-gray-50">
        {collapsed ? <ChevronsRight className="w-4 h-4"/> : <ChevronsLeft className="w-4 h-4"/>}
      </button>
    </aside>
  );
}
