import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import { Workspace, User, Contact, ContactList, Template, Campaign, Message, Conversation, TeamMember } from "./models/index.js";

const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || "Arpit@skilllogic.in").toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Arpit@1122";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Arpit";

const names = ["Aarav Sharma","Priya Patel","Rahul Kumar","Sneha Reddy","Vikram Singh","Anjali Gupta","Karan Mehta","Riya Joshi","Arjun Nair","Diya Iyer","Rohan Desai","Isha Verma","Aditya Rao","Kavya Pillai","Nikhil Bose","Tanvi Shah","Yash Malhotra","Meera Kapoor","Siddharth Jain","Pooja Agarwal","Manish Shetty","Neha Bhatt","Aryan Saxena","Shreya Menon","Dev Choudhary"];
const cities = ["Mumbai","Bangalore","Delhi","Pune","Chennai","Hyderabad","Kolkata","Ahmedabad"];
const tagsPool = ["VIP","Lead","New","Returning","Cart-Abandon","Newsletter","Promo","High-Value"];

async function main() {
  await connectDB();

  let workspace = await Workspace.findOne({ name: "SkillLogic Marketing" });
  if (!workspace) workspace = await Workspace.create({ name: "SkillLogic Marketing", timezone: "Asia/Kolkata", plan: "business", credits_remaining: 48230 });

  // Seed admin (idempotent)
  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    admin = await User.create({
      workspace_id: workspace._id,
      email: ADMIN_EMAIL,
      password_hash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      full_name: ADMIN_NAME,
      role: "super_admin",
    });
    console.log("[seed] created admin", ADMIN_EMAIL);
  } else {
    console.log("[seed] admin exists", ADMIN_EMAIL);
  }

  // Reset demo data
  await Promise.all([
    Contact.deleteMany({ workspace_id: workspace._id }),
    ContactList.deleteMany({ workspace_id: workspace._id }),
    Template.deleteMany({ workspace_id: workspace._id }),
    Campaign.deleteMany({ workspace_id: workspace._id }),
    Message.deleteMany({ workspace_id: workspace._id }),
    Conversation.deleteMany({ workspace_id: workspace._id }),
    TeamMember.deleteMany({ workspace_id: workspace._id }),
  ]);

  const contacts = await Contact.insertMany(names.map((n, i) => ({
    workspace_id: workspace._id,
    name: n,
    phone: `+9198${String(76543210 + i).slice(0, 8)}`,
    tags: [tagsPool[i % tagsPool.length], tagsPool[(i + 3) % tagsPool.length]],
    city: cities[i % cities.length],
    opt_in_status: i % 11 === 0 ? "opted_out" : i % 17 === 0 ? "unreachable" : "subscribed",
    contact_lists: i % 3 === 0 ? ["VIP Customers"] : ["General Audience"],
    last_interaction_at: new Date(Date.now() - i * 3600_000 * 6),
  })));

  await ContactList.insertMany([
    { workspace_id: workspace._id, name: "VIP Customers", size: contacts.filter(c => c.contact_lists.includes("VIP Customers")).length },
    { workspace_id: workspace._id, name: "General Audience", size: contacts.filter(c => c.contact_lists.includes("General Audience")).length },
    { workspace_id: workspace._id, name: "Diwali Promo 2025", size: 1240 },
  ]);

  const templates = await Template.insertMany([
    { workspace_id: workspace._id, name: "Diwali Sale 2025", category: "marketing", approval_status: "approved", language: "en", body: "Hi {{1}}, our Diwali sale is live! Up to 50% off. Shop: {{2}}", variables: ["name","link"] },
    { workspace_id: workspace._id, name: "Order Shipped", category: "utility", approval_status: "approved", language: "en", body: "Hi {{1}}, your order #{{2}} has shipped. Track: {{3}}", variables: ["name","order_id","tracking_url"] },
    { workspace_id: workspace._id, name: "OTP Verification", category: "authentication", approval_status: "approved", language: "en", body: "Your verification code is {{1}}. Do not share.", variables: ["otp"] },
    { workspace_id: workspace._id, name: "Welcome Onboard", category: "marketing", approval_status: "pending", language: "en", body: "Welcome {{1}}! Thanks for joining.", variables: ["name"] },
    { workspace_id: workspace._id, name: "Flash Promo 80%", category: "marketing", approval_status: "rejected", language: "en", body: "{{1}}, 80% OFF EVERYTHING. Click now!!! {{2}}", variables: ["name","link"], rejection_reason: "Promotional content violates Meta's guidelines on exaggerated discount claims." },
  ]);

  const diwali = templates[0], shipped = templates[1];

  await Campaign.insertMany([
    { workspace_id: workspace._id, name: "Diwali Festive Push", template_id: diwali._id, templateName: diwali.name, status: "running", audienceSize: 12500, stats: { sent: 8400, delivered: 8120, read: 5240, replied: 380, failed: 280 }, created_by: admin._id },
    { workspace_id: workspace._id, name: "Order Update — Wave 3", template_id: shipped._id, templateName: shipped.name, status: "completed", audienceSize: 3400, stats: { sent: 3400, delivered: 3380, read: 2960, replied: 142, failed: 20 }, created_by: admin._id },
    { workspace_id: workspace._id, name: "Weekend Flash Sale", template_id: diwali._id, templateName: diwali.name, status: "scheduled", scheduledAt: new Date(Date.now() + 86400000), audienceSize: 9800, stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 }, created_by: admin._id },
    { workspace_id: workspace._id, name: "VIP Re-engagement", template_id: diwali._id, templateName: diwali.name, status: "draft", audienceSize: 420, stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 }, created_by: admin._id },
    { workspace_id: workspace._id, name: "Black Friday Teaser", template_id: diwali._id, templateName: diwali.name, status: "paused", pauseReason: "user", audienceSize: 15000, stats: { sent: 4200, delivered: 4180, read: 2200, replied: 90, failed: 20 }, created_by: admin._id },
    { workspace_id: workspace._id, name: "Lapsed Customers Win-back", template_id: shipped._id, templateName: shipped.name, status: "completed", audienceSize: 2200, stats: { sent: 2200, delivered: 2140, read: 1320, replied: 88, failed: 60 }, created_by: admin._id },
  ]);

  await Conversation.insertMany(contacts.slice(0, 10).map((c, i) => ({
    workspace_id: workspace._id,
    contact_id: c._id,
    contactName: c.name,
    lastMessage: i % 2 === 0 ? "Can I get a refund?" : "Thanks for the update!",
    lastMessageAt: new Date(Date.now() - i * 600_000),
    unread: i < 4 ? (i + 1) : 0,
    windowStatus: i % 3 === 0 ? "closed" : "open",
    windowClosesInMin: i % 3 === 0 ? undefined : 1440 - i * 60,
    assigned_agent_id: i < 3 ? admin._id : null,
    slaBreached: i === 1,
  })));

  // Team members
  const memberSpecs = [
    { email: "kavya.admin@skilllogic.in", full_name: "Kavya Admin", role: "admin" },
    { email: "rohan.marketing@skilllogic.in", full_name: "Rohan Marketing", role: "marketing_manager" },
    { email: "sara.support@skilllogic.in", full_name: "Sara Support", role: "support_agent" },
  ];
  for (const m of memberSpecs) {
    let u = await User.findOne({ email: m.email });
    if (!u) {
      u = await User.create({
        workspace_id: workspace._id,
        email: m.email,
        password_hash: await bcrypt.hash("Welcome@123", 10),
        full_name: m.full_name,
        role: m.role,
      });
    }
    await TeamMember.create({
      workspace_id: workspace._id, profile_id: u._id,
      email: m.email, full_name: m.full_name, role: m.role, status: "active",
    });
  }
  await TeamMember.create({
    workspace_id: workspace._id, profile_id: admin._id,
    email: admin.email, full_name: admin.full_name, role: admin.role, status: "active",
  });

  console.log("[seed] done");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
