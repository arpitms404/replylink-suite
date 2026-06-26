// Centralized hardcoded mock data for the ChatPilot UI rebuild.

export const TENANT = {
  name: "Qualibytes IT Academy",
  phone: "+919717995529",
  status: "Active",
  quality: "High",
  tier: "1k/24hrs",
  balance: 282.21,
};

export type Agent = {
  id: number; name: string; email?: string; phone: string;
  role: string; team?: string; manager: string; channels: number;
};

export const AGENTS: Agent[] = [
  { id:1, name:"Akshit Giri", email:"ceo@qualibytes.com", phone:"+918377032324", role:"Owner", team:"Default", manager:"N/A", channels:11 },
  { id:2, name:"Admin LSQ", phone:"+919717995529", role:"MY_TEAM", manager:"Akshit Giri", channels:1 },
  { id:3, name:"Yash Sinha", phone:"+917678254129", role:"MY_TEAM", manager:"Akshit Giri", channels:1 },
  { id:4, name:"Kiran", phone:"+917303523538", role:"MY_TEAM", manager:"Akshit Giri", channels:2 },
  { id:5, name:"Uzma", phone:"+919310916890", role:"MY_TEAM", manager:"Akshit Giri", channels:1 },
  { id:6, name:"Shivangi", phone:"+918595424276", role:"MY_TEAM", manager:"Akshit Giri", channels:1 },
  { id:7, name:"Sonali Nayak", phone:"+917977749742", role:"Owner", manager:"Akshit Giri", channels:9 },
  { id:8, name:"Tanya", phone:"+919211822374", role:"MY_TEAM", manager:"Akshit Giri", channels:2 },
  { id:9, name:"Tejaswini", phone:"+919156087161", role:"MY_TEAM", manager:"Akshit Giri", channels:2 },
  { id:10, name:"Komal", phone:"+917042641810", role:"MY_TEAM", manager:"Akshit Giri", channels:2 },
];

export type Contact = { id:number; name:string; phone:string; tags:string[]; list:string };
export const CONTACTS: Contact[] = [
  { id:1, name:"Rahul Sharma", phone:"+919822346647", tags:["Lead"], list:"Yash DA Leads" },
  { id:2, name:"Priya Singh", phone:"+919990549393", tags:["Customer"], list:"Online Degree" },
  { id:3, name:"Aashish KV", phone:"+916483634268", tags:["Lead","DevOps"], list:"DevOps Leads" },
  { id:4, name:"Anjali Tripathi", phone:"+917898360687", tags:["QA"], list:"Uzma QA Leads" },
  { id:5, name:"Ashik Sameer", phone:"+919559107402", tags:["Lead"], list:"Yash DA Leads" },
  { id:6, name:"Pankaj Singh", phone:"+919262840451", tags:["DevOps"], list:"DevOps Leads" },
  { id:7, name:"Suchismita IT", phone:"+919051054312", tags:["Software"], list:"Software Testing" },
  { id:8, name:"Neha Garg", phone:"+919389660501", tags:["QA"], list:"Uzma QA Leads" },
];

export const BROADCAST_LISTS = [
  { name:"Yash DA Leads", count:55 },
  { name:"Online Degree", count:42 },
  { name:"Software Testing", count:190 },
  { name:"DevOps Leads", count:52 },
  { name:"Uzma DA Leads", count:42 },
  { name:"Shubhangi DevOps Leads", count:10 },
  { name:"Aditi DA Leads", count:57 },
  { name:"Kiran DA Leads", count:153 },
  { name:"Uzma QA Leads", count:52 },
  { name:"Shivangi QA Leads", count:66 },
];

export type Template = {
  name:string; category:"MARKETING"|"UTILITY"|"AUTHENTICATION"; lang:string;
  body:string; status:string; createdBy:string; createdOn:string;
};
export const TEMPLATES: Template[] = [
  { name:"enrollment_confirmation", category:"MARKETING", lang:"English", body:"Hi {{1}}, you are now enrolled in {{2}}! Welcome to Qualibytes.", status:"Approved", createdBy:"Akshit Giri", createdOn:"28/05/2026" },
  { name:"live_session_start", category:"UTILITY", lang:"English", body:"Hi {{1}}, your live session {{2}} with trainer {{3}} is starting now.", status:"Approved", createdBy:"Akshit Giri", createdOn:"28/05/2026" },
  { name:"billing_payment_reminder", category:"UTILITY", lang:"English", body:"Hi {{1}}, your installment {{3}} for {{2}} is due.", status:"Approved", createdBy:"Akshit Giri", createdOn:"28/05/2026" },
  { name:"otp_verification", category:"AUTHENTICATION", lang:"English", body:"{{1}} is your verification code.", status:"Approved", createdBy:"Akshit Giri", createdOn:"28/05/2026" },
  { name:"broadcast_3_qa_v4", category:"MARKETING", lang:"English (US)", body:"Our Software Testing Course is a 3-month practical program...", status:"Approved", createdBy:"Akshit Giri", createdOn:"24/10/2025" },
  { name:"broadcast_3_da_yash_v4", category:"MARKETING", lang:"English (UK)", body:"Our Data Analytics Course is a 5-month practical program...", status:"Approved", createdBy:"Akshit Giri", createdOn:"24/10/2025" },
];

export type Conversation = {
  id:number; contact:string; phone:string; lastMsg:string; time:string;
  unread:number; status:string; agent:string|null; tag:string;
};
export const CONVERSATIONS: Conversation[] = [
  { id:1, contact:"Rahul Sharma", phone:"+919822346647", lastMsg:"Thanks for the info!", time:"2m ago", unread:2, status:"Open", agent:"Kiran", tag:"Lead" },
  { id:2, contact:"Priya Singh", phone:"+919990549393", lastMsg:"When does batch start?", time:"15m ago", unread:0, status:"Open", agent:null, tag:"Customer" },
  { id:3, contact:"Anjali Tripathi", phone:"+917898360687", lastMsg:"Please send the schedule", time:"1h ago", unread:1, status:"Awaiting reply", agent:"Tanya", tag:"Lead" },
  { id:4, contact:"Pankaj Singh", phone:"+919262840451", lastMsg:"I want to enroll", time:"2h ago", unread:0, status:"Open", agent:"Komal", tag:"DevOps" },
  { id:5, contact:"Ashik Sameer", phone:"+919559107402", lastMsg:"Received, thank you", time:"3h ago", unread:0, status:"Closed", agent:"Shivangi", tag:"Lead" },
];

export const MESSAGES_1 = [
  { dir:"inbound" as const, body:"Hi, I'm interested in the Data Analytics course", time:"10:20 AM", status:"read" },
  { dir:"outbound" as const, body:"Hello Rahul! Great to hear from you. Our DA course is 5 months practical program with live sessions.", time:"10:22 AM", status:"read" },
  { dir:"inbound" as const, body:"What is the fee structure?", time:"10:25 AM", status:"read" },
  { dir:"outbound" as const, body:"The course fee is ₹35,000. We also have EMI options available in 3 or 6 installments.", time:"10:26 AM", status:"delivered" },
  { dir:"inbound" as const, body:"Thanks for the info!", time:"10:28 AM", status:"read" },
];

export const BOTS = [
  { name:"CTWA Ads GS", status:"Inactive", channel:"WhatsApp", runs:0, date:"10th Apr 2026 11:31 PM", by:"Akshit Giri" },
  { name:"LSQ X DT AdSet", status:"Active", channel:"WhatsApp", runs:6091, date:"7th Apr 2026 11:47 AM", by:"Sonali Nayak" },
  { name:"Agent CallAPI", status:"Inactive", channel:"WhatsApp", runs:0, date:"20th Mar 2026 2:05 PM", by:"Akshit Giri" },
  { name:"QA_Tanya 10th Dec", status:"Active", channel:"WhatsApp", runs:35, date:"11th Dec 2025 12:35 PM", by:"Akshit Giri" },
  { name:"QA_Komal 10th Dec", status:"Active", channel:"WhatsApp", runs:1000, date:"11th Dec 2025 12:35 PM", by:"Akshit Giri" },
];

export const BOT_LOGS = [
  { contact:"Tez....!", time:"21 minutes ago", bot:"LSQ X DT AdSet", status:"Done" },
  { contact:"Tez....!", time:"22 minutes ago", bot:"LSQ X DT AdSet", status:"Done" },
  { contact:"Devanshi Sharma", time:"44 minutes ago", bot:"LSQ X DT AdSet", status:"Done" },
  { contact:"rishikaguptarj", time:"48 minutes ago", bot:"LSQ X DT AdSet", status:"Done" },
  { contact:"Tanmay Sankuratri", time:"58 minutes ago", bot:"LSQ X DT AdSet", status:"Done" },
  { contact:"Arshad", time:"1 hour ago", bot:"LSQ X DT AdSet", status:"Done" },
];

export const ANALYTICS = {
  convOpen: 51, pendingReplies: 533, responseTime: "17h : 27m",
  hourlyData: [
    {hour:"00:00",assigned:1,replied:0,closed:0}, {hour:"01:00",assigned:1,replied:2,closed:0},
    {hour:"02:00",assigned:0,replied:0,closed:0}, {hour:"03:00",assigned:0,replied:0,closed:0},
    {hour:"04:00",assigned:0,replied:0,closed:0}, {hour:"05:00",assigned:0,replied:0,closed:0},
    {hour:"06:00",assigned:0,replied:0,closed:0}, {hour:"07:00",assigned:1,replied:1,closed:0},
    {hour:"08:00",assigned:2,replied:5,closed:1}, {hour:"09:00",assigned:3,replied:8,closed:2},
    {hour:"10:00",assigned:3,replied:10,closed:3}, {hour:"11:00",assigned:4,replied:52,closed:8},
    {hour:"12:00",assigned:3,replied:42,closed:6}, {hour:"13:00",assigned:8,replied:20,closed:4},
    {hour:"14:00",assigned:5,replied:18,closed:3}, {hour:"15:00",assigned:3,replied:12,closed:2},
    {hour:"16:00",assigned:5,replied:8,closed:1}, {hour:"17:00",assigned:3,replied:6,closed:1},
    {hour:"18:00",assigned:2,replied:4,closed:1}, {hour:"19:00",assigned:1,replied:3,closed:0},
    {hour:"20:00",assigned:1,replied:2,closed:0}, {hour:"21:00",assigned:1,replied:2,closed:0},
    {hour:"22:00",assigned:1,replied:3,closed:1}, {hour:"23:00",assigned:0,replied:2,closed:0},
  ],
};

export function initials(name: string) {
  return name.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
const PALETTE = ["#0B6E4F","#2563EB","#9333EA","#DC2626","#D97706","#0891B2","#DB2777","#65A30D"];
export function avatarColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}
