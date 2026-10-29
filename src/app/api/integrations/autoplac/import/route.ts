import { NextRequest, NextResponse } from "next/server";
import { AutoplacImporter } from "@/features/autoplac";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.dealerSlug || body.url || body.slug;

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { error: "Pole 'dealerSlug' lub 'url' jest wymagane." },
        { status: 400 }
      );
    }

    const result = await AutoplacImporter.fetchDealerVehicles(target);

    if (result.error) {
      return NextResponse.json(
        { error: result.error, totalFound: 0, vehicles: [] },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      totalFound: result.totalFound,
      vehicles: result.data || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Wewnętrzny błąd serwera";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
