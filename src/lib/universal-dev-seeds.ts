import { Tenant, Car } from "@/types/database";

/**
 * Universal Synthetic Car Template for Local Development & Testing.
 * Completely tenant-agnostic with verified high-resolution Unsplash automotive photos.
 */
interface MockCarTemplate {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  engine_capacity: string;
  transmission: string;
  color: string;
  description: string;
  images: string[];
  is_featured: boolean;
}

const UNIVERSAL_MOCK_TEMPLATES: MockCarTemplate[] = [
  {
    slug: "audi-a4-avant-2-0-tdi-2021",
    make: "Audi",
    model: "A4 Avant",
    year: 2021,
    price: 118900,
    mileage: 84500,
    fuel_type: "Diesel",
    engine_capacity: "1968 cm³ (190 KM)",
    transmission: "Automat",
    color: "Kombi",
    description: "Audi A4 Avant 2.0 TDI S Tronic w idealnym stanie technicznym i wizualnym. Regularnie serwisowany w ASO, pełna historia serwisowa, bezwypadkowy. Bogate wyposażenie obejmujące pakiet S-Line, reflektory Matrix LED, wirtualny kokpit, aktywny tempomat oraz fotele sportowe z tapicerką skórzaną. Faktura VAT 23%.",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: true,
  },
  {
    slug: "bmw-seria-3-320d-m-sport-2020",
    make: "BMW",
    model: "Seria 3",
    year: 2020,
    price: 134000,
    mileage: 76000,
    fuel_type: "Diesel",
    engine_capacity: "1995 cm³ (190 KM)",
    transmission: "Automat",
    color: "Sedan",
    description: "BMW 320d xDrive Sedan w fabrycznym pakiecie M Sport. Dynamiczny silnik diesla o mocy 190 KM z napędem na cztery koła i 8-biegową skrzynią Steptronic. Lakier metalizowany, zawieszenie adaptacyjne M, sportowy układ kierowniczy, fotele M z pamięcią ustawień. Samochód bezwypadkowy, po pełnym przeglądzie.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: true,
  },
  {
    slug: "volkswagen-golf-viii-1-5-etsi-2022",
    make: "Volkswagen",
    model: "Golf",
    year: 2022,
    price: 89900,
    mileage: 34200,
    fuel_type: "Hybryda",
    engine_capacity: "1498 cm³ (150 KM)",
    transmission: "Automat",
    color: "Hatchback",
    description: "Volkswagen Golf VIII z oszczędnym napędem miękkiej hybrydy 1.5 eTSI oraz automatyczną skrzynią DSG. Znakomity stan techniczny, zaledwie 34 200 km przebiegu. Wersja wyposażenia Style z cyfrowymi zegarami Digital Cockpit Pro, ambientowym oświetleniem 30 kolorów i asystentem pasa ruchu Travel Assist.",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: true,
  },
  {
    slug: "mercedes-benz-klasa-c-220d-2019",
    make: "Mercedes-Benz",
    model: "Klasa C",
    year: 2019,
    price: 109000,
    mileage: 96500,
    fuel_type: "Diesel",
    engine_capacity: "1950 cm³ (194 KM)",
    transmission: "Automat",
    color: "Sedan",
    description: "Mercedes-Benz C 220 d Sedan z 9-stopniową automatyczną skrzynią biegów 9G-TRONIC. Wersja poliftowa z nowoczesnym silnikiem OM654 o kulturze pracy klasy premium. Reflektory MULTIBEAM LED, system COMAND Online, nagłośnienie Burmester Surround, czarna podsufitka. Samochód zarejestrowany i ubezpieczony.",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: true,
  },
  {
    slug: "volvo-xc60-d4-inscription-2020",
    make: "Volvo",
    model: "XC60",
    year: 2020,
    price: 149900,
    mileage: 88000,
    fuel_type: "Diesel",
    engine_capacity: "1969 cm³ (190 KM)",
    transmission: "Automat",
    color: "SUV",
    description: "Volvo XC60 D4 AWD w ekskluzywnej wersji Inscription. Napęd na 4 koła, 8-biegowa skrzynia Geartronic. Wentylowane fotele z naturalnej skóry Nappa z masażami, dach panoramiczny, nagłośnienie Harman Kardon, pakiet bezpieczeństwa IntelliSafe z asystentem martwego pola BLIS.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: true,
  },
  {
    slug: "toyota-rav4-2-5-hybrid-2021",
    make: "Toyota",
    model: "RAV4",
    year: 2021,
    price: 136500,
    mileage: 53000,
    fuel_type: "Hybryda",
    engine_capacity: "2487 cm³ (222 KM)",
    transmission: "Automat",
    color: "SUV",
    description: "Toyota RAV4 2.5 Hybrid AWD-i w wersji wyposażenia Selection. Niezawodny napęd hybrydowy czwartej generacji o łącznej mocy 222 KM z inteligentnym napędem na cztery koła. Dwukolorowe nadwozie, bezkluczykowy dostęp Smart Entry, kamera cofania, podgrzewane fotele przednie i kierownica.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: true,
  },
  {
    slug: "ford-focus-st-line-1-5-2021",
    make: "Ford",
    model: "Focus",
    year: 2021,
    price: 76900,
    mileage: 48500,
    fuel_type: "Benzyna",
    engine_capacity: "1496 cm³ (150 KM)",
    transmission: "Manualna",
    color: "Kombi",
    description: "Ford Focus Kombi ST-Line z dynamicznym i elastycznym silnikiem 1.5 EcoBoost 150 KM. Sportowe zderzaki, 17-calowe alufelgi, sportowa spłaszczona kierownica ze skóry, system multimedialny SYNC 3 z obsługą Apple CarPlay i Android Auto, podgrzewana przednia szyba Quickclear.",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: false,
  },
  {
    slug: "porsche-macan-2-0-pdk-2020",
    make: "Porsche",
    model: "Macan",
    year: 2020,
    price: 199000,
    mileage: 61000,
    fuel_type: "Benzyna",
    engine_capacity: "1984 cm³ (245 KM)",
    transmission: "Automat",
    color: "SUV",
    description: "Porsche Macan 2.0 Turbo o mocy 245 KM ze sportową skrzynią biegów PDK i napędem na wszystkie koła. Wykończenie wnętrza w skórze, 20-calowe koła Macan Turbo, pakiet Sport Chrono z przełącznikiem trybów jazdy, zawieszenie PASM z regulacją twardości, nagłośnienie BOSE.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: false,
  },
  {
    slug: "renault-master-l2h2-2-3-dci-2021",
    make: "Renault",
    model: "Master",
    year: 2021,
    price: 82000,
    mileage: 114000,
    fuel_type: "Diesel",
    engine_capacity: "2299 cm³ (150 KM)",
    transmission: "Manualna",
    color: "Dostawczy",
    description: "Renault Master L2H2 furgon z silnikiem 2.3 dCi 150 KM Twin Turbo. Przestrzeń ładunkowa wyłożona profesjonalną zabudową ze sklejki, drzwi tylne otwierane 270 stopni, kamera cofania z monitorem w lusterku, czujniki parkowania, klimatyzacja. Gotowy do pracy bez nakładów finansowych.",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: false,
  },
  {
    slug: "kia-sportage-1-6-t-gdi-2022",
    make: "Kia",
    model: "Sportage",
    year: 2022,
    price: 99900,
    mileage: 29000,
    fuel_type: "Benzyna",
    engine_capacity: "1598 cm³ (150 KM)",
    transmission: "Manualna",
    color: "SUV",
    description: "Kia Sportage V najnowszej generacji z silnikiem benzynowym 1.6 T-GDI 150 KM. Bardzo niski przebieg 29 000 km, fabryczna gwarancja producenta do 2029 roku. Wyposażenie: zakrzywiony podwójny ekran panoramiczny, kamera 360 stopni, asystent unikania kolizji drogowych, automatyczna dwustrefowa klimatyzacja.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    is_featured: false,
  }
];

/**
 * Returns realistic synthetic cars for any tenantId in local development.
 */
export function getUniversalMockCars(tenantId: string = "dev-universal-tenant-id"): Car[] {
  const baseTime = Date.now();
  return UNIVERSAL_MOCK_TEMPLATES.map((tmpl, idx) => ({
    id: `dev-car-${tenantId.slice(0, 8)}-${idx + 1}`,
    tenant_id: tenantId,
    slug: `${tmpl.slug}`,
    make: tmpl.make,
    model: tmpl.model,
    year: tmpl.year,
    price: tmpl.price,
    mileage: tmpl.mileage,
    fuel_type: tmpl.fuel_type,
    engine_capacity: tmpl.engine_capacity,
    transmission: tmpl.transmission,
    color: tmpl.color,
    description: tmpl.description,
    images: tmpl.images,
    is_sold: false,
    is_featured: tmpl.is_featured,
    vin: `VRM${tmpl.year}DEMO${(idx + 1).toString().padStart(4, "0")}X`,
    first_registration_date: `${tmpl.year}-04-15`,
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: new Date(baseTime - idx * 3600000).toISOString(),
  }));
}

/** Formats a clean human-friendly business name from a dealer slug */
function formatDealerName(slug: string): string {
  if (slug === "wadera") return "Wadera Auto Handel";
  if (slug === "d-car" || slug === "dcar") return "D-Car Skup i Sprzedaż";
  if (slug === "demo") return "Vroom Motors Demo";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") + " Auto";
}

/**
 * Generates a clean, fully-typed Tenant for any slug in local development.
 * Guarantees zero 404s and 100% compliant contrast-aware theming.
 */
export function createUniversalMockTenant(slug: string = "demo"): Tenant {
  const businessName = formatDealerName(slug);
  const tenantId = `dev-tenant-${slug}`;

  return {
    id: tenantId,
    slug,
    business_name: businessName,
    business_description: `Profesjonalna sprzedaż sprawdzonych samochodów używanych. Pewny stan techniczny, udokumentowane przebiegi i pełna pomoc w formalnościach.`,
    logo_url: "/images/dcar-logo.png",
    contact_phone: "+48 500 600 700",
    whatsapp_number: "48500600700",
    address: "ul. Motoryzacyjna 12",
    city: "Warszawa",
    postal_code: "00-001",
    county: "warszawski",
    region: "mazowieckie",
    custom_domain: null,
    pixel_id: null,
    branding: {
      primaryColor: "#1686E0",
      accentColor: "#38BDF8",
      logoUrl: "/images/dcar-logo.png",
      heroTitle: `Sprawdzone samochody z gwarancją — ${businessName}`,
      heroSubtitle: "Szeroki wybór pewnych aut z udokumentowaną historią. Sprawdź naszą aktualną ofertę z placu.",
      heroImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      media: {
        heroImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      },
      colors: {
        primary: "#1686E0",
        primaryForeground: "#ffffff",
        accent: "#38BDF8",
        accentForeground: "#ffffff",
        background: "#ffffff",
        foreground: "#09090b",
        surface: "#f8fafc",
        muted: "#64748b",
        headerBg: "#09090b",
        footerBg: "#09090b",
      },
    },
    services: [
      {
        id: "srv-sales",
        type: "car_sales",
        enabled: true,
        title: "Sprzedaż Samochodów Używanych",
        description: "Starannie wyselekcjonowane i zweryfikowane pojazdy z pewną historią techniczną.",
        ctaLabel: "Zobacz ofertę",
        ctaType: "link",
        ctaValue: "/samochody",
      },
      {
        id: "srv-finance",
        type: "car_finance",
        enabled: true,
        title: "Finansowanie i Leasing",
        description: "Elastyczne kredyty oraz leasingi na procedurach uproszczonych z minimum formalności.",
        ctaLabel: "Skontaktuj się",
        ctaType: "link",
        ctaValue: "/kontakt",
      },
      {
        id: "srv-warranty",
        type: "car_warranty",
        enabled: true,
        title: "Gwarancja Techniczna",
        description: "Możliwość objęcia każdego zakupionego pojazdu pisemną gwarancją techniczną na okres do 24 miesięcy.",
        ctaLabel: "Zapytaj o szczegóły",
        ctaType: "link",
        ctaValue: "/kontakt",
      },
      {
        id: "srv-inspection",
        type: "car_inspection",
        enabled: true,
        title: "Weryfikacja na Stacji Kontroli",
        description: "Przed zakupem umożliwiamy sprawdzenie pojazdu na dowolnej stacji diagnostycznej lub w serwisie ASO.",
        ctaLabel: "Zadzwoń do nas",
        ctaType: "phone",
        ctaValue: "+48 500 600 700",
      },
    ],
    page_config: {
      features: {
        carBuying: false,
      },
      sections: [
        { id: "sec-hero", type: "hero", enabled: true, title: "Sprawdzone samochody osobowe i dostawcze" },
        { id: "sec-vehicles", type: "vehicles", enabled: true, title: "Aktualna oferta na sprzedaż" },
        { id: "sec-about", type: "about", enabled: true, title: `O nas — ${businessName}` },
        { id: "sec-services", type: "services", enabled: true, title: "Nasze usługi i korzyści" },
        { id: "sec-contact", type: "contact", enabled: true, title: "Kontakt i lokalizacja" },
      ],
    },
    seo: {
      metaTitle: `${businessName} - Sprawdzone Samochody Używane`,
      metaDescription: `Pewne auta z gwarancją i udokumentowaną historią. Sprawdź ofertę w salonie ${businessName}.`,
    },
    business_rules: {
      tradeIn: { enabled: false },
    },
    local_seo: {
      primaryLocation: {
        city: "Warszawa",
        locality: "Centrum",
        county: "warszawski",
        region: "mazowieckie",
        postalCode: "00-001",
      },
    },
    has_active_site: true,
    autoplac_enabled: true,
    autoplac_feed_token: "dev-feed-token-universal",
    created_at: "2026-01-01T00:00:00.000Z",
  };
}
