import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockContacts, mockCampaigns, mockTemplates, mockConversations, mockMessages, mockTeam, type Contact, type Campaign, type Template, type Conversation, type Message, type Role } from "./data";
import { api, API_CONFIGURED } from "@/lib/api";
import { useAuth } from "@/lib/auth";

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
  liveMode: boolean;
};

const Ctx = createContext<AppState | null>(null);

// ---------- API → UI mappers (keep existing component shapes) ----------
type AnyDoc = Record<string, any>;
const id = (d: AnyDoc) => String(d._id ?? d.id);

const mapContact = (d: AnyDoc): Contact => ({
  id: id(d), name: d.name, phone: d.phone, tags: d.tags || [], city: d.city || "",
  opt_in_status: d.opt_in_status || "subscribed",
  last_interaction_at: d.last_interaction_at || new Date().toISOString(),
  contact_lists: d.contact_lists || [],
});
const mapCampaign = (d: AnyDoc): Campaign => ({
  id: id(d), name: d.name, template_id: String(d.template_id || ""),
  templateName: d.templateName || "",
  audienceSize: d.audienceSize || 0, status: d.status || "draft",
  scheduledAt: d.scheduledAt, created_by: String(d.created_by || ""),
  created_at: d.created_at || new Date().toISOString(),
  pauseReason: d.pauseReason, hasGoal: d.hasGoal,
  stats: { sent: d.stats?.sent || 0, delivered: d.stats?.delivered || 0, read: d.stats?.read || 0, replied: d.stats?.replied || 0, failed: d.stats?.failed || 0 },
});
const mapTemplate = (d: AnyDoc): Template => ({
  id: id(d), name: d.name, category: d.category, approval_status: d.approval_status,
  language: d.language || "en", body: d.body, variables: d.variables || [],
  updatedAt: d.updated_at || d.updatedAt || "", rejection_reason: d.rejection_reason,
});
const mapConversation = (d: AnyDoc): Conversation => ({
  contact_id: String(d.contact_id), contactName: d.contactName || "",
  lastMessage: d.lastMessage || "", lastMessageAt: d.lastMessageAt || new Date().toISOString(),
  unread: d.unread || 0, windowStatus: d.windowStatus || "open",
  windowClosesInMin: d.windowClosesInMin, assigned_agent_id: d.assigned_agent_id ? String(d.assigned_agent_id) : null,
  slaBreached: d.slaBreached,
});

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const live = API_CONFIGURED && auth.isAuthenticated;

  const [currentRole, setCurrentRole] = useState<Role>("Super Admin");
  const [credits, setCredits] = useState(48230);
  const [connection, setConnection] = useState<"connected" | "expired" | "disconnected">("connected");
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [scenario, setScenario] = useState<Scenario>(null);
  const [dashboardCardError, setDashboardCardError] = useState<string | null>(null);

  const enabled = live;
  const qContacts = useQuery({ queryKey: ["contacts"], enabled, queryFn: async () => (await api.get<{ items: AnyDoc[] }>("/api/contacts")).items.map(mapContact) });
  const qCampaigns = useQuery({ queryKey: ["campaigns"], enabled, queryFn: async () => (await api.get<{ items: AnyDoc[] }>("/api/campaigns")).items.map(mapCampaign), refetchInterval: 5000 });
  const qTemplates = useQuery({ queryKey: ["templates"], enabled, queryFn: async () => (await api.get<{ items: AnyDoc[] }>("/api/templates")).items.map(mapTemplate) });
  const qConvs = useQuery({ queryKey: ["conversations"], enabled, queryFn: async () => (await api.get<{ items: AnyDoc[] }>("/api/conversations")).items.map(mapConversation) });
  const qTeam = useQuery({ queryKey: ["team"], enabled, queryFn: async () => (await api.get<{ items: AnyDoc[] }>("/api/team")).items.map((d) => ({ id: id(d), name: d.full_name, email: d.email, role: d.role, status: d.status || "active", lastActive: d.invited_at || "" })) });

  const triggerScenario = useCallback((s: Scenario) => {
    setScenario(s);
    if (s === "token_expired") {
      setConnection("expired");
      setLocalCampaigns(prev => prev.map(c => c.status === "running" ? { ...c, status: "failed" as const } : c));
    } else if (s === "credits_out") {
      setCredits(0);
      setLocalCampaigns(prev => prev.map(c => c.status === "running" ? { ...c, status: "paused" as const, pauseReason: "insufficient_credits" } : c));
    } else if (s === "dashboard_error") {
      setDashboardCardError("Reply Rate");
    } else if (s === "high_failure") {
      setLocalCampaigns(prev => prev.map((c, i) => i === 0 ? { ...c, stats: { ...c.stats, failed: Math.floor(c.stats.sent * 0.25) } } : c));
    } else {
      setConnection("connected");
      setCredits(48230);
      setLocalCampaigns(mockCampaigns);
      setDashboardCardError(null);
    }
  }, []);

  const campaigns = live ? (qCampaigns.data || []) : localCampaigns;
  const setCampaigns: AppState["setCampaigns"] = live ? (() => { /* server-driven in live mode */ }) as any : setLocalCampaigns;

  const value: AppState = useMemo(() => ({
    currentRole, setCurrentRole,
    workspace: {
      name: "SkillLogic Marketing", timezone: "Asia/Kolkata",
      credits_remaining: credits, whatsapp_connection_status: connection,
      plan: "business", contact_upload_limit: 25000,
    },
    setCredits, setConnection,
    contacts: live ? (qContacts.data || []) : mockContacts,
    campaigns, setCampaigns,
    templates: live ? (qTemplates.data || []) : mockTemplates,
    conversations: live ? (qConvs.data || []) : mockConversations,
    messages: mockMessages,
    team: live ? ((qTeam.data as any) || mockTeam) : mockTeam,
    scenario, triggerScenario, dashboardCardError,
    liveMode: live,
  }), [currentRole, credits, connection, campaigns, scenario, dashboardCardError, triggerScenario, live, qContacts.data, qTemplates.data, qConvs.data, qTeam.data]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AppStoreProvider missing");
  return v;
}
