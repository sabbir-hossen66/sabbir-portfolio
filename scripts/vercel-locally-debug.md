# How to see the full build error

The build log you pasted stops at `added 349 packages in 7s`. The actual
failure happens after that. To debug:

## Option A — paste the rest of the Vercel log

In Vercel dashboard → Deployments → click the failed one → scroll the log
panel down → copy everything below `added 349 packages in 7s` and paste it
back to me. The error will be there.

## Option B — run the same commands locally

From the repo root in a terminal:

```bash
# Simulate what Vercel did (but in apps/api only):
cd apps/api
npm install
npm run build
```

If the build fails locally, you'll see the exact TS/Prisma error. Fix it,
commit, push — Vercel will pick it up.

## Why the build likely failed

The 349-package count suggests Vercel installed dependencies at the **repo
root**, not `apps/api/`. Verify in Vercel:
- Project → Settings → General → **Root Directory** = `apps/api`
- Project → Settings → Build & Development Settings → **Build Command**
  override = (empty, uses vercel.json)

If Root Directory is wrong, set it to `apps/api`, then redeploy.
