# Frontend — Next.js portfolio

This is the Next.js 14 app for the portfolio.

## Layout

```
apps/frontend/
├── app/                 # Next.js App Router (pages, layouts, route handlers)
│   ├── admin/           #   Owner-only admin pages
│   ├── api/             #   Server route handlers (proxy to apps/api)
│   ├── components/      #   Client + server React components
│   ├── dashboard/       #   Owner-only dashboard
│   ├── hooks/           #   Custom React hooks
│   ├── globals.css      #   Tailwind base + theme tokens
│   ├── layout.tsx       #   Root layout (fonts, providers)
│   └── page.tsx         #   Public home page
├── lib/                 # Shared client/server utilities
│   ├── api.ts           #   proxyToApi() — forwards to NestJS
│   ├── cn.ts            #   Tailwind className merger
│   ├── data.ts          #   Site config, experiences, skills, projects
│   └── utils.ts
├── public/              # Static assets served at /
├── .env.local           # NEXT_PUBLIC_API_URL + ADMIN_TOKEN
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Local development

From the repo root:

```bash
npm run dev:web        # starts Next.js on http://localhost:3000
npm run dev            # starts web + NestJS API together
```

Or from this folder:

```bash
cd apps/frontend
npm install
npm run dev
```

The frontend expects the NestJS API at `http://localhost:4000` (see
`.env.local` → `NEXT_PUBLIC_API_URL`). Make sure `apps/api` is running too.

## Type-check & build

```bash
npm run type-check     # tsc --noEmit
npm run build          # next build
npm run lint           # next lint
```