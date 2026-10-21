import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Security check: only allow images from known storage and CDN domains
  const isAllowed =
    url.includes("supabase.co") ||
    url.includes("olxcdn.com") ||
    url.includes("apollo.olxcdn.com") ||
    url.startsWith("https://");

  if (!isAllowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new NextResponse("Image not found", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Error proxying image: ${err.message}`, { status: 500 });
  }
}
