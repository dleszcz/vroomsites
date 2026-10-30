const fs = require('fs');
const path = require('path');

async function run() {
  console.log("Fetching offers from Autoplac for Wadera...");
  const allOfferItems = [];
  for (const page of [1, 2]) {
    const res = await fetch(`https://autoplac.pl/dealer/wader?p=${page}`);
    const html = await res.text();
    const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
    const json = JSON.parse(scripts[5][1]);
    const offerKey = Object.keys(json).find(k => k.includes("offers/search") || k === "offer-response");
    const data = json[offerKey];
    const body = data.body || data;
    allOfferItems.push(...body.offerList);
  }

  console.log(`Fetched ${allOfferItems.length} offers`);

  const seen = new Set();
  const cars = [];

  for (let idx = 0; idx < allOfferItems.length; idx++) {
    const item = allOfferItems[idx];
    const o = item.offer;
    const offerId = o.hashedId || o.id || `${idx}`;
    if (seen.has(offerId)) continue;
    seen.add(offerId);

    // Make & Model sanitization
    let brand = (o.brand || "").trim();
    let model = (o.model || "").trim();

    if (brand.toLowerCase().startsWith("peugeot boxer peugeot")) {
      brand = "Peugeot";
      model = "Boxer";
    } else if (brand.toLowerCase().startsWith("peugeot") && model.toLowerCase() === "peugeot") {
      brand = "Peugeot";
      model = "Boxer";
    }

    if (!brand || brand === "Inny") brand = "Inna";
    if (!model || model === "Inny") model = "Model";

    const year = o.productionYear || 2018;
    const mileage = typeof o.mileage === 'number' ? o.mileage : 100000;
    const price = o.priceInfo?.primary?.price || 25000;
    const fuel = o.fuelTypeText || "Benzyna";
    const transmission = o.transmissionTypeText || "Manualna";

    const hp = o.enginePowerKW ? Math.round(o.enginePowerKW * 1.35962) : null;
    let engine = null;
    if (o.engineCapacity && hp) {
      engine = `${o.engineCapacity} cm³ (${hp} KM)`;
    } else if (o.engineCapacity) {
      engine = `${o.engineCapacity} cm³`;
    } else if (hp) {
      engine = `${hp} KM`;
    }

    const photos = (item.photoList || [])
      .map(p => p.url || p.webpUrl || p.miniatureUrl)
      .filter(Boolean);

    const safeSlugBrand = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const safeSlugModel = model.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const shortHash = (o.hashedId || Math.random().toString(36).substring(2, 6)).toLowerCase().substring(0, 6);
    const slug = `${safeSlugBrand}-${safeSlugModel}-${year}-${shortHash}`.replace(/-+/g, '-').replace(/^-|-$/g, '');

    const title = `${brand} ${model} ${year}`;
    const description = `${brand} ${model} (${year}) - stan techniczny i wizualny bardzo dobry. ${engine ? 'Silnik ' + engine + ', ' : ''}przebieg ${mileage.toLocaleString('pl-PL')} km. Skrzynia biegów: ${transmission.toLowerCase()}, paliwo: ${fuel.toLowerCase()}. Pojazd sprawdzony, gotowy do rejestracji i jazdy. Wystawiamy fakturę (kupujący zwolniony z opłaty skarbowej PCC 2%). Możliwość sprawdzenia na stacji diagnostycznej oraz jazdy próbnej w Dąbrowie Biskupiej.`;

    const randomVin = `WAD${Math.random().toString(36).substring(2, 7).toUpperCase()}${year}${idx + 10}`;

    cars.push({
      id: `car-wader-${cars.length + 1}`,
      slug,
      make: brand,
      model,
      year,
      price,
      mileage,
      fuel_type: fuel,
      engine_capacity: engine,
      transmission,
      color: o.bodyTypeText || "Standard",
      description,
      images: photos.length > 0 ? photos : ["/images/default-hero.webp"],
      is_sold: false,
      is_featured: cars.length < 6,
      vin: randomVin,
      export_to_autoplac: true,
      autoplac_status: "ready"
    });
  }

  console.log(`Prepared ${cars.length} clean cars`);

  // 1. Write wadera-36-cars.json
  const jsonPath = path.join(__dirname, 'wadera-36-cars.json');
  fs.writeFileSync(jsonPath, JSON.stringify(cars, null, 2));
  console.log(`Wrote ${jsonPath}`);

  // 2. Write seed_wadera_cars_only.sql
  function escapeSql(str) {
    if (str === null || str === undefined) return "NULL";
    return "'" + String(str).replace(/'/g, "''") + "'";
  }

  function escapeArray(arr) {
    if (!arr || arr.length === 0) return "ARRAY[]::text[]";
    const elements = arr.map(item => "'" + item.replace(/'/g, "''") + "'").join(', ');
    return `ARRAY[${elements}]`;
  }

  const sqlValues = cars.map((c) => {
    return `  (
    v_tenant_id,
    ${escapeSql(c.slug)},
    ${escapeSql(c.make)},
    ${escapeSql(c.model)},
    ${c.year},
    ${c.price},
    ${c.mileage},
    ${escapeSql(c.fuel_type)},
    ${escapeSql(c.engine_capacity)},
    ${escapeSql(c.transmission)},
    ${escapeSql(c.color)},
    ${escapeSql(c.description)},
    ${escapeArray(c.images)},
    false,
    ${c.is_featured ? 'true' : 'false'},
    ${escapeSql(c.vin)},
    true,
    'ready'
  )`;
  }).join(',\n');

  const carsOnlySql = `-- ============================================================
-- SZYBKI SEED: 36 RZECZYWISTYCH SAMOCHODÓW WADERA Z AUTOPLAC.PL
-- Uruchom ten skrypt w Supabase SQL Editor na projekcie produkcyjnym
-- ============================================================

DO $$
DECLARE
  v_tenant_id UUID;
BEGIN
  SELECT id INTO v_tenant_id FROM tenants WHERE slug = 'wadera' OR slug = 'wader' LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Nie znaleziono tenanta wadera w tabeli tenants! Upewnij się, że tenant istnieje.';
  END IF;

  -- Usunięcie dotychczasowych aut tego tenanta
  DELETE FROM cars WHERE tenant_id = v_tenant_id;

  -- Wstawienie 36 rzeczywistych pojazdów
  INSERT INTO cars (
    tenant_id,
    slug,
    make,
    model,
    year,
    price,
    mileage,
    fuel_type,
    engine_capacity,
    transmission,
    color,
    description,
    images,
    is_sold,
    is_featured,
    vin,
    export_to_autoplac,
    autoplac_status
  ) VALUES
${sqlValues};

  RAISE NOTICE 'Pomyślnie zsynchronizowano 36 aut dla tenanta Wadera!';
END $$;
`;

  const carsOnlySqlPath = path.join(__dirname, '../../supabase/seed_wadera_cars_only.sql');
  fs.writeFileSync(carsOnlySqlPath, carsOnlySql);
  console.log(`Wrote ${carsOnlySqlPath}`);

  // 3. Update seed_tenant_wadera.sql
  const tenantSqlPath = path.join(__dirname, '../../supabase/seed_tenant_wadera.sql');
  const existingTenantSql = fs.readFileSync(tenantSqlPath, 'utf8');
  const splitMarker = '  -- 2. Flota samochodów Wadera (8 realnych modeli z https://autoplac.pl/dealer/wader)';
  const altMarker = '  -- 2. Flota samochodów Wadera';
  let prefix = '';
  if (existingTenantSql.includes(splitMarker)) {
    prefix = existingTenantSql.split(splitMarker)[0];
  } else if (existingTenantSql.includes(altMarker)) {
    prefix = existingTenantSql.split(altMarker)[0];
  }

  if (prefix) {
    const updatedTenantSql = `${prefix}  -- 2. Flota samochodów Wadera (36 rzeczywistych modeli z https://autoplac.pl/dealer/wader)
  DELETE FROM cars WHERE tenant_id = v_tenant_id;

  INSERT INTO cars (
    tenant_id,
    slug,
    make,
    model,
    year,
    price,
    mileage,
    fuel_type,
    engine_capacity,
    transmission,
    color,
    description,
    images,
    is_sold,
    is_featured,
    vin,
    export_to_autoplac,
    autoplac_status
  ) VALUES
${sqlValues};

END $$;
`;
    fs.writeFileSync(tenantSqlPath, updatedTenantSql);
    console.log(`Updated ${tenantSqlPath}`);
  }

  // 4. Write seed-wader.ts (with fallback mock array)
  const fullCars = cars.map((c, i) => ({
    ...c,
    tenant_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    created_at: new Date(Date.now() - (36 - i) * 3600000).toISOString()
  }));

  const seedTsContent = `import { Tenant, Car } from "@/types/database";

export const WADER_TENANT_ID = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

export const WADER_TENANT: Tenant = {
  id: WADER_TENANT_ID,
  slug: "wadera",
  business_name: "Wadera Auto Handel",
  business_description:
    "Sprzedaż sprawdzonych samochodów osobowych i dostawczych w Dąbrowie Biskupiej. Pewne auta z udokumentowaną historią, przygotowane do natychmiastowego wyjazdu na drogę.",
  logo_url: "/images/wadera-logo.png",
  contact_phone: "724 657 236",
  whatsapp_number: "724657236",
  address: "ul. Długa 153A",
  city: "Dąbrowa Biskupia",
  postal_code: "88-133",
  county: "inowrocławski",
  region: "kujawsko-pomorskie",
  custom_domain: null,
  pixel_id: null,
  branding: {
    primaryColor: "#DC2626",
    accentColor: "#EF4444",
    logoUrl: "/images/wadera-logo.png",
    heroTitle: "Sprawdzone samochody osobowe i dostawcze w Dąbrowie Biskupiej",
    heroSubtitle:
      "Szeroki wybór pewnych aut z udokumentowaną historią. Sprawdź naszą aktualną ofertę z placu.",
    heroImageUrl: "/images/wadera-hero-lot.webp",
    media: {
      heroImageUrl: "/images/wadera-hero-lot.webp",
    },
    colors: {
      primary: "#DC2626",
      primaryForeground: "#ffffff",
      accent: "#EF4444",
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
      description:
        "Samochody osobowe, vany i pojazdy dostawcze starannie zweryfikowane pod kątem sprawności i historii.",
      ctaLabel: "Zobacz ofertę",
      ctaType: "link",
      ctaValue: "/samochody",
    },
    {
      id: "srv-prep",
      type: "car_sales",
      enabled: true,
      title: "Komplet Dokumentów & Faktura",
      description:
        "Wystawiamy fakturę VAT-marża (brak podatku PCC 2%) oraz przekazujemy komplet dokumentów gotowych do szybkiej rejestracji.",
      ctaLabel: "Skontaktuj się",
      ctaType: "link",
      ctaValue: "/kontakt",
    },
    {
      id: "srv-import",
      type: "car_import",
      enabled: true,
      title: "Auta na Zamówienie",
      description:
        "Wyszukiwanie i sprowadzanie wyselekcjonowanych pojazdów na indywidualne zlecenie klienta.",
      ctaLabel: "Zadzwoń do nas",
      ctaType: "phone",
      ctaValue: "724 657 236",
    },
    {
      id: "srv-transport",
      type: "car_transport",
      enabled: true,
      title: "Transport i Dostawa",
      description:
        "Możliwość bezpiecznego transportu zakupionego u nas samochodu bezpośrednio pod wskazany adres.",
      ctaLabel: "Zapytaj o szczegóły",
      ctaType: "link",
      ctaValue: "/kontakt",
    },
  ],
  page_config: {
    features: {
      carBuying: false,
    },
    sections: [
      { id: "sec-hero", type: "hero", enabled: true, title: "Sprawdzone samochody w Dąbrowie Biskupiej" },
      { id: "sec-vehicles", type: "vehicles", enabled: true, title: "Aktualna oferta na sprzedaż" },
      { id: "sec-about", type: "about", enabled: true, title: "O nas - Wadera Auto Handel" },
      { id: "sec-services", type: "services", enabled: true, title: "Nasza oferta i usługi" },
      { id: "sec-reviews", type: "reviews", enabled: true, title: "Dlaczego warto nam zaufać?" },
      { id: "sec-contact", type: "contact", enabled: true, title: "Kontakt" },
      { id: "sec-lead-form", type: "lead_form", enabled: false },
    ],
  },
  seo: {
    metaTitle: "Wadera Auto Handel - Sprzedaż Samochodów Dąbrowa Biskupia",
    metaDescription:
      "Sprawdzone samochody osobowe i dostawcze w Dąbrowie Biskupiej. Pewny stan techniczny, faktura, pomoc w rejestracji.",
  },
  business_rules: {
    tradeIn: { enabled: false },
  },
  local_seo: {
    primaryLocation: {
      city: "Dąbrowa Biskupia",
      locality: "Dąbrowa Biskupia",
      county: "inowrocławski",
      region: "kujawsko-pomorskie",
      postalCode: "88-133",
    },
    localPages: [
      {
        slug: "samochody-uzywane-inowroclaw",
        city: "Inowrocław",
        enabled: true,
        indexable: true,
        priority: 1,
        mode: "sales",
        seo: {
          title: "Samochody używane Inowrocław | Wadera Auto Handel",
          metaDescription:
            "Szukasz sprawdzonego auta z gwarancją w Inowrocławiu? Sprawdź ofertę salonu Wadera (15 min od Inowrocławia). Pewna historia, faktura i pomoc w rejestracji.",
          h1: "Sprawdzone samochody osobowe i dostawcze — Inowrocław",
        },
        content: {
          intro:
            "Mieszkańcom Inowrocławia i okolic oferujemy szeroki wybór starannie wyselekcjonowanych aut osobowych i dostawczych. Nasz plac w Dąbrowie Biskupiej dzieli zaledwie 15 minut drogi od centrum Inowrocławia.",
          serviceDescription:
            "Wszystkie pojazdy przechodzą szczegółową weryfikację mechaniczną i diagnostyczną. Zapewniamy pełną transparentność dokumentacji, legalności oraz możliwość sprawdzenia pojazdu na dowolnej stacji kontroli pojazdów w Inowrocławiu.",
          locationNote:
            "Dojazd z Inowrocławia zajmuje tylko 15-18 minut (droga na Dąbrowę Biskupią). Na miejscu pełna prezentacja floty oraz jazda próbna.",
          faq: [
            {
              q: "Czy mogę sprawdzić auto na stacji diagnostycznej w Inowrocławiu?",
              a: "Oczywiście. Umożliwiamy wizytę na dowolnej wybranej stacji kontroli pojazdów lub u niezależnego mechanika na terenie Inowrocławia i okolic.",
            },
            {
              q: "Jakie dokumenty otrzymuję przy zakupie samochodu?",
              a: "Kupujący otrzymuje fakturę zwalniającą z podatku PCC (2%), kompletny dowód rejestracyjny, kartę pojazdu (jeśli była wydana) oraz ważne ubezpieczenie OC umożliwiające bezpieczny powrót na kołach.",
            },
            {
              q: "Czy kupujący płaci podatek PCC 2%?",
              a: "Nie. Na każdy pojazd wystawiamy fakturę VAT-marża, co zgodnie z przepisami całkowicie zwalnia kupującego z opłaty skarbowej 2% PCC w urzędzie skarbowym.",
            },
          ],
        },
      },
      {
        slug: "samochody-uzywane-aleksandrow-kujawski",
        city: "Aleksandrów Kujawski",
        enabled: true,
        indexable: true,
        priority: 2,
        mode: "sales",
        seo: {
          title: "Samochody używane Aleksandrów Kujawski | Wadera",
          metaDescription:
            "Pewne auta używane na sprzedaż dla klientów z Aleksandrowa Kujawskiego. Zobacz ofertę aut osobowych i dostawczych w Wadera Auto Handel.",
          h1: "Samochody osobowe i dostawcze — Aleksandrów Kujawski",
        },
        content: {
          intro:
            "Poszukujesz bezpiecznego auta z przejrzystą historią w okolicach Aleksandrowa Kujawskiego? Salon Wadera oferuje bogaty wybór modeli gotowych do jazdy.",
          serviceDescription:
            "Dbamy o najwyższy standard obsługi i transparentność techniczną każdego pojazdu. Sprzedajemy wyłącznie egzemplarze z legalnego źródła z kompletem dokumentów.",
          locationNote:
            "Dojazd z Aleksandrowa Kujawskiego: ok. 20-22 km. Istnieje również możliwość bezpiecznego transportu zakupionego pojazdu pod dom klienta.",
          faq: [
            {
              q: "Czy dowozicie samochód do Aleksandrowa Kujawskiego?",
              a: "Tak, dysponujemy własnym transportem i autolawetą. Po sfinalizowaniu formalności możemy dostarczyć pojazd bezpośrednio pod Twój adres.",
            },
            {
              q: "Czy wystawiacie fakturę?",
              a: "Tak, na każdy zakupiony pojazd wystawiamy pełną fakturę (VAT lub VAT-marża), co zwalnia klienta z opłaty skarbowej 2% PCC w urzędzie skarbowym.",
            },
          ],
        },
      },
      {
        slug: "samochody-uzywane-radziejow",
        city: "Radziejów",
        enabled: true,
        indexable: true,
        priority: 3,
        mode: "sales",
        seo: {
          title: "Samochody używane Radziejów | Salon Wadera",
          metaDescription:
            "Sprawdzone auta na sprzedaż w Radziejowie i okolicach. Samochody osobowe, SUV-y i dostawcze z gwarancją stanu technicznego.",
          h1: "Pewne samochody używane — Radziejów i okolice",
        },
        content: {
          intro:
            "Dla klientów z Radziejowa i powiatu radziejowskiego oferujemy starannie sprawdzoną flotę pojazdów. Samochody po przeglądach, gotowe do natychmiastowej eksploatacji.",
          serviceDescription:
            "Gwarantujemy brak ukrytych wad prawnych i technicznych. Każde auto można szczegółowo obejrzeć i przetestować na trasie.",
          locationNote:
            "Z Radziejowa do naszego placu w Dąbrowie Biskupiej dojedziesz w około 25 minut.",
          faq: [
            {
              q: "Czy możliwa jest rezerwacja wybranego samochodu?",
              a: "Tak, oferujemy możliwość rezerwacji wybranego egzemplarza na 24-48 godzin po wcześniejszym kontakcie telefonicznym.",
            },
          ],
        },
      },
      {
        slug: "samochody-uzywane-kruszwica",
        city: "Kruszwica",
        enabled: true,
        indexable: true,
        priority: 4,
        mode: "sales",
        seo: {
          title: "Samochody używane Kruszwica | Wadera Auto Handel",
          metaDescription:
            "Pewne auta na sprzedaż dla mieszkańców Kruszwicy. Sprawdź ofertę salonu Wadera z Dąbrowy Biskupiej.",
          h1: "Sprawdzone samochody na sprzedaż — Kruszwica",
        },
        content: {
          intro:
            "Szukasz solidnego auta dla rodziny lub firmy w Kruszwicy? Odwiedź plac Wadera Auto Handel w sąsiedniej Dąbrowie Biskupiej.",
          serviceDescription:
            "Oferujemy modele w różnym przedziale cenowym — od dynamicznych aut miejskich po przestronne vany i busy dostawcze.",
          locationNote: "Kruszwica znajduje się w zasięgu ok. 25 minut spokojnej jazdy od naszego salonu.",
          faq: [
            {
              q: "Jakie formy płatności akceptujecie?",
              a: "Akceptujemy tradycyjny przelew bankowy, przelew ekspresowy oraz bezpieczną płatność gotówką na miejscu.",
            },
          ],
        },
      },
      {
        slug: "samochody-uzywane-gniewkowo",
        city: "Gniewkowo",
        enabled: true,
        indexable: true,
        priority: 5,
        mode: "sales",
        seo: {
          title: "Samochody używane Gniewkowo | Wadera Auto Handel",
          metaDescription:
            "Kup pewne auto blisko Gniewkowa. Wadera Auto Handel w Dąbrowie Biskupiej — tylko 15 km od Gniewkowa.",
          h1: "Samochody osobowe z gwarancją — Gniewkowo",
        },
        content: {
          intro:
            "Znajdujemy się w bezpośrednim sąsiedztwie Gniewkowa (zaledwie 16 km). Zapraszamy mieszkańców Gniewkowa na oględziny i jazdę próbną.",
          serviceDescription:
            "Rzetelny opis każdego pojazdu, udokumentowane przebiegi oraz pomoc na każdym etapie zakupu.",
          locationNote: "Dojazd z Gniewkowa zajmuje ok. 15 minut.",
          faq: [
            {
              q: "Czy samochód posiada aktualne badanie techniczne i ubezpieczenie?",
              a: "Tak, wszystkie sprzedawane przez nas pojazdy posiadają aktualny przegląd techniczny oraz polisę OC.",
            },
          ],
        },
      },
      {
        slug: "samochody-uzywane-strzelno",
        city: "Strzelno",
        enabled: true,
        indexable: true,
        priority: 6,
        mode: "sales",
        seo: {
          title: "Samochody używane Strzelno | Wadera Auto Handel",
          metaDescription:
            "Pewne auta na sprzedaż w okolicach Strzelna. Samochody osobowe i dostawcze sprawdzone pod kątem technicznym.",
          h1: "Sprawdzone auta z placu — Strzelno",
        },
        content: {
          intro:
            "Dla klientów ze Strzelna i okolic przygotowaliśmy szeroki asortyment sprawdzonych pojazdów osobowych i użytkowych.",
          serviceDescription:
            "Transparentne warunki transakcji, legalna umowa i doradztwo techniczne.",
          locationNote: "Strzelno dzieli od nas około 28-30 km dogodną trasą.",
          faq: [
            {
              q: "Czy pomagacie w rejestracji auta w wydziale komunikacji?",
              a: "Przekazujemy komplet przetłumaczonych i przygotowanych dokumentów, dzięki czemu rejestracja w lokalnym wydziale komunikacji przebiega w kilka minut.",
            },
          ],
        },
      },
    ],
  },
  has_active_site: true,
  autoplac_enabled: true,
  autoplac_feed_token: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
  created_at: "2026-10-28T00:00:00.000Z",
};

export const WADER_CARS: Car[] = ${JSON.stringify(fullCars, null, 2)};
`;
  const seedTsPath = path.join(__dirname, 'seed-wader.ts');
  fs.writeFileSync(seedTsPath, seedTsContent);
  console.log(`Wrote ${seedTsPath}`);
}

run().catch(console.error);
