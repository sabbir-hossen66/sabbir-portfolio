/**
 * Shared helpers for talking to the NestJS API from Next.js route handlers
 * and server components. Keeps the API base URL in one place so the env
 * variable only needs to be read once.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

/** Internal-only token, never exposed to the browser. Server routes only. */
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

/**
 * Forward a request to the NestJS API, attaching the admin token when one
 * is available. Returns the upstream status + JSON body verbatim so the
 * Next route handler can pass it straight back to the caller.
 */
export async function proxyToApi(
  path: string,
  init: RequestInit & { withAdminAuth?: boolean } = {}
): Promise<Response> {
  const { withAdminAuth, headers, ...rest } = init;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("content-type", "application/json");
  if (withAdminAuth && ADMIN_TOKEN) {
    finalHeaders.set("authorization", `Bearer ${ADMIN_TOKEN}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    // These are user-driven, short-lived requests — never cache.
    cache: "no-store",
  });

  return res;
}