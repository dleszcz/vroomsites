/**
 * Autoplac.pl Public Listing Importer
 *
 * Pobiera i parsuje listę ogłoszeń z profilu publicznego dilera (https://autoplac.pl/dealer/<slug>)
 * w celu ułatwienia natychmiastowej migracji i onboardingu nowego salonu samochodowego.
 */

export interface ImportedAutoplacVehicle {
  title: string;
  make: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  city: string;
  sourceUrl: string;
  imageUrl?: string;
  description?: string;
}

export interface AutoplacImportResult {
  data: ImportedAutoplacVehicle[] | null;
  totalFound: number;
  error: string | null;
}

export class AutoplacImporter {
  /**
   * Ekstrahuje slug dealera z pełnego adresu URL lub zwraca oczyszczony slug
   */
  static normalizeDealerSlug(urlOrSlug: string): string {
    const trimmed = urlOrSlug.trim();
    if (!trimmed) return "";

    const match = trimmed.match(/autoplac\.pl\/dealer\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }

    return trimmed.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/").pop() || trimmed;
  }

  /**
   * Pobiera zawartość strony dilera i parsuje listę ogłoszeń
   */
  static async fetchDealerVehicles(urlOrSlug: string): Promise<AutoplacImportResult> {
    const dealerSlug = this.normalizeDealerSlug(urlOrSlug);
    if (!dealerSlug) {
      return {
        data: null,
        totalFound: 0,
        error: "Nieprawidłowy adres lub identyfikator profilu dilera na Autoplac.pl",
      };
    }

    const targetUrl = `https://autoplac.pl/dealer/${dealerSlug}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 VroomImporter/1.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        },
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        return {
          data: null,
          totalFound: 0,
          error: `Błąd połączenia z Autoplac.pl: HTTP ${response.status}`,
        };
      }

      const html = await response.text();
      const vehicles = this.parseVehiclesFromHtml(html, targetUrl);

      return {
        data: vehicles,
        totalFound: vehicles.length,
        error: null,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Nieznany błąd podczas pobierania ogłoszeń";
      return {
        data: null,
        totalFound: 0,
        error: message,
      };
    }
  }

  /**
   * Parsuje treść HTML lub zrzut markdown / linki ogłoszeń z Autoplac
   */
  static parseVehiclesFromHtml(content: string, baseUrl: string): ImportedAutoplacVehicle[] {
    const vehicles: ImportedAutoplacVehicle[] = [];

    // Dopasowanie linków do ogłoszeń: /oferta/<make>/<model>/...
    const offerRegex =
      /href="(\/oferta\/([^"/]+)\/([^"/]+)\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    
    // Fallback dla zrzutu tekstowego markdown
    const mdOfferRegex =
      /\[([^\]]+)\]\((https:\/\/autoplac\.pl\/oferta\/([^/]+)\/([^/]+)\/[^)]+)\)/gi;

    // 1. Sprawdzamy wystąpienia w formacie linków HTML
    const seenUrls = new Set<string>();

    let match: RegExpExecArray | null;
    while ((match = offerRegex.exec(content)) !== null) {
      const path = match[1];
      const makeRaw = match[2];
      const modelRaw = match[3];
      const innerHtml = match[4];

      const fullUrl = path.startsWith("http") ? path : `https://autoplac.pl${path}`;
      if (seenUrls.has(fullUrl)) continue;
      seenUrls.add(fullUrl);

      const parsed = this.parseOfferItem(fullUrl, makeRaw, modelRaw, innerHtml);
      if (parsed) {
        vehicles.push(parsed);
      }
    }

    // 2. Jeśli regex HTML nie znalazł (np. content był w formacie markdown), sprawdzamy mdOfferRegex
    if (vehicles.length === 0) {
      while ((match = mdOfferRegex.exec(content)) !== null) {
        const titleAndData = match[1];
        const fullUrl = match[2];
        const makeRaw = match[3];
        const modelRaw = match[4];

        if (seenUrls.has(fullUrl)) continue;
        seenUrls.add(fullUrl);

        const parsed = this.parseMarkdownOfferItem(fullUrl, makeRaw, modelRaw, titleAndData);
        if (parsed) {
          vehicles.push(parsed);
        }
      }
    }

    return vehicles;
  }

  private static parseOfferItem(
    url: string,
    makeRaw: string,
    modelRaw: string,
    textSnippet: string
  ): ImportedAutoplacVehicle | null {
    const imgMatch = textSnippet.match(/<img[^>]+(?:src|data-src)="([^"]+)"/i);
    const foundImage = imgMatch && imgMatch[1] && !imgMatch[1].startsWith("data:") ? imgMatch[1] : undefined;

    const cleanText = textSnippet
      .replace(/&nbsp;/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/[\s\u00A0]+/g, " ")
      .trim();

    const parsed = this.parseMarkdownOfferItem(url, makeRaw, modelRaw, cleanText);
    if (parsed && foundImage) {
      parsed.imageUrl = foundImage;
    }
    return parsed;
  }

  private static parseMarkdownOfferItem(
    url: string,
    makeRaw: string,
    modelRaw: string,
    rawText: string
  ): ImportedAutoplacVehicle | null {
    const normalized = rawText.replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ");
    const make = this.capitalize(decodeURIComponent(makeRaw).replace(/-/g, " "));
    const model = this.capitalize(decodeURIComponent(modelRaw).replace(/-/g, " "));

    // Szukanie ceny (np. 39 999 zł, 41 900 zł, 22 900 zł)
    const priceMatch = normalized.match(/(\d[\d\s]*\d|\d+)\s*zł/i);
    const price = priceMatch
      ? parseInt(priceMatch[1].replace(/\s/g, ""), 10)
      : 0;

    // Szukanie rocznika (4 cyfry 1990 - 2026)
    const yearMatch = normalized.match(/\b(199\d|20[0-2]\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    // Szukanie przebiegu (np. 77 000 km, 163 380 km)
    const mileageMatch = normalized.match(/(\d[\d\s]*\d|\d+)\s*km/i);
    const mileage = mileageMatch
      ? parseInt(mileageMatch[1].replace(/\s/g, ""), 10)
      : 0;

    // Paliwo
    const fuelType = /diesel/i.test(normalized)
      ? "Diesel"
      : /hybryda|hybrid/i.test(normalized)
      ? "Hybryda"
      : /lpg|gaz/i.test(normalized)
      ? "Benzyna + LPG"
      : /elektrycz/i.test(normalized)
      ? "Elektryczny"
      : "Benzyna";

    // Skrzynia
    const transmission = /automat/i.test(normalized) ? "Automatyczna" : "Manualna";

    // Miasto (np. Dąbrowa Biskupia)
    const cityMatch = normalized.match(/([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*)\s*\([Kk]ujawsko/);
    const city = cityMatch ? cityMatch[1] : "Dąbrowa Biskupia";

    // Tytuł
    const titleMatch = normalized.split(/\d+\s*zł/)[0];
    const title = titleMatch && titleMatch.trim().length > 3
      ? titleMatch.replace(/Tylko u nas/gi, "").trim()
      : `${make} ${model} (${year})`;

    return {
      title,
      make,
      model,
      price: price || 25000,
      year,
      mileage: mileage || 120000,
      fuelType,
      transmission,
      city,
      sourceUrl: url,
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    };
  }

  private static capitalize(str: string): string {
    return str
      .split(" ")
      .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1).toLowerCase() : ""))
      .join(" ");
  }

  /**
   * Pobiera flotę z Autoplac i zapisuje auta bezpośrednio w tabeli 'cars' powiązanej z danym tenantem
   */
  static async syncDealerVehiclesToDatabase(
    dealerSlugOrUrl: string,
    tenantId: string
  ): Promise<{ success: boolean; importedCount: number; error: string | null }> {
    const result = await this.fetchDealerVehicles(dealerSlugOrUrl);
    if (result.error || !result.data || result.data.length === 0) {
      return {
        success: false,
        importedCount: 0,
        error: result.error || "Nie znaleziono ogłoszeń na profilu Autoplac.pl",
      };
    }

    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      let imported = 0;
      for (const v of result.data) {
        const slugBase = `${v.make}-${v.model}-${v.year}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-");
        const uniqueSlug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;

        const carData = {
          tenant_id: tenantId,
          slug: uniqueSlug,
          make: v.make,
          model: v.model,
          year: v.year,
          price: v.price,
          mileage: v.mileage,
          fuel_type: v.fuelType,
          transmission: v.transmission,
          color: "Standard",
          description: `Sprawdzone auto z oferty salonu. Pochodzi z polskiej sieci dealerskiej / importu. Pełna dokumentacja i weryfikacja techniczna.`,
          images: v.imageUrl ? [v.imageUrl] : [],
          is_sold: false,
          is_featured: imported < 4,
          export_to_autoplac: true,
        };

        const { error: insertErr } = await supabase.from("cars").insert([carData]);
        if (!insertErr) {
          imported++;
        }
      }

      const { revalidateTag } = await import("next/cache");
      revalidateTag("cars", "max");

      return {
        success: true,
        importedCount: imported,
        error: null,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Błąd bazy danych podczas synchronizacji";
      return { success: false, importedCount: 0, error: msg };
    }
  }
}

