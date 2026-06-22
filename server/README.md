# SkillLogic WhatsApp CRM — API Server

Node.js + Express + Mongoose + JWT + bcrypt backend for the SkillLogic WhatsApp CRM frontend.

## Stack

- Node 20+
- Express 4
- Mongoose 8 (MongoDB Atlas)
- JWT (jsonwebtoken)
- bcryptjs
- Zod (input validation)

## Local setup

```bash
cd server
cp .env.example .env        # then edit JWT_SECRET to a long random string
npm install
npm run seed                # creates workspace, seed admin, sample data
npm run dev                 # starts on http://localhost:4000
```

Health check: `GET http://localhost:4000/health`

## Deploying

This API is a plain Node service — host it anywhere that runs Node 20+:

- **Render** (recommended free tier): New → Web Service → connect repo → Root `server` → Build `npm install` → Start `npm start` → add env vars from `.env.example`.
- **Railway / Fly.io / Heroku / VPS**: same idea — set env vars, run `npm start`.

After deploy, set `VITE_API_URL=https://your-api.onrender.com` in the **frontend** Lovable project (Project Settings → Environment Variables) and republish the frontend.

## Seed credentials

```
Email:    Arpit@skilllogic.in
Password: Arpit@1122
Role:     super_admin
```

Re-running `npm run seed` is idempotent for the admin user; it will reset demo data (contacts/campaigns/templates/conversations/messages) every run.

## API surface

All authenticated endpoints require `Authorization: Bearer <jwt>`.

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | `{email,password}` → `{token,user}` |
| POST | `/api/auth/logout` | client just drops token |
| GET  | `/api/auth/me` | current user |
| GET/POST | `/api/contacts` | list/create |
| GET/PATCH/DELETE | `/api/contacts/:id` | |
| GET/POST | `/api/contact-lists` | |
| GET/POST | `/api/templates` | |
| GET/PATCH/DELETE | `/api/templates/:id` | |
| GET/POST | `/api/campaigns` | POST triggers simulated send |
| GET/PATCH/DELETE | `/api/campaigns/:id` | |
| GET | `/api/conversations` | |
| PATCH | `/api/conversations/:id` | assign agent / mark read |
| GET/POST | `/api/messages` | |
| GET/POST | `/api/team` | admin/super_admin only for POST |
| PATCH/DELETE | `/api/team/:id` | admin/super_admin only |
| GET | `/api/dashboard/summary` | KPIs |

## Message simulation

`src/services/messageSimulator.js` progresses messages through `sent → delivered → read` with timers. Search for:

```
// TODO: Replace this mock send function with real WhatsApp Business API call when ready
```

to wire the real Meta Cloud API later.

## RBAC

- `super_admin` — full access incl. workspace/billing
- `admin` — manage team, contacts, campaigns, templates
- `marketing_manager` — campaigns/templates/contacts (no team)
- `support_agent` — conversations/messages read+reply only

All queries are scoped to `req.user.workspace_id` — multi-tenant safe.
