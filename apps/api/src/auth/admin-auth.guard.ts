import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";

/**
 * Single-token owner guard.
 *
 * Compares the `Authorization: Bearer <token>` header against
 * `process.env.ADMIN_TOKEN` using a constant-time compare so we don't leak
 * the expected token length via timing.
 *
 * No JWT/session library required for the demo — swap this for a real
 * cookie-based or OIDC flow later without touching the rest of the app.
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly logger = new Logger(AdminAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const header = req.headers["authorization"] ?? "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Missing Bearer token");
    }

    const expected = process.env.ADMIN_TOKEN;
    if (!expected) {
      this.logger.error("ADMIN_TOKEN is not configured on the API server");
      throw new UnauthorizedException("Server is not configured for owner access");
    }

    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException("Invalid admin token");
    }

    return true;
  }
}