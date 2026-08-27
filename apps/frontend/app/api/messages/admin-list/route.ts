import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

/**
 * Owner-only — lists messages.
 * Reads the Authorization header sent by the client (from the admin login
 * form) and forwards it directly to the NestJS backend.
 * This allows the /admin page to work without the server-side ADMIN_TOKEN env.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const qs = new URLSearchParams();
  const limit = searchParams.get("limit");
  const cursor = searchParams.get("cursor");
  if (limit) qs.set("limit", limit);
  if (cursor) qs.set("cursor", cursor);
  const query = qs.toString();

  const upstream = await fetch(
    `${API_BASE_URL}/api/messages${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: authHeader,
      },
      cache: "no-store",
    },
  );

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
