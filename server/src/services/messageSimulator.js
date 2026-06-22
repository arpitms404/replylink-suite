// TODO: Replace this mock send function with real WhatsApp Business API call when ready
import { Message, Campaign } from "../models/index.js";

// Progress a single message through sent -> delivered -> read with random failure
export function simulateMessageProgress(messageId, campaignId, workspaceId) {
  const fail = Math.random() < 0.05;
  setTimeout(async () => {
    await Message.updateOne({ _id: messageId }, { status: fail ? "failed" : "sent", failure_reason: fail ? "number_not_on_whatsapp" : undefined });
    if (campaignId) await Campaign.updateOne({ _id: campaignId, workspace_id: workspaceId }, { $inc: fail ? { "stats.failed": 1 } : { "stats.sent": 1 } });
  }, 800 + Math.random() * 1200);

  if (fail) return;

  setTimeout(async () => {
    await Message.updateOne({ _id: messageId }, { status: "delivered" });
    if (campaignId) await Campaign.updateOne({ _id: campaignId, workspace_id: workspaceId }, { $inc: { "stats.delivered": 1 } });
  }, 2500 + Math.random() * 2000);

  setTimeout(async () => {
    if (Math.random() < 0.6) {
      await Message.updateOne({ _id: messageId }, { status: "read" });
      if (campaignId) await Campaign.updateOne({ _id: campaignId, workspace_id: workspaceId }, { $inc: { "stats.read": 1 } });
    }
  }, 5000 + Math.random() * 4000);
}
