# Restructure notes — frontend ↔ backend isolation

Two clear, separate folders:

```
portfolio/
├── apps/
│   ├── frontend/   ← Next.js 14 portfolio (public site + owner dashboard)
│   └── api/        ← NestJS API (contact form + message storage)
├── package.json    ← orchestrator (npm workspaces)
└── tsconfig.json   ← project references → apps/*
```

## What's done

1. Created `apps/frontend/` as a self-contained Next.js workspace:
   - `package.json` (name `@portfolio/web`, all frontend deps)
   - `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `next-env.d.ts`
   - `tsconfig.json` (with `@/*` → `./*` alias)
   - `lib/` (`cn.ts`, `data.ts`, `utils.ts`, `api.ts`)
   - `public/` directory tree (with a README inside)
   - `.env.local`, `.env.example` (canonical)
   - `README.md` with the layout, scripts, and dev guide

2. Created per-app READMEs:
   - `apps/frontend/README.md`
   - `apps/api/README.md`

3. Updated root files to delegate:
   - `package.json` keeps only `concurrently` + `typescript`, all scripts
     delegate via `npm --workspace @portfolio/{web,api}`.
   - `tsconfig.json` is now a thin delegator using `references`.
   - `README.md` describes the new monorepo layout.

4. Converted the old root configs/env files into **empty re-export stubs**
   that point at the `apps/frontend/` versions, so nothing breaks during
   the transition:
   - `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` →
     `export { default } from "./apps/frontend/<name>"`
   - `lib/cn.ts`, `lib/data.ts`, `lib/utils.ts`, `lib/api.ts` →
     `export * from "../apps/frontend/lib/<name>"`
   - `.env.local`, `.env.example`, `next-env.d.ts` are empty stubs
     pointing at the canonical files.

## What you need to do

Open a terminal in the repo root and run:

```bash
# 1. Copy the one binary image that I can't move via text tools
mkdir -p apps/frontend/public/images
cp public/images/sabbir-dev.jpeg apps/frontend/public/images/

# 2. Delete the now-dead root files
rm -rf app                                          # dead stub
rm -rf lib                                          # dead stubs (apps/frontend/lib/ is canonical)
rm .env.local .env.example                          # stubs (apps/frontend/.env* is canonical)
rm next.config.mjs postcss.config.mjs tailwind.config.ts next-env.d.ts
rm -rf public                                       # empty after copy, or keep as-is

# 3. Drop the stale `app/lib/` empty folder if it exists
rmdir apps/frontend/app/lib 2>/dev/null
```

## Result

After the cleanup above, your tree is:

```
portfolio/
├── README.md
├── RESTRUCTURE.md          ← this file
├── package.json            ← orchestrator
├── tsconfig.json           ← project references
└── apps/
    ├── frontend/
    │   ├── README.md
    │   ├── package.json         (@portfolio/web)
    │   ├── tsconfig.json
    │   ├── next.config.mjs
    │   ├── tailwind.config.ts
    │   ├── postcss.config.mjs
    │   ├── next-env.d.ts
    │   ├── .env.local
    │   ├── .env.example
    │   ├── app/                  (pages, api, components, hooks, lib stub)
    │   ├── lib/                  (cn, data, utils, api)
    │   └── public/               (images/sabbir-dev.jpeg, …)
    └── api/
        ├── README.md
        ├── package.json          (@portfolio/api)
        ├── tsconfig.json
        ├── nest-cli.json
        ├── prisma/
        └── src/
```

## How to run

```bash
# from repo root
npm install                # installs both workspaces
npm run dev                # starts web (3000) + api (4000) together
npm run dev:web            # web only
npm run dev:api            # api only
npm run type-check:web     # tsc --noEmit on web
npm run type-check:api     # tsc --noEmit on api
npm run build              # production build of web
```

All root scripts delegate into the right workspace via `npm --workspace`.