import { Router } from "express";
import { Conversation } from "../models/index.js";
import { requireAuth, ws } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await Conversation.find(ws(req)).sort({ lastMessageAt: -1 }).lean();
  res.json({ items });
});

router.patch("/:id", async (req, res) => {
  const doc = await Conversation.findOneAndUpdate({ _id: req.params.id, ...ws(req) }, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

export default router;
