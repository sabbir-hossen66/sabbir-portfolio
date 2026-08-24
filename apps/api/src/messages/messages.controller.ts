import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ListMessagesDto } from "./dto/list-messages.dto";
import { MessagesService } from "./messages.service";
import { AdminAuthGuard } from "../auth/admin-auth.guard";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  /** Public — no auth. Anyone can leave a note. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMessageDto) {
    return this.messages.create(dto);
  }

  /** Owner-only — bearer token via AdminAuthGuard. */
  @Get()
  @UseGuards(AdminAuthGuard)
  list(@Query() query: ListMessagesDto) {
    return this.messages.list({
      limit: query.limit ?? 30,
      cursor: query.cursor,
    });
  }

  @Delete(":id")
  @UseGuards(AdminAuthGuard)
  remove(@Param("id") id: string) {
    return this.messages.remove(id);
  }
}