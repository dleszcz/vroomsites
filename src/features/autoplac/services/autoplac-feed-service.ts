import { createClient } from "@supabase/supabase-js";
import { Car, Tenant } from "@/types/database";
import { AutoplacFeedMetadata, AutoplacVehicleNode } from "../types";
import { AutoplacXmlBuilder } from "./autoplac-xml-builder";

export interface FeedGenerationResult {
  xml: string | null;
  error: string | null;
  statusCode: number;
}

export class AutoplacFeedService {
  /**
   * Generuje feed XML dla danego tokenu eksportu tenanta
   */
  static async generateFeedByToken(feedToken: string): Promise<FeedGenerationResult> {
    // 1. Walidacja formatu tokenu lub slugu
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const slugRegex = /^[a-z0-9-]+$/i;
    const isUuid = uuidRegex.test(feedToken);

    if (!isUuid && !slugRegex.test(feedToken)) {
      return { xml: null, error: "Nieprawidłowy identyfikator tokenu lub slugu", statusCode: 404 };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { xml: null, error: "Brak konfiguracji bazy danych", statusCode: 500 };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Pobranie tenanta po id lub slugu (odporne na brakujące kolumny przed migracją)
    let query = supabase
      .from("tenants")
      .select("*");

    if (isUuid) {
      query = query.eq("id", feedToken);
    } else {
      query = query.eq("slug", feedToken);
    }

    const { data: tenant, error: tenantError } = await query.maybeSingle();

    if (tenantError) {
      return { xml: null, error: `Błąd bazy danych: ${tenantError.message}`, statusCode: 500 };
    }

    if (!tenant) {
      return { xml: null, error: "Nie znaleziono komisu powiązanego z tym adresem", statusCode: 404 };
    }

    const typedTenant = tenant as Tenant;

    // Feature Toggle: Jeśli integracja nie została aktywowana dla komisu, zwracamy 404
    if (!typedTenant.autoplac_enabled) {
      return { xml: null, error: "Integracja Autoplac.pl nie jest aktywna dla tego komisu", statusCode: 404 };
    }

    // 3. Pobranie aktywnych aut przeznaczonych do eksportu
    const { data: cars, error: carsError } = await supabase
      .from("cars")
      .select("*")
      .eq("tenant_id", typedTenant.id)
      .eq("is_sold", false)
      .order("created_at", { ascending: false });

    if (carsError) {
      return { xml: null, error: `Błąd pobierania aut: ${carsError.message}`, statusCode: 500 };
    }

    const allCars = (cars as Car[]) || [];

    // Jeśli dealer selektywnie włączył eksport dla wybranych aut (istnieją auta z export_to_autoplac === true),
    // filtrujemy według tej flagi. Jeśli żadne auto nie ma flagi true (np. domyślne auta komisu w VroomSites),
    // eksportujemy wszystkie aktywne (niesprzedane) pojazdy tenanta.
    const hasSelectiveExport = allCars.some((c) => c.export_to_autoplac === true);
    const vehicleList = hasSelectiveExport
      ? allCars.filter((c) => c.export_to_autoplac === true)
      : allCars;

    // 4. Mapowanie aut z bazy na węzły Autoplac
    const autoplacVehicles: AutoplacVehicleNode[] = vehicleList.map((c) => ({
      id: c.id,
      vin: c.vin || null,
      make: c.make,
      model: c.model,
      year: c.year || 2020,
      price: c.price || 0,
      currency: "PLN",
      mileage: c.mileage || 0,
      fuelType: c.fuel_type || "Benzyna",
      engineCapacity: c.engine_capacity || null,
      transmission: c.transmission || "Manualna",
      color: c.color || null,
      description: c.description || "",
      photos: Array.isArray(c.images) ? c.images : [],
      firstRegistrationDate: c.first_registration_date || null,
    }));

    const metadata: AutoplacFeedMetadata = {
      generatedAt: new Date().toISOString(),
      dealerName: typedTenant.business_name || "Komis Samochodowy",
      dealerCity: typedTenant.city || "Polska",
      dealerPhone: typedTenant.contact_phone || "",
      vehiclesCount: autoplacVehicles.length,
    };

    const xml = AutoplacXmlBuilder.buildFeed(metadata, autoplacVehicles);

    return { xml, error: null, statusCode: 200 };
  }
}
