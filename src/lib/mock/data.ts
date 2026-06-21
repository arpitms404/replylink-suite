export type Role = "Super Admin" | "Admin" | "Marketing Manager" | "Support Agent";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  city: string;
  opt_in_status: "subscribed" | "opted_out" | "unreachable";
  last_interaction_at: string;
  contact_lists: string[];
};

export type Campaign = {
  id: string;
  name: string;
  template_id: string;
  templateName: string;
  audienceSize: number;
  status: "draft" | "scheduled" | "running" | "paused" | "completed" | "failed";
  scheduledAt?: string;
  created_by: string;
  created_at: string;
  pauseReason?: "insufficient_credits" | "user";
  hasGoal?: boolean;
  stats: { sent: number; delivered: number; read: number; replied: number; failed: number };
};

export type Template = {
  id: string;
  name: string;
  category: "marketing" | "utility" | "authentication";
  approval_status: "pending" | "approved" | "rejected";
  language: string;
  body: string;
  variables: string[];
  updatedAt: string;
  rejection_reason?: string;
};

export type Conversation = {
  contact_id: string;
  contactName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  windowStatus: "open" | "closed";
  windowClosesInMin?: number;
  assigned_agent_id: string | null;
  slaBreached?: boolean;
};

export type Message = {
  id: string;
  contact_id: string;
  campaign_id?: string;
  direction: "outbound" | "inbound";
  status: "queued" | "sent" | "delivered" | "read" | "failed" | "undelivered";
  body: string;
  timestamp: string;
  failure_reason?: "invalid_number" | "number_not_on_whatsapp" | "blocked_by_user" | "window_expired";
};

const names = ["Aarav Sharma","Priya Patel","Rahul Kumar","Sneha Reddy","Vikram Singh","Anjali Gupta","Karan Mehta","Riya Joshi","Arjun Nair","Diya Iyer","Rohan Desai","Isha Verma","Aditya Rao","Kavya Pillai","Nikhil Bose","Tanvi Shah","Yash Malhotra","Meera Kapoor","Siddharth Jain","Pooja Agarwal","Manish Shetty","Neha Bhatt","Aryan Saxena","Shreya Menon","Dev Choudhary"];
const cities = ["Mumbai","Bangalore","Delhi","Pune","Chennai","Hyderabad","Kolkata","Ahmedabad"];
const tagsPool = ["VIP","Lead","New","Returning","Cart-Abandon","Newsletter","Promo","High-Value"];

export const mockContacts: Contact[] = names.map((n, i) => ({
  id: `c_${i + 1}`,
  name: n,
  phone: `+9198${String(76543210 + i).slice(0, 8)}`,
  tags: [tagsPool[i % tagsPool.length], tagsPool[(i + 3) % tagsPool.length]],
  city: cities[i % cities.length],
  opt_in_status: i % 11 === 0 ? "opted_out" : i % 17 === 0 ? "unreachable" : "subscribed",
  last_interaction_at: new Date(Date.now() - i * 3600_000 * 6).toISOString(),
  contact_lists: i % 3 === 0 ? ["VIP Customers"] : ["General Audience"],
}));

export const mockTemplates: Template[] = [
  { id: "t1", name: "Diwali Sale 2025", category: "marketing", approval_status: "approved", language: "en", body: "Hi {{1}}, our Diwali sale is live! Up to 50% off. Shop: {{2}}", variables: ["name","link"], updatedAt: "2025-06-10" },
  { id: "t2", name: "Order Confirmation", category: "utility", approval_status: "approved", language: "en", body: "Hi {{1}}, your order #{{2}} is confirmed.", variables: ["name","order"], updatedAt: "2025-06-15" },
  { id: "t3", name: "OTP Verification", category: "authentication", approval_status: "approved", language: "en", body: "{{1}} is your verification code.", variables: ["code"], updatedAt: "2025-05-22" },
  { id: "t4", name: "Flash Discount Promo", category: "utility", approval_status: "rejected", language: "en", body: "🔥 50% OFF — TODAY ONLY! Click {{1}}", variables: ["link"], updatedAt: "2025-06-18", rejection_reason: "Promotional content not allowed in Utility category" },
  { id: "t5", name: "Welcome Onboarding", category: "marketing", approval_status: "pending", language: "en", body: "Welcome {{1}}! Let us show you around.", variables: ["name"], updatedAt: "2025-06-19" },
  { id: "t6", name: "Cart Abandonment", category: "marketing", approval_status: "approved", language: "en", body: "Hey {{1}}, you left items in your cart.", variables: ["name"], updatedAt: "2025-06-12" },
];

export const mockCampaigns: Campaign[] = [
  { id: "cmp1", name: "Diwali Mega Sale Blast", template_id: "t1", templateName: "Diwali Sale 2025", audienceSize: 12400, status: "running", created_by: "Priya Mehta", created_at: "2025-06-20", hasGoal: true,
    stats: { sent: 8420, delivered: 8120, read: 6240, replied: 1180, failed: 95 } },
  { id: "cmp2", name: "Cart Recovery — Weekly", template_id: "t6", templateName: "Cart Abandonment", audienceSize: 3200, status: "running", created_by: "Karan Shah", created_at: "2025-06-18", hasGoal: true,
    stats: { sent: 3200, delivered: 3120, read: 2010, replied: 540, failed: 18 } },
  { id: "cmp3", name: "Order Confirmations", template_id: "t2", templateName: "Order Confirmation", audienceSize: 1800, status: "completed", created_by: "Sneha Iyer", created_at: "2025-06-15", hasGoal: false,
    stats: { sent: 1800, delivered: 1790, read: 1620, replied: 240, failed: 4 } },
  { id: "cmp4", name: "Summer Newsletter", template_id: "t1", templateName: "Diwali Sale 2025", audienceSize: 6200, status: "scheduled", scheduledAt: "2025-06-25T10:00:00Z", created_by: "Priya Mehta", created_at: "2025-06-19", hasGoal: false,
    stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 } },
  { id: "cmp5", name: "VIP Loyalty Drop", template_id: "t6", templateName: "Cart Abandonment", audienceSize: 980, status: "paused", created_by: "Karan Shah", created_at: "2025-06-17", hasGoal: true, pauseReason: "user",
    stats: { sent: 540, delivered: 530, read: 410, replied: 88, failed: 6 } },
  { id: "cmp6", name: "Winter Pre-Launch", template_id: "t5", templateName: "Welcome Onboarding", audienceSize: 4500, status: "draft", created_by: "Sneha Iyer", created_at: "2025-06-21", hasGoal: false,
    stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 } },
  { id: "cmp7", name: "Last Quarter Campaign", template_id: "t2", templateName: "Order Confirmation", audienceSize: 2100, status: "failed", created_by: "Priya Mehta", created_at: "2025-06-10", hasGoal: false,
    stats: { sent: 1200, delivered: 1100, read: 720, replied: 96, failed: 80 } },
];

export const mockConversations: Conversation[] = mockContacts.slice(0, 14).map((c, i) => ({
  contact_id: c.id,
  contactName: c.name,
  lastMessage: i % 3 === 0 ? "Thanks! When will my order arrive?" : i % 3 === 1 ? "I'd like to know more about the offer." : "Got it, thanks for letting me know.",
  lastMessageAt: new Date(Date.now() - i * 1200_000).toISOString(),
  unread: i < 4 ? (i + 1) : 0,
  windowStatus: i % 5 === 4 ? "closed" : "open",
  windowClosesInMin: i === 1 ? 47 : undefined,
  assigned_agent_id: i % 4 === 0 ? null : "agent_1",
  slaBreached: i === 2,
}));

export const mockMessages: Message[] = [
  { id: "m1", contact_id: "c_1", direction: "inbound", status: "delivered", body: "Hi! I saw your Diwali offer. Is it still valid?", timestamp: new Date(Date.now() - 3600_000 * 4).toISOString() },
  { id: "m2", contact_id: "c_1", direction: "outbound", status: "read", body: "Hi Aarav! Yes, the Diwali sale runs through this weekend — up to 50% off.", timestamp: new Date(Date.now() - 3600_000 * 3.8).toISOString() },
  { id: "m3", contact_id: "c_1", direction: "inbound", status: "delivered", body: "Great, can you share the categories?", timestamp: new Date(Date.now() - 3600_000 * 2).toISOString() },
  { id: "m4", contact_id: "c_1", direction: "outbound", status: "delivered", body: "Sure — Electronics, Home, and Fashion are all included.", timestamp: new Date(Date.now() - 3600_000 * 1.5).toISOString() },
  { id: "m5", contact_id: "c_1", direction: "inbound", status: "delivered", body: "Thanks! When will my order arrive?", timestamp: new Date(Date.now() - 600_000).toISOString() },
];

export const mockTeam = [
  { id: "u1", name: "Priya Mehta", email: "priya@acme.com", role: "Super Admin" as Role, lastActive: "Just now" },
  { id: "u2", name: "Karan Shah", email: "karan@acme.com", role: "Admin" as Role, lastActive: "12 min ago" },
  { id: "u3", name: "Sneha Iyer", email: "sneha@acme.com", role: "Marketing Manager" as Role, lastActive: "1 hour ago" },
  { id: "u4", name: "Rohit Desai", email: "rohit@acme.com", role: "Support Agent" as Role, lastActive: "3 min ago" },
  { id: "u5", name: "Anita Joshi", email: "anita@acme.com", role: "Support Agent" as Role, lastActive: "Yesterday" },
];
