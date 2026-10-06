"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
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

  redirect("/admin/leads");
}

export async function getCurrentTenant() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("[getCurrentTenant] getUser:", user?.email || "NULL", "error:", userError?.message || "none");

  if (!user) return null;

  // Try matching user_id
  const { data: tenant, error: tenantError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("[getCurrentTenant] tenant-by-user_id:", tenant?.slug || "NULL", "error:", tenantError?.message || "none");

  if (tenant) return tenant;

  // Fallback match first non-superadmin tenant in database
  const { data: fallbackTenant, error: fallbackError } = await supabase
    .from("profiles")
    .select("*")
    .neq("slug", "superadmin")
    .limit(1)
    .maybeSingle();

  console.log("[getCurrentTenant] fallback:", fallbackTenant?.slug || "NULL", "error:", fallbackError?.message || "none");

  return fallbackTenant || null;
}

export async function getAllTenants() {
  const supabase = await createClient();
  const { data: tenants } = await supabase
    .from("profiles")
    .select("id, slug, business_name, custom_domain, contact_phone, notification_email, city, is_published, created_at, is_super_admin")
    .or("is_super_admin.eq.false,is_super_admin.is.null")
    .neq("slug", "superadmin")
    .order("created_at", { ascending: false });

  return tenants || [];
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
    .from("profiles")
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

  const { error } = await supabase.from("profiles").insert([newTenant]);

  if (error) {
    throw new Error(`Błąd tworzenia komisu: ${error.message}`);
  }

  redirect(`/admin/tenants?created=${slug}`);
}

export async function getTenantBySlug(slug: string) {
  const supabase = await createClient();
  const { data: tenant } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return tenant;
}

export async function updateTenant(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
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
    .from("profiles")
    .update(updates)
    .eq("id", queryTenant.id);

  if (error) {
    throw new Error(`Błąd zapisu: ${error.message}`);
  }

  const redirectUrl = isSuperAdmin && targetSlug
    ? `/admin/settings?tenant=${targetSlug}&saved=true`
    : `/admin/settings?saved=true`;

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

  // Find the tenant by slug
  const { data: tenant } = await supabase
    .from("profiles")
    .select("id")
    .eq("slug", tenantSlug)
    .maybeSingle();

  if (!tenant) {
    const { seedCars } = await import("@/lib/data");
    return seedCars;
  }

  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminCars] Error:", error.message);
    const { seedCars } = await import("@/lib/data");
    return seedCars;
  }

  return cars || [];
}

/**
 * One-shot sync: removes ALL cars for this tenant, then re-inserts seed data.
 * Safe to call multiple times — always results in exactly the seed set.
 */
export async function syncSeedCarsToDb(tenantSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie jesteś zalogowany");
  }

  const { data: tenant } = await supabase
    .from("profiles")
    .select("id")
    .eq("slug", tenantSlug)
    .maybeSingle();

  if (!tenant) {
    throw new Error(`Nie znaleziono profilu: ${tenantSlug}`);
  }

  // Delete all existing cars for this tenant (clean slate)
  await supabase.from("cars").delete().eq("tenant_id", tenant.id);

  // Insert seed cars with the real tenant UUID
  const { seedCars, seedTenantDCar } = await import("@/lib/data");
  const tenantSeedCars = seedCars.filter((c) => c.tenant_id === seedTenantDCar.id);

  if (tenantSeedCars.length === 0) {
    return [];
  }

  const carsToInsert = tenantSeedCars.map((car) => ({
    tenant_id: tenant.id,
    slug: car.slug,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuel_type: car.fuel_type,
    engine_capacity: car.engine_capacity,
    transmission: car.transmission,
    color: car.color,
    description: car.description,
    images: car.images,
    is_sold: car.is_sold,
    is_featured: car.is_featured,
  }));

  const { data: inserted, error: insertError } = await supabase
    .from("cars")
    .insert(carsToInsert)
    .select("*");

  if (insertError) {
    throw new Error(`Błąd synchronizacji: ${insertError.message}`);
  }

  // Revalidate
  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);

  return inserted || [];
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
  revalidatePath(`/admin/cars`);
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
  revalidatePath(`/admin/cars`);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/samochody`);
}

