import { Router } from "express";
import bcrypt from "bcryptjs";
import { TeamMember, User } from "../models/index.js";
import { requireAuth, ws, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await TeamMember.find(ws(req)).sort({ invited_at: -1 }).lean();
  res.json({ items });
});

router.post("/", requireRole("super_admin","admin"), async (req, res) => {
  const { email, full_name, role, password = "ChangeMe@123" } = req.body || {};
  if (!email || !full_name || !role) return res.status(400).json({ error: "email, full_name, role required" });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "User already exists" });
  const user = await User.create({
    workspace_id: req.user.workspace_id,
    email, full_name, role,
    password_hash: await bcrypt.hash(password, 10),
  });
  const tm = await TeamMember.create({
    workspace_id: req.user.workspace_id,
    profile_id: user._id, email, full_name, role, status: "invited",
  });
  res.status(201).json(tm);
});

router.patch("/:id", requireRole("super_admin","admin"), async (req, res) => {
  const doc = await TeamMember.findOneAndUpdate({ _id: req.params.id, ...ws(req) }, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  if (req.body.role && doc.profile_id) await User.updateOne({ _id: doc.profile_id }, { role: req.body.role });
  res.json(doc);
});

router.delete("/:id", requireRole("super_admin","admin"), async (req, res) => {
  const doc = await TeamMember.findOneAndDelete({ _id: req.params.id, ...ws(req) });
  if (!doc) return res.status(404).json({ error: "Not found" });
  if (doc.profile_id) await User.deleteOne({ _id: doc.profile_id });
  res.json({ ok: true });
});

export default router;
