import { NextResponse } from "next/server";
import { proxyToApi } from "@/lib/api";

/**
 * Public — anyone can submit a message.
 * No admin auth, no rate limiting here (we rely on the form's client-side
 * throttle + the API's ValidationPipe). For production, add an IP-based
 * rate limit at the edge (Vercel Middleware / Cloudflare / etc.).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const upstream = await proxyToApi("/api/messages", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}