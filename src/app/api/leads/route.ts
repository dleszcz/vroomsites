import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { Lead } from "@/types/landing";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dealerId = body.dealerId || body.dealer_id;
    const dealerSlug = body.dealerSlug || body.dealer_slug || "";
    const customerPhone = body.customerPhone || body.phone;
    const customerName = body.customerName || body.full_name || body.fullName || "Klient";
    const customerEmail = body.customerEmail || body.email;
    const city = body.city || body.location || "";
    const brand = body.brand || "";
    const model = body.model || "";
    const year = body.year || "";
    const mileage = body.mileage || "";
    const condition = body.condition || "";
    const expectedPrice = body.expectedPrice || "";
    const vehicleDetails =
      body.vehicleDetails ||
      body.vehicle_details ||
      `${brand} ${model} (${year}), przebieg: ${mileage} km, stan: ${condition}, cena: ${expectedPrice} PLN`;

    if (!customerPhone || !dealerId) {
      return NextResponse.json(
        { error: "Wymagany jest numer telefonu oraz identyfikator komisu." },
        { status: 400 }
      );
    }

    // ── Resolve tenant settings from DB first, then env fallback ──
    let tenantEmail = body.tenantEmail || "";
    let googleSheetsWebhookUrl = "";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && !supabaseUrl.includes("placeholder") && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: tenantTenant } = await supabase
          .from("profiles")
          .select("notification_email, google_sheets_webhook_url")
          .or(`id.eq.${dealerId},slug.eq.${dealerSlug}`)
          .maybeSingle();

        if (tenantTenant?.notification_email) {
          tenantEmail = tenantTenant.notification_email;
        }
        if (tenantTenant?.google_sheets_webhook_url) {
          googleSheetsWebhookUrl = tenantTenant.google_sheets_webhook_url;
        }
      } catch (dbErr) {
        console.error("[API /api/leads] Error fetching tenant tenant:", dbErr);
      }
    }

    // Env fallbacks
    const envPrefix = `TENANT_${dealerSlug.toUpperCase().replace(/-/g, "_")}`;
    if (!tenantEmail) {
      tenantEmail = process.env[`${envPrefix}_EMAIL`] || "";
    }
    if (!googleSheetsWebhookUrl) {
      googleSheetsWebhookUrl =
        process.env[`${envPrefix}_GOOGLE_SHEETS_WEBHOOK`] ||
        process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
        process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
        "";
    }

    const leadData: Lead = {
      dealerId: dealerSlug || dealerId,
      source: body.source || "lead_form_v2",
      campaign: body.campaign,
      landingPath: body.landingPath || "/",
      customerName,
      customerPhone,
      customerEmail,
      tenantEmail,
      vehicleDetails,
      photos: body.photos || null,
      status: "new",
    };

    // 1. Save lead to Supabase / Local Storage
    const result = await createLead(leadData);

    if (!result.success) {
      console.error("Supabase / DB Lead Creation Warning:", result.error);
    }

    // 2. Forward lead to Google Sheets via Apps Script Webhook
    if (googleSheetsWebhookUrl) {
      try {
        const sheetsPayload = {
          timestamp: new Date().toISOString(),
          dealerId,
          dealerSlug,
          customerName,
          customerPhone,
          city,
          brand,
          model,
          year,
          mileage,
          condition,
          expectedPrice,
          vehicleDetails,
          photosCount: body.photosCount || 0,
        };

        const sheetsRes = await fetch(googleSheetsWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetsPayload),
        });

        if (!sheetsRes.ok) {
          const errText = await sheetsRes.text();
          console.error("Google Sheets Webhook HTTP Error:", sheetsRes.status, errText);
        } else {
          console.log(`[API /api/leads] Successfully exported lead for ${dealerSlug} to Google Sheets!`);
        }
      } catch (sheetsErr) {
        console.error("[API /api/leads] Error forwarding lead to Google Sheets Webhook:", sheetsErr);
      }
    } else {
      console.log("[API /api/leads] GOOGLE_SHEETS_WEBHOOK_URL not configured. Local lead saved.");
    }

    return NextResponse.json({ success: true, id: result.id || "local-lead-id" });
  } catch (err: unknown) {
    console.error("API /api/leads Unhandled Error:", err);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas przetwarzania formularza." },
      { status: 500 }
    );
  }
}

