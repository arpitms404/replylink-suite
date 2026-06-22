import { Router } from "express";
import { Template } from "../models/index.js";
import { requireAuth, ws, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await Template.find(ws(req)).sort({ updated_at: -1 }).lean();
  res.json({ items });
});

router.post("/", requireRole("super_admin","admin","marketing_manager"), async (req, res) => {
  const doc = await Template.create({ ...req.body, workspace_id: req.user.workspace_id, updated_at: new Date() });
  res.status(201).json(doc);
});

router.patch("/:id", requireRole("super_admin","admin","marketing_manager"), async (req, res) => {
  const doc = await Template.findOneAndUpdate({ _id: req.params.id, ...ws(req) }, { ...req.body, updated_at: new Date() }, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

router.delete("/:id", requireRole("super_admin","admin"), async (req, res) => {
  const r = await Template.deleteOne({ _id: req.params.id, ...ws(req) });
  if (!r.deletedCount) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
