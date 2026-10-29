import { AutoplacFeedService } from "@/features/autoplac";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 minut cache

interface RouteParams {
  params: Promise<{
    feedToken: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<Response> {
  const { feedToken } = await params;

  if (!feedToken) {
    return new Response("Brakujący token autoryzacyjny feedu", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const result = await AutoplacFeedService.generateFeedByToken(feedToken);

  if (result.error || !result.xml) {
    return new Response(result.error || "Nie znaleziono feedu", {
      status: result.statusCode,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(result.xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
    },
  });
}
