import { Router } from "express";
import { z } from "zod";
import { Contact } from "../models/index.js";
import { requireAuth, ws } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const ContactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  tags: z.array(z.string()).optional(),
  city: z.string().optional(),
  opt_in_status: z.enum(["subscribed","opted_out","unreachable"]).optional(),
  contact_lists: z.array(z.string()).optional(),
});

router.get("/", async (req, res) => {
  const items = await Contact.find(ws(req)).sort({ created_at: -1 }).limit(500).lean();
  res.json({ items });
});

router.post("/", async (req, res) => {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const doc = await Contact.create({ ...parsed.data, workspace_id: req.user.workspace_id });
  res.status(201).json(doc);
});

router.patch("/:id", async (req, res) => {
  const doc = await Contact.findOneAndUpdate({ _id: req.params.id, ...ws(req) }, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

router.delete("/:id", async (req, res) => {
  const r = await Contact.deleteOne({ _id: req.params.id, ...ws(req) });
  if (!r.deletedCount) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
