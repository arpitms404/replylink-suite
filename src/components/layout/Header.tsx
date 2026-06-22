import { Search, Bell, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

const roles: Role[] = ["Super Admin", "Admin", "Marketing Manager", "Support Agent"];

export function Header() {
  const { currentRole, setCurrentRole, campaigns } = useAppStore();
  const { user, logout } = useAuth();
  const running = campaigns.filter(c => c.status === "running").length;
  const initials = (user?.full_name || "Priya Mehta").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  const displayName = user?.full_name || "Priya Mehta";

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-30 flex items-center px-6 gap-4">
      <div className="relative w-[320px]">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input placeholder="Search contacts, campaigns, templates..." className="w-full h-9 rounded-full bg-gray-100 border-0 pl-10 pr-16 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40" />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-medium">⌘K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-full bg-brand-soft text-success border border-success/20">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-success pulse-dot"/>
            <span className="relative w-2 h-2 rounded-full bg-success"/>
          </span>
          <span className="text-xs font-semibold tabular-nums">{running} campaigns running</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <Bell className="w-[18px] h-[18px] text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">3</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="text-xs text-gray-400 uppercase">Today</DropdownMenuLabel>
            <DropdownMenuItem className="flex-col items-start gap-1 py-2.5"><div className="text-sm font-medium">Diwali Sale campaign launched</div><div className="text-xs text-gray-500">12 minutes ago</div></DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1 py-2.5"><div className="text-sm font-medium">95 messages failed delivery</div><div className="text-xs text-gray-500">1 hour ago</div></DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuLabel className="text-xs text-gray-400 uppercase">Earlier</DropdownMenuLabel>
            <DropdownMenuItem className="flex-col items-start gap-1 py-2.5"><div className="text-sm font-medium">Template "Flash Promo" was rejected</div><div className="text-xs text-gray-500">2 days ago</div></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-full hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-ink text-white text-xs font-semibold flex items-center justify-center">{initials}</div>
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-ink">{displayName}</div>
              <div className="text-[10px] text-gray-500 font-medium">Viewing as: {currentRole}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="text-xs text-gray-400 uppercase">Switch role (demo)</DropdownMenuLabel>
            {roles.map(r => (
              <DropdownMenuItem key={r} onClick={() => setCurrentRole(r)} className={currentRole === r ? "bg-gray-100 font-medium" : ""}>
                {r}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator/>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Switch Workspace</DropdownMenuItem>
            <DropdownMenuItem className="text-error" onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
