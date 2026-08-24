import { NextResponse } from "next/server";
import { proxyToApi } from "@/lib/api";

/**
 * Owner-only — deletes a single message by id.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const upstream = await proxyToApi(`/api/messages/${encodeURIComponent(params.id)}`, {
    method: "DELETE",
    withAdminAuth: true,
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
