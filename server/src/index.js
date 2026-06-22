import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import auth from "./routes/auth.js";
import contacts from "./routes/contacts.js";
import templates from "./routes/templates.js";
import campaigns from "./routes/campaigns.js";
import conversations from "./routes/conversations.js";
import messages from "./routes/messages.js";
import team from "./routes/team.js";
import contactLists from "./routes/contactLists.js";
import dashboard from "./routes/dashboard.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use("/api/auth", auth);
app.use("/api/contacts", contacts);
app.use("/api/contact-lists", contactLists);
app.use("/api/templates", templates);
app.use("/api/campaigns", campaigns);
app.use("/api/conversations", conversations);
app.use("/api/messages", messages);
app.use("/api/team", team);
app.use("/api/dashboard", dashboard);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const port = Number(process.env.PORT || 4000);
connectDB().then(() => {
  app.listen(port, () => console.log(`[api] listening on :${port}`));
}).catch(err => {
  console.error("[db] connection failed", err);
  process.exit(1);
});
