import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { MessagesModule } from "./messages/messages.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // .env.example is for docs; the real values come from .env
      envFilePath: [".env.local", ".env"],
    }),
    PrismaModule,
    MessagesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}