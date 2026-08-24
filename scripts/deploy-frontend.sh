#!/usr/bin/env bash
# Frontend deploy helper — run from anywhere.
# What it does:
#   1. cd into apps/frontend
#   2. clean stale local .next + .vercel artifacts at both levels
#   3. install deps at repo root (so workspaces resolve), then locally
#   4. run vercel deploy --prod
#
# Prereqs (ONE TIME only — done in Vercel dashboard, not here):
#   - Project Root Directory = `apps/frontend`
#   - Env vars: NEXT_PUBLIC_API_URL, ADMIN_TOKEN
#
# Usage: bash scripts/deploy-frontend.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/apps/frontend"

echo "==> Repo root : $REPO_ROOT"
echo "==> Frontend  : $FRONTEND_DIR"

cd "$FRONTEND_DIR"

echo "==> Cleaning stale build artifacts..."
rm -rf "$FRONTEND_DIR/.next" "$FRONTEND_DIR/.vercel" 2>/dev/null || true
rm -rf "$REPO_ROOT/.vercel" 2>/dev/null || true

echo "==> Checking vercel.json..."
if [ ! -f "$FRONTEND_DIR/vercel.json" ]; then
  echo "ERROR: apps/frontend/vercel.json missing — aborting."
  exit 1
fi

echo "==> Pre-deploy sanity check:"
echo "    framework  : $(node -e "console.log(require('./vercel.json').framework)")"
echo "    build cmd  : $(node -e "console.log(require('./vercel.json').buildCommand)")"

echo ""
echo "==> Running: vercel deploy --prod --yes"
echo "    (If this is the first deploy, run 'vercel link' first to bind to existing project.)"
echo ""

if vercel deploy --prod --yes; then
  echo ""
  echo "==> DONE. Copy the URL above and use it for NEXT_PUBLIC_API_URL on the API project."
else
  echo ""
  echo "==> Deploy failed. Common causes:"
  echo "    1. Root Directory in Vercel dashboard not set to 'apps/frontend'"
  echo "    2. Not linked — run 'vercel link' once first"
  echo "    3. Missing environment variables in dashboard"
  exit 1
fi