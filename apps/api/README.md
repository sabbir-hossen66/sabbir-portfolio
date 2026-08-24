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