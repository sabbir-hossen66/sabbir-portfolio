import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });

  const config = app.get(ConfigService);
  const port = Number(config.get<string>("PORT") ?? 4000);
  const corsOrigin = config.get<string>("CORS_ORIGIN") ?? "http://localhost:3000";

  // Mount everything under /api so the URL structure matches the
  // frontend's BFF routes (e.g. /api/messages/list).
  app.setGlobalPrefix("api");

  // Tight, predictable CORS — only the portfolio origin can hit us.
  app.enableCors({
    origin: corsOrigin.split(",").map((s) => s.trim()),
    credentials: false,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  });

  // Validate every body against class-validator DTOs and strip unknown fields.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`, "Bootstrap");
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
