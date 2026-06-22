import { Router } from "express";
import { Campaign, Contact, Message, Conversation } from "../models/index.js";
import { requireAuth, ws } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/summary", async (req, res) => {
  const [contacts, campaigns, conversations, msgAgg] = await Promise.all([
    Contact.countDocuments(ws(req)),
    Campaign.find(ws(req)).lean(),
    Conversation.countDocuments(ws(req)),
    Message.aggregate([
      { $match: { workspace_id: (await import("mongoose")).default.Types.ObjectId.createFromHexString(req.user.workspace_id) } },
      { $group: { _id: "$status", n: { $sum: 1 } } },
    ]),
  ]);
  const byStatus = Object.fromEntries(msgAgg.map(r => [r._id, r.n]));
  const sent = (byStatus.sent || 0) + (byStatus.delivered || 0) + (byStatus.read || 0);
  const delivered = (byStatus.delivered || 0) + (byStatus.read || 0);
  const read = byStatus.read || 0;
  const failed = byStatus.failed || 0;
  res.json({
    contacts,
    activeCampaigns: campaigns.filter(c => c.status === "running").length,
    conversations,
    messagesSent: sent,
    deliveryRate: sent ? delivered / sent : 0,
    readRate: delivered ? read / delivered : 0,
    failureRate: sent ? failed / sent : 0,
    campaigns,
  });
});

export default router;
