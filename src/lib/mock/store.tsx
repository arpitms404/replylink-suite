import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { mockContacts, mockCampaigns, mockTemplates, mockConversations, mockMessages, mockTeam, type Contact, type Campaign, type Template, type Conversation, type Message, type Role } from "./data";

export type Scenario = "token_expired" | "credits_out" | "dashboard_error" | "high_failure" | null;

type AppState = {
  currentRole: Role;
  setCurrentRole: (r: Role) => void;
  workspace: {
    name: string;
    timezone: string;
    credits_remaining: number;
    whatsapp_connection_status: "connected" | "expired" | "disconnected";
    plan: "starter" | "business" | "enterprise";
    contact_upload_limit: number;
  };
  setCredits: (n: number) => void;
  setConnection: (s: "connected" | "expired" | "disconnected") => void;
  contacts: Contact[];
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  templates: Template[];
  conversations: Conversation[];
  messages: Message[];
  team: typeof mockTeam;
  scenario: Scenario;
  triggerScenario: (s: Scenario) => void;
  dashboardCardError: string | null;
};

const Ctx = createContext<AppState | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>("Super Admin");
  const [credits, setCredits] = useState(48230);
  const [connection, setConnection] = useState<"connected" | "expired" | "disconnected">("connected");
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [scenario, setScenario] = useState<Scenario>(null);
  const [dashboardCardError, setDashboardCardError] = useState<string | null>(null);

  const triggerScenario = useCallback((s: Scenario) => {
    setScenario(s);
    if (s === "token_expired") {
      setConnection("expired");
      setCampaigns(prev => prev.map(c => c.status === "running" ? { ...c, status: "failed" as const } : c));
    } else if (s === "credits_out") {
      setCredits(0);
      setCampaigns(prev => prev.map(c => c.status === "running" ? { ...c, status: "paused" as const, pauseReason: "insufficient_credits" } : c));
    } else if (s === "dashboard_error") {
      setDashboardCardError("Reply Rate");
    } else if (s === "high_failure") {
      setCampaigns(prev => prev.map((c, i) => i === 0 ? { ...c, stats: { ...c.stats, failed: Math.floor(c.stats.sent * 0.25) } } : c));
    } else {
      setConnection("connected");
      setCredits(48230);
      setCampaigns(mockCampaigns);
      setDashboardCardError(null);
    }
  }, []);

  const value: AppState = useMemo(() => ({
    currentRole, setCurrentRole,
    workspace: {
      name: "Acme Marketing", timezone: "Asia/Kolkata",
      credits_remaining: credits, whatsapp_connection_status: connection,
      plan: "business", contact_upload_limit: 25000,
    },
    setCredits, setConnection,
    contacts: mockContacts, campaigns, setCampaigns,
    templates: mockTemplates, conversations: mockConversations, messages: mockMessages,
    team: mockTeam, scenario, triggerScenario, dashboardCardError,
  }), [currentRole, credits, connection, campaigns, scenario, dashboardCardError, triggerScenario]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AppStoreProvider missing");
  return v;
}
