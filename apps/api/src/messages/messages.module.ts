import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { AdminAuthGuard } from "../auth/admin-auth.guard";

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, AdminAuthGuard],
})
export class MessagesModule {}