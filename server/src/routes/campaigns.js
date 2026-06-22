import { Router } from "express";
import { Campaign, Contact, Message, Template } from "../models/index.js";
import { requireAuth, ws, requireRole } from "../middleware/auth.js";
import { simulateMessageProgress } from "../services/messageSimulator.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await Campaign.find(ws(req)).sort({ created_at: -1 }).lean();
  res.json({ items });
});

router.post("/", requireRole("super_admin","admin","marketing_manager"), async (req, res) => {
  const { name, template_id, status = "draft", audienceSize = 0, scheduledAt } = req.body || {};
  if (!name) return res.status(400).json({ error: "name required" });
  let templateName;
  if (template_id) {
    const t = await Template.findOne({ _id: template_id, ...ws(req) }).lean();
    templateName = t?.name;
  }
  const doc = await Campaign.create({
    workspace_id: req.user.workspace_id,
    created_by: req.user.id,
    name, template_id, templateName, status, audienceSize, scheduledAt,
  });

  if (status === "running") void launchCampaign(doc);
  res.status(201).json(doc);
});

router.patch("/:id", requireRole("super_admin","admin","marketing_manager"), async (req, res) => {
  const doc = await Campaign.findOneAndUpdate({ _id: req.params.id, ...ws(req) }, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  if (req.body.status === "running") void launchCampaign(doc);
  res.json(doc);
});

router.delete("/:id", requireRole("super_admin","admin"), async (req, res) => {
  const r = await Campaign.deleteOne({ _id: req.params.id, ...ws(req) });
  if (!r.deletedCount) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

async function launchCampaign(campaign) {
  const contacts = await Contact.find({ workspace_id: campaign.workspace_id, opt_in_status: "subscribed" }).limit(campaign.audienceSize || 50).lean();
  for (const c of contacts) {
    const msg = await Message.create({
      workspace_id: campaign.workspace_id,
      contact_id: c._id,
      campaign_id: campaign._id,
      direction: "outbound",
      status: "queued",
      body: campaign.templateName || campaign.name,
    });
    simulateMessageProgress(msg._id, campaign._id, campaign.workspace_id);
  }
  setTimeout(async () => {
    await Campaign.updateOne({ _id: campaign._id }, { status: "completed" });
  }, 15000);
}

export default router;
