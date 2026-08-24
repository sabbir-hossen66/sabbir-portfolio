import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super(PrismaService.buildConfig());
  }

  private static buildConfig() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set. Copy apps/api/.env.example to apps/api/.env.");
    }
    const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
    if (isLocal) {
      return { datasources: { db: { url: connectionString } } };
    }
    if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === "undefined") {
      (globalThis as { WebSocket?: unknown }).WebSocket = ws;
      neonConfig.useSecureWebSocket = true;
    }
    const pool = new NeonPool({ connectionString });
    return { adapter: new PrismaNeon(pool) };
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Prisma connected to database");
    } catch (err) {
      this.logger.error("Prisma failed to connect", err as Error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
