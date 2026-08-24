# Backend — NestJS API

NestJS service that backs the portfolio's contact form + owner dashboard.

## Layout

```
apps/api/
├── prisma/
│   └── schema.prisma   # Neon Postgres schema
├── src/
│   ├── auth/           # Admin bearer-token guard
│   ├── health/         # GET /health
│   ├── messages/       # Public submit + owner list/delete
│   ├── prisma/         # PrismaService (PrismaClient wrapper)
│   ├── app.module.ts
│   └── main.ts
├── .env                # PORT, CORS_ORIGIN, ADMIN_TOKEN, DATABASE_URL
├── .env.example
└── package.json
```

## Local development

From the repo root:

```bash
npm run dev:api        # starts NestJS on http://localhost:4000
npm run dev            # starts web + api together
```

Or from this folder:

```bash
cd apps/api
npm install
npm run start:dev
```

## Type-check & build

```bash
npm run type-check     # tsc --noEmit
npm run build          # nest build → dist/
npm run start:prod     # node dist/main.js
```

## Prisma

```bash
npm run prisma:generate    # regenerate client
npm run prisma:push        # push schema to DATABASE_URL
```

## Deploy to Vercel

The API is deployed as a **separate Vercel project** (not bundled with the frontend) so it can be scaled and observed independently. The frontend is already on Vercel; this only adds the backend.

### One-time setup

1. Vercel dashboard → **Add New → Project** → import this repo again.
2. Project settings:
   - **Project Name**: `sabbir-portfolio-api` (or anything)
   - **Root Directory**: `apps/api`
   - **Framework Preset**: **Other** (NestJS — not auto-detected)
   - **Build Command**: `npm run build:vercel`  (or leave blank — uses `vercel-build`)
   - **Output Directory**: `dist`

### Environment variables (set in Vercel dashboard)

| Name | Value |
|---|---|
| `CORS_ORIGIN` | `https://your-portfolio.vercel.app` (your real frontend URL) |
| `ADMIN_TOKEN` | `sabbir-demo-token-2026` (must match the frontend's value) |
| `DATABASE_URL` | The Neon pooled connection string |

`PORT` is **not** needed — Vercel injects it automatically.

### After first deploy

Take the API URL (e.g. `https://sabbir-portfolio-api.vercel.app`) and add to the **frontend** Vercel project:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://sabbir-portfolio-api.vercel.app` |

Then trigger a frontend redeploy.

### Routes

Public URL on Vercel:
- `GET  https://your-api.vercel.app/api/health` — public
- `GET  https://your-api.vercel.app/api/messages` — admin (Bearer)
- `POST https://your-api.vercel.app/api/messages` — public
- `DELETE https://your-api.vercel.app/api/messages/:id` — admin (Bearer)

Vercel's `rewrites` entry in `vercel.json` forwards every URL `/(.*)` → `/api/vercel-entry`. Inside Nest, `setGlobalPrefix("api")` is applied so controllers resolve at `/api/health`, `/api/messages`, etc. The same prefix is applied by the local dev server (`src/main.ts`) so URLs are identical between environments.

### Caveats

- Vercel serverless has a **10s timeout** on the Hobby plan. Neon queries are sub-100ms, so this is fine. If you ever hit it, upgrade to Pro (60s).
- Cold starts: first request after idle takes 1–3s. Consider Vercel Cron pinging `/api/health` every 5 min if it bothers you.
- Local `npm run dev:api` still uses `src/main.ts` — the Vercel entry (`src/vercel-entry.ts`) is only used in production builds.
```