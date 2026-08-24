import { NextResponse } from "next/server";
import { proxyToApi } from "@/lib/api";

/**
 * Owner-only — lists messages. Sends the ADMIN_TOKEN in the Authorization
 * header. The dashboard hits this route; the browser never sees the token.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Only forward query params Nest's ListMessagesDto knows about. This
  // protects the API from unknown keys (which ValidationPipe rejects with
  // 400) and stops cache-busters from leaking upstream.
  const qs = new URLSearchParams();
  const limit = searchParams.get("limit");
  const cursor = searchParams.get("cursor");
  if (limit) qs.set("limit", limit);
  if (cursor) qs.set("cursor", cursor);
  const query = qs.toString();

  const upstream = await proxyToApi(`/api/messages${query ? `?${query}` : ""}`, {
    method: "GET",
    withAdminAuth: true,
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
