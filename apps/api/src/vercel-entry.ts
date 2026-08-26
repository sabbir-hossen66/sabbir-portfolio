// Vercel serverless entry point for the NestJS API.
//
// Vercel invokes this handler for every HTTP request. We lazily bootstrap the
// Nest app once per warm Lambda (module-level cache) and reuse it across
// invocations — that's the standard pattern for NestJS on serverless.
//
// Build output path must match the `src` in vercel.json: dist/vercel-entry.js.
// `nest build` is configured (tsconfig) to emit CommonJS to ./dist.
//
// Note: req/res come from Vercel's @vercel/node runtime. We cast to
// `any` at the dispatch boundary because Vercel's runtime surface is a
// superset of Express's req/res, but the types live in @vercel/node (not
// installed at build time). This keeps the compile clean while still
// getting full Express behaviour at runtime.

import "reflect-metadata";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

let cachedApp: NestExpressApplication | null = null;

async function getApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["error", "warn"],
  });

  // Match the local dev server's URL structure (src/main.ts) so
  // /api/messages, /api/health etc. resolve the same in every environment.
  // Vercel's catch-all route forwards every URL to this handler with the
  // original path preserved in req.url — no URL rewriting needed here.
  app.setGlobalPrefix("api");

  // CORS — allow the Vercel-hosted frontend. Pull from env so we can update
  // without a redeploy of the function code.
  const corsOrigin =
    process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ??
    ["http://localhost:3000"];
  app.enableCors({
    origin: corsOrigin,
    credentials: false,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  await app.init();
  cachedApp = app;
  Logger.log("Nest app initialized for Vercel serverless", "VercelEntry");
  return app;
}

// Express types live in @types/express, which we already have. Casting
// to `any` here is safe: Vercel's @vercel/node runtime injects objects
// that satisfy Express's req/res interface at runtime. The cast keeps
// the build clean without forcing @vercel/node as a devDependency.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReq = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRes = any;

export default async function handler(req: AnyReq, res: AnyRes) {
  const app = await getApp();
  // Underlying Express instance — what actually serves the request.
  // Vercel's @vercel/node runtime preserves the original URL in req.url,
  // so NestJS sees exactly what the caller asked for (e.g. /api/health).
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
