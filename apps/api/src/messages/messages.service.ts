import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

type ListItem = {
  id: string;
  category: string;
  emoji: string | null;
  name: string | null;
  message: string;
  createdAt: Date;
};

type ListResult = {
  items: ListItem[];
  nextCursor: string | null;
};

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public — anyone can post. We never trust identity from the request;
   *  submissions are anonymous by design (no email/contact required). */
  async create(dto: CreateMessageDto) {
    const created = await this.prisma.message.create({
      data: {
        category: dto.category,
        emoji: dto.emoji ?? null,
        name: dto.name ?? null,
        message: dto.message,
      },
      select: {
        id: true,
        category: true,
        emoji: true,
        name: true,
        message: true,
        createdAt: true,
      },
    });
    return created;
  }

  /** Owner-only — cursor-paginated, newest first. */
  async list(opts: { limit: number; cursor?: string }): Promise<ListResult> {
    const take = Math.min(Math.max(opts.limit, 1), 100);

    const rows = await this.prisma.message.findMany({
      take: take + 1,
      orderBy: { createdAt: "desc" },
      ...(opts.cursor
        ? { skip: 1, cursor: { id: opts.cursor } }
        : {}),
      select: {
        id: true,
        category: true,
        emoji: true,
        name: true,
        message: true,
        createdAt: true,
      },
    });

    let nextCursor: string | null = null;
    if (rows.length > take) {
      const next = rows.pop();
      nextCursor = next?.id ?? null;
    }

    return { items: rows, nextCursor };
  }

  async remove(id: string) {
    try {
      await this.prisma.message.delete({ where: { id } });
    } catch {
      // Prisma throws P2025 when the row doesn't exist; turn it into a
      // proper 404 for the dashboard.
      throw new NotFoundException(`Message ${id} not found`);
    }
    return { id, deleted: true };
  }
}