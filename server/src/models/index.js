import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const Workspace = model("Workspace", new Schema({
  name: { type: String, required: true },
  timezone: { type: String, default: "Asia/Kolkata" },
  plan: { type: String, enum: ["starter","business","enterprise"], default: "business" },
  credits_remaining: { type: Number, default: 50000 },
  whatsapp_connection_status: { type: String, enum: ["connected","expired","disconnected"], default: "connected" },
  contact_upload_limit: { type: Number, default: 25000 },
  created_at: { type: Date, default: Date.now },
}));

const User = model("User", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  role: { type: String, enum: ["super_admin","admin","marketing_manager","support_agent"], required: true },
  created_at: { type: Date, default: Date.now },
}));

const Contact = model("Contact", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  tags: [String],
  city: String,
  opt_in_status: { type: String, enum: ["subscribed","opted_out","unreachable"], default: "subscribed" },
  contact_lists: [String],
  last_interaction_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
}));

const ContactList = model("ContactList", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  name: { type: String, required: true },
  size: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
}));

const Template = model("Template", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, enum: ["marketing","utility","authentication"], required: true },
  approval_status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  language: { type: String, default: "en" },
  body: { type: String, required: true },
  variables: [String],
  rejection_reason: String,
  updated_at: { type: Date, default: Date.now },
}));

const Campaign = model("Campaign", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  name: { type: String, required: true },
  template_id: { type: Types.ObjectId, ref: "Template" },
  templateName: String,
  status: { type: String, enum: ["draft","scheduled","running","paused","completed","failed"], default: "draft" },
  audienceSize: { type: Number, default: 0 },
  scheduledAt: Date,
  pauseReason: String,
  hasGoal: Boolean,
  stats: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    read: { type: Number, default: 0 },
    replied: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
  created_by: { type: Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
}));

const Message = model("Message", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  contact_id: { type: Types.ObjectId, ref: "Contact", required: true },
  campaign_id: { type: Types.ObjectId, ref: "Campaign" },
  direction: { type: String, enum: ["outbound","inbound"], required: true },
  status: { type: String, enum: ["queued","sent","delivered","read","failed","undelivered"], default: "queued" },
  body: String,
  failure_reason: String,
  sent_at: { type: Date, default: Date.now },
}));

const Conversation = model("Conversation", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  contact_id: { type: Types.ObjectId, ref: "Contact", required: true },
  contactName: String,
  lastMessage: String,
  lastMessageAt: { type: Date, default: Date.now },
  unread: { type: Number, default: 0 },
  windowStatus: { type: String, enum: ["open","closed"], default: "open" },
  windowClosesInMin: Number,
  assigned_agent_id: { type: Types.ObjectId, ref: "User", default: null },
  slaBreached: Boolean,
}));

const TeamMember = model("TeamMember", new Schema({
  workspace_id: { type: Types.ObjectId, ref: "Workspace", required: true, index: true },
  profile_id: { type: Types.ObjectId, ref: "User", required: true },
  email: String,
  full_name: String,
  role: { type: String, enum: ["super_admin","admin","marketing_manager","support_agent"], required: true },
  status: { type: String, enum: ["active","invited","disabled"], default: "active" },
  invited_at: { type: Date, default: Date.now },
}));

export { Workspace, User, Contact, ContactList, Template, Campaign, Message, Conversation, TeamMember };
