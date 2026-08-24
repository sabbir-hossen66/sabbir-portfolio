# Sabbir Hossen — Portfolio (monorepo)

A two-app monorepo:

- `apps/frontend/` — Next.js 14 portfolio site + owner dashboard
- `apps/api/` — NestJS API for the contact form and message storage

```
portfolio/
├── apps/
│   ├── frontend/      ← Next.js (App Router)
│   └── api/           ← NestJS + Prisma + Postgres
├── package.json       ← root orchestrator (workspaces)
└── tsconfig.json      ← project references → apps/*
```

## Quick start

```bash
# from repo root
npm install

# 1. Backend (port 4000)
npm run dev:api

# 2. Frontend (port 3000) — in another terminal
npm run dev:web

# Or run both together
npm run dev
```

## Per-app docs

- Frontend layout, scripts, env vars → [`apps/frontend/README.md`](apps/frontend/README.md)
- API layout, scripts, Prisma → [`apps/api/README.md`](apps/api/README.md)

## Root scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts web + api in parallel |
| `npm run dev:web` | Starts the Next.js frontend only |
| `npm run dev:api` | Starts the NestJS API only |
| `npm run build` | Builds the frontend (production) |
| `npm run build:web` / `build:api` | Build one app |
| `npm run start` | Runs the built frontend |
| `npm run lint` / `lint:web` / `lint:api` | Lint one or both |
| `npm run type-check` / `type-check:web` / `type-check:api` | tsc --noEmit for one or both |

All root scripts delegate into the relevant workspace via `npm --workspace`.