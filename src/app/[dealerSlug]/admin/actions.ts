"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function getBasePath() {
  const headersList = await headers();
  const isCustomDomain = headersList.get("x-is-custom-domain") === "true";
  const tenantSlug = headersList.get("x-tenant-slug") || "d-car";
  return isCustomDomain ? "" : `/${tenantSlug}`;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`${await getBasePath()}/admin/login`);
}

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Wpisz e-mail oraz hasło." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    console.error("[Server Action Login Error]:", error);
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Nieprawidłowy email lub hasło"
          : error.message,
    };
  }

  redirect(`${await getBasePath()}/admin/leads`);
}

import { getCachedCurrentTenant } from "@/lib/admin-tenant";

export async function getCurrentTenant() {
  return await getCachedCurrentTenant();
}

export async function getAllTenants() {
  const { createClient: createAnonClient } = await import("@supabase/supabase-js");
  const supabase = createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: tenants, error } = await supabase
    .from("tenants")
    .select("id, slug, business_name, custom_domain, contact_phone, notification_email, city, is_published, created_at, is_super_admin")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllTenants in actions.ts] error:", error);
  }

  // Bezpieczne, ręczne filtrowanie, by mieć 100% pewności, że superadmin nie pokaże się na liście SaaS
  const filteredTenants = (tenants || []).filter(
    (t) => t.slug !== "superadmin" && t.is_super_admin !== true
  );

  console.log("[getAllTenants in actions.ts] tenants found:", filteredTenants.length);

  return filteredTenants;
}

export async function createTenantAction(formData: FormData) {
  const currentTenant = await getCurrentTenant();
  if (!currentTenant?.is_super_admin) {
    throw new Error("Tylko Superadmin może dodawać nowe komisy.");
  }

  const businessName = (formData.get("business_name") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim();
  const contactPhone = (formData.get("contact_phone") as string)?.trim();
  const notificationEmail = (formData.get("notification_email") as string)?.trim();
  const customDomain = (formData.get("custom_domain") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();

  if (!businessName || !rawSlug) {
    throw new Error("Nazwa komisu i identyfikator (slug) są wymagane.");
  }

  const slug = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const supabase = await createClient();

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    throw new Error(`Komis o identyfikatorze "${slug}" już istnieje!`);
  }

  const newTenant = {
    slug,
    business_name: businessName,
    business_description: `Skup aut i komis samochodowy ${businessName} w miejscowości ${city || "Polska"}. Szybka wycena i płatność gotówką.`,
    contact_phone: contactPhone || null,
    notification_email: notificationEmail || null,
    custom_domain: customDomain || null,
    city: city || null,
    is_super_admin: false,
    branding: {
      primaryColor: "#10b981",
      accentColor: "#f59e0b",
      heroTitle: `Skup Aut i Komis ${businessName}`,
      heroSubtitle: "Szybka wycena, bezpłatny dojazd do klienta i płatność gotówką od ręki!",
    },
    business_rules: {
      minPurchasePrice: 500,
      maxPurchasePrice: 150000,
    },
    opening_hours: {
      weekdays: "08:00 - 18:00",
      saturday: "09:00 - 14:00",
      sunday: "Zamknięte",
    },
  };

  const { error } = await supabase.from("tenants").insert([newTenant]);

  if (error) {
    throw new Error(`Błąd tworzenia komisu: ${error.message}`);
  }

  redirect(`${await getBasePath()}/admin/tenants?created=${slug}`);
}

export async function getTenantBySlug(slug: string) {
  const { createClient: createAnonClient } = await import("@supabase/supabase-js");
  const supabase = createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getTenantBySlug] error:", error.message);
  }

  return tenant;
}

export async function updateTenant(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${await getBasePath()}/admin/login`);
  }

  const superAdminTenant = await getCurrentTenant();
  const isSuperAdmin = Boolean(superAdminTenant?.is_super_admin);

  const targetSlug = formData.get("target_slug") as string | null;

  let queryTenant = superAdminTenant;
  if (isSuperAdmin && targetSlug) {
    const found = await getTenantBySlug(targetSlug);
    if (found) queryTenant = found;
  }

  if (!queryTenant) {
    throw new Error("Nie znaleziono profilu do zaktualizowania.");
  }

  const currentBranding = (queryTenant.branding as Record<string, unknown>) || {};
  const currentAnalytics = (queryTenant.analytics as Record<string, unknown>) || {};
  const currentSeo = (queryTenant.seo as Record<string, unknown>) || {};
  const currentBusinessRules = (queryTenant.business_rules as Record<string, unknown>) || {};
  const currentOpeningHours = (queryTenant.opening_hours as Record<string, unknown>) || {};

  const updates: Record<string, unknown> = {};

  // Basic info
  const businessName = formData.get("business_name");
  if (businessName !== null) updates.business_name = businessName;

  const businessDescription = formData.get("business_description");
  if (businessDescription !== null) updates.business_description = businessDescription;

  const customDomain = formData.get("custom_domain");
  if (customDomain !== null) updates.custom_domain = customDomain || null;

  const notificationEmail = formData.get("notification_email");
  if (notificationEmail !== null) updates.notification_email = notificationEmail;

  const googleSheetsWebhook = formData.get("google_sheets_webhook_url");
  if (googleSheetsWebhook !== null) updates.google_sheets_webhook_url = googleSheetsWebhook;

  // Contact & Address
  const contactPhone = formData.get("contact_phone");
  if (contactPhone !== null) updates.contact_phone = contactPhone;

  const whatsappNumber = formData.get("whatsapp_number");
  if (whatsappNumber !== null) updates.whatsapp_number = whatsappNumber;

  const address = formData.get("address");
  if (address !== null) updates.address = address;

  const city = formData.get("city");
  if (city !== null) updates.city = city;

  const postalCode = formData.get("postal_code");
  if (postalCode !== null) updates.postal_code = postalCode;

  const county = formData.get("county");
  if (county !== null) updates.county = county;

  const region = formData.get("region");
  if (region !== null) updates.region = region;

  // Branding JSONB
  const primaryColor = formData.get("branding_primary_color");
  const accentColor = formData.get("branding_accent_color");
  const logoUrl = formData.get("branding_logo_url");
  const heroTitle = formData.get("branding_hero_title");
  const heroSubtitle = formData.get("branding_hero_subtitle");

  const cleanColor = (val: unknown, fallback: string) => {
    if (!val || typeof val !== "string") return fallback;
    const trimmed = val.trim().replace(/^#+/, "#");
    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  };

  updates.branding = {
    ...currentBranding,
    primaryColor: cleanColor(primaryColor, (currentBranding.primaryColor as string) || "#10b981"),
    accentColor: cleanColor(accentColor, (currentBranding.accentColor as string) || "#f59e0b"),
    logoUrl: logoUrl || currentBranding.logoUrl || null,
    heroTitle: heroTitle || currentBranding.heroTitle || null,
    heroSubtitle: heroSubtitle || currentBranding.heroSubtitle || null,
  };

  // Analytics JSONB
  const pixelId = formData.get("pixel_id");
  const googleAnalyticsId = formData.get("google_analytics_id");
  updates.analytics = {
    ...currentAnalytics,
    pixelId: pixelId || null,
    googleAnalyticsId: googleAnalyticsId || null,
  };
  if (pixelId !== null) updates.pixel_id = pixelId;

  // Opening Hours JSONB
  const hoursWeekdays = formData.get("hours_weekdays");
  const hoursSaturday = formData.get("hours_saturday");
  const hoursSunday = formData.get("hours_sunday");
  updates.opening_hours = {
    ...currentOpeningHours,
    weekdays: hoursWeekdays || "08:00 - 18:00",
    saturday: hoursSaturday || "09:00 - 14:00",
    sunday: hoursSunday || "Zamknięte",
  };

  // Business Rules JSONB
  const minPurchasePrice = formData.get("min_purchase_price");
  const maxPurchasePrice = formData.get("max_purchase_price");
  const guaranteeText = formData.get("guarantee_text");
  updates.business_rules = {
    ...currentBusinessRules,
    minPurchasePrice: minPurchasePrice ? Number(minPurchasePrice) : 500,
    maxPurchasePrice: maxPurchasePrice ? Number(maxPurchasePrice) : 150000,
    guaranteeText: guaranteeText || null,
  };

  // SEO JSONB
  const metaTitle = formData.get("meta_title");
  const metaDescription = formData.get("meta_description");
  updates.seo = {
    ...currentSeo,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
  };

  const { error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", queryTenant.id);

  if (error) {
    throw new Error(`Błąd zapisu: ${error.message}`);
  }

  const { revalidateTag } = await import("next/cache");
  revalidateTag("tenants", "max");

  const redirectUrl = isSuperAdmin && targetSlug
    ? `${await getBasePath()}/admin/settings?tenant=${targetSlug}&saved=true`
    : `${await getBasePath()}/admin/settings?saved=true`;

  redirect(redirectUrl);
}

export async function updateLeadStatus(leadId: string, status: string, notes?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie jesteś zalogowany");
  }

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const { error } = await supabase
    .from("leads")
    .update(updateData)
    .eq("id", leadId);

  if (error) {
    throw new Error(`Błąd aktualizacji: ${error.message}`);
  }
}

// ============================================================
// Car Management Actions
// ============================================================

export async function getAdminCars(tenantSlug: string) {
  const supabase = await createClient();

  // Find the tenant by slug using the fixed anon function
  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) {
    return [];
  }

  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminCars] Error:", error.message);
    return [];
  }

  return cars || [];
}



export async function toggleCarSoldStatus(carId: string, isSold: boolean, tenantSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie jesteś zalogowany");
  }

  const { error } = await supabase
    .from("cars")
    .update({ is_sold: isSold })
    .eq("id", carId);

  if (error) {
    throw new Error(`Błąd aktualizacji statusu auta: ${error.message}`);
  }

  // Revalidate relevant pages
  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/${tenantSlug}/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);
}

export async function toggleCarFeaturedStatus(carId: string, isFeatured: boolean, tenantSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie jesteś zalogowany");
  }

  const { error } = await supabase
    .from("cars")
    .update({ is_featured: isFeatured })
    .eq("id", carId);

  if (error) {
    throw new Error(`Błąd aktualizacji wyróżnienia auta: ${error.message}`);
  }

  // Revalidate relevant pages
  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/${tenantSlug}/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);
}

export async function createCar(carData: any, tenantSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nie jesteś zalogowany");

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) throw new Error("Nie znaleziono komisu");

  const slug = `${carData.make}-${carData.model}-${carData.year || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 6);

  const { error } = await supabase.from("cars").insert({
    tenant_id: tenant.id,
    slug,
    make: carData.make,
    model: carData.model,
    year: carData.year ? parseInt(String(carData.year)) : null,
    price: carData.price ? parseFloat(String(carData.price)) : null,
    mileage: carData.mileage ? parseInt(String(carData.mileage)) : null,
    fuel_type: carData.fuel_type || null,
    engine_capacity: carData.engine_capacity || null,
    transmission: carData.transmission || null,
    color: carData.color || null,
    description: carData.description || null,
    images: carData.images || [],
    is_sold: false,
    is_featured: false
  });

  if (error) {
    throw new Error(`Błąd zapisywania auta: ${error.message}`);
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/${tenantSlug}/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);
}

export async function updateCar(carId: string, carData: any, tenantSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nie jesteś zalogowany");

  const { error } = await supabase.from("cars").update({
    make: carData.make,
    model: carData.model,
    year: carData.year ? parseInt(String(carData.year)) : null,
    price: carData.price ? parseFloat(String(carData.price)) : null,
    mileage: carData.mileage ? parseInt(String(carData.mileage)) : null,
    fuel_type: carData.fuel_type || null,
    engine_capacity: carData.engine_capacity || null,
    transmission: carData.transmission || null,
    color: carData.color || null,
    description: carData.description || null,
    images: carData.images || [],
  }).eq("id", carId);

  if (error) {
    throw new Error(`Błąd aktualizacji auta: ${error.message}`);
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/${tenantSlug}/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);
}

export async function deleteCar(carId: string, tenantSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nie jesteś zalogowany");

  const { error } = await supabase.from("cars").delete().eq("id", carId);

  if (error) {
    throw new Error(`Błąd usuwania auta: ${error.message}`);
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/${tenantSlug}/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);
}


