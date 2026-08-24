import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/data";

export const runtime = "nodejs";
// Always fetch the latest version of the resume from Drive
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await fetch(siteConfig.resumeUrl, {
      // Drive occasionally returns a virus-scan HTML interstitial;
      // bypass with a real User-Agent.
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SabbirPortfolio/1.0; +https://sabbirhossen.dev)",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream responded with ${upstream.status}` },
        { status: 502 }
      );
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/pdf",
        "Content-Disposition":
          'attachment; filename="sabbir-hossen-resume.pdf"',
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch resume.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}