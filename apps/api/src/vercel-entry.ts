// Vercel serverless entry point for the NestJS API.
//
// Vercel invokes this handler for every HTTP request. We lazily bootstrap the
// Nest app once per warm Lambda (module-level cache) and reuse it across
// invocations — that's the standard pattern for NestJS on serverless.
//
// Build output path must match the `src` in vercel.json: dist/vercel-entry.js.
// `nest build` is configured (tsconfig) to emit CommonJS to ./dist.
//
// Note: we type req/res as minimal Node shapes to avoid a hard dependency on
// @vercel/node at build time. Vercel's @vercel/node runtime injects objects
// compatible with these interfaces.

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

export default async function handler(
  req: { url?: string; method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown },
  res: {
    statusCode?: number;
    setHeader(name: string, value: string | string[]): void;
    getHeader(name: string): string | string[] | undefined;
    end(chunk?: unknown): void;
    write(chunk: unknown): void;
  }
) {
  const app = await getApp();
  // Underlying Express instance — what actually serves the request.
  // Vercel's @vercel/node runtime preserves the original URL in req.url,
  // so NestJS sees exactly what the caller asked for (e.g. /api/health).
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
