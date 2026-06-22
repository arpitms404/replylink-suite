import { Router } from "express";
import { ContactList } from "../models/index.js";
import { requireAuth, ws } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await ContactList.find(ws(req)).sort({ created_at: -1 }).lean();
  res.json({ items });
});

router.post("/", async (req, res) => {
  const { name, size = 0 } = req.body || {};
  if (!name) return res.status(400).json({ error: "name required" });
  const doc = await ContactList.create({ workspace_id: req.user.workspace_id, name, size });
  res.status(201).json(doc);
});

export default router;
