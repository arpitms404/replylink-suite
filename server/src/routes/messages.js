import { Router } from "express";
import { Message, Conversation } from "../models/index.js";
import { requireAuth, ws } from "../middleware/auth.js";
import { simulateMessageProgress } from "../services/messageSimulator.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const { contact_id, campaign_id } = req.query;
  const filter = { ...ws(req) };
  if (contact_id) filter.contact_id = contact_id;
  if (campaign_id) filter.campaign_id = campaign_id;
  const items = await Message.find(filter).sort({ sent_at: -1 }).limit(200).lean();
  res.json({ items });
});

router.post("/", async (req, res) => {
  const { contact_id, body, campaign_id } = req.body || {};
  if (!contact_id || !body) return res.status(400).json({ error: "contact_id and body required" });
  const msg = await Message.create({
    workspace_id: req.user.workspace_id,
    contact_id, campaign_id,
    direction: "outbound", status: "queued", body,
  });
  await Conversation.updateOne(
    { workspace_id: req.user.workspace_id, contact_id },
    { $set: { lastMessage: body, lastMessageAt: new Date() } },
    { upsert: true }
  );
  simulateMessageProgress(msg._id, campaign_id, req.user.workspace_id);
  res.status(201).json(msg);
});

export default router;
