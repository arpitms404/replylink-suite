import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  House, MessageCircle, Phone, Radio, FileText, CalendarClock, Users,
  BarChart2, TrendingUp, FileBarChart, UsersRound, Bot, Sparkles, Megaphone,
  Settings, ChevronRight, LogOut, User,
} from "lucide-react";
import { TENANT } from "@/lib/chatpilot-data";

const NAV = [
  { to: "/home", icon: House, label: "Home" },
  { to: "/inbox", icon: MessageCircle, label: "Inbox" },
  { to: "/calls", icon: Phone, label: "Calls" },
  { to: "/broadcast", icon: Radio, label: "Broadcast List" },
  { to: "/templates", icon: FileText, label: "Templates" },
  { to: "/scheduled", icon: CalendarClock, label: "Scheduled Broadcasts" },
  { to: "/contacts", icon: Users, label: "Contacts" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/enterprise-analytics", icon: TrendingUp, label: "Enterprise Analytics" },
  { to: "/reports", icon: FileBarChart, label: "Reports" },
  { to: "/team", icon: UsersRound, label: "Team" },
  { to: "/bots", icon: Bot, label: "Bot Studio" },
  { to: "/ai-agent", icon: Sparkles, label: "AI Agent" },
  { to: "/ad-insights", icon: Megaphone, label: "Ad Insights" },
];

function NavItem({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) {
  return (
    <Link to={to} className="group relative flex items-center justify-center">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${active ? "bg-[#0B6E4F] text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}

export function ChatPilotSidebar() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);

  const isActive = (to: string) => pathname === to || (to === "/home" && pathname === "/");

  return (
    <aside className="flex h-screen w-14 flex-col bg-[#15201C] py-3" style={{ position: "sticky", top: 0 }}>
      <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {NAV.map(n => <NavItem key={n.to} {...n} active={isActive(n.to)} />)}
      </div>

      <div className="mt-2 flex flex-col items-center gap-2 border-t border-white/10 pt-3">
        <NavItem to="/settings" icon={Settings} label="Settings" active={isActive("/settings")} />

        {/* Wallet */}
        <div className="group relative flex items-center justify-center">
          <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg text-[10px] font-semibold text-white">
            <span>₹{TENANT.balance.toFixed(0)}</span>
            <button className="mt-0.5 rounded bg-[#0B6E4F] px-1 text-[8px] font-bold text-white">+</button>
          </div>
          <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg group-hover:opacity-100">
            Wallet ₹{TENANT.balance.toFixed(2)} — Recharge
          </span>
        </div>

        {/* User */}
        <div className="relative">
          <button onClick={() => setUserOpen(v => !v)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B6E4F] text-xs font-bold text-white">
            AG
          </button>
          {userOpen && (
            <div className="absolute bottom-0 left-14 z-50 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
              <div className="border-b px-2 py-2">
                <div className="text-sm font-semibold">Akshit Giri</div>
                <div className="text-xs text-gray-500">ceo@qualibytes.com</div>
              </div>
              <button className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-gray-50">
                <User className="h-4 w-4" /> Your profile
              </button>
              <button
                onClick={() => { try { localStorage.clear(); } catch {} navigate({ to: "/login" }); }}
                className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
          <ChevronRight className="absolute -right-1 top-3 h-3 w-3 text-white/40" />
        </div>
      </div>
    </aside>
  );
}
