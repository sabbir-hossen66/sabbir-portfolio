import { NextResponse } from "next/server";
import { proxyToApi } from "@/lib/api";

/**
 * Public endpoint — accepts anonymous submissions and forwards them to the
 * NestJS API. Never trusts anything other than the JSON body.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const upstream = await proxyToApi("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
