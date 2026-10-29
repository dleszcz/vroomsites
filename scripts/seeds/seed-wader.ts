import { Tenant, Car } from "@/types/database";

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
      headerBg: "#ffffff",
      footerBg: "#f8fafc",
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

export const WADER_CARS: Car[] = [
  {
    id: "car-wader-1",
    tenant_id: WADER_TENANT_ID,
    slug: "vw-t-roc-1-5-tsi-2019",
    make: "Volkswagen",
    model: "T-Roc",
    year: 2019,
    price: 39999,
    mileage: 77000,
    fuel_type: "Benzyna",
    engine_capacity: "1.5 TSI",
    transmission: "Automat",
    color: "Srebrny",
    description:
      "Volkswagen T-Roc 1.5 TSI z automatyczną skrzynią biegów. Niski, w pełni udokumentowany przebieg 77 000 km. Samochód w znakomitym stanie wizualnym i technicznym, zadbany, bezwypadkowy.",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: true,
    vin: "WVGZZZA1ZKV012345",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T01:00:00.000Z",
  },
  {
    id: "car-wader-2",
    tenant_id: WADER_TENANT_ID,
    slug: "mercedes-benz-cla-200-amg-line-2016",
    make: "Mercedes-Benz",
    model: "CLA",
    year: 2016,
    price: 41900,
    mileage: 91000,
    fuel_type: "Benzyna",
    engine_capacity: "2.0 Benzyna",
    transmission: "Automat",
    color: "Czarny",
    description:
      "Mercedes-Benz CLA (C117) w pakiecie AMG-Line. Przebieg 91 000 km, automatyczna skrzynia biegów 7G-DCT, sportowa stylistyka, reflektory LED i dynamiczne osiągi.",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: true,
    vin: "WDD1173431N234567",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T02:00:00.000Z",
  },
  {
    id: "car-wader-3",
    tenant_id: WADER_TENANT_ID,
    slug: "nissan-juke-1-2-dig-t-kamery-360-2014",
    make: "Nissan",
    model: "Juke",
    year: 2014,
    price: 22900,
    mileage: 123200,
    fuel_type: "Benzyna",
    engine_capacity: "1.2 DIG-T",
    transmission: "Manualna",
    color: "Biały",
    description:
      "Nissan Juke z dynamicznym i oszczędnym silnikiem 1.2 DIG-T. Bogate wyposażenie obejmujące kamery 360°, nawigację i klimatyzację automatyczną. Przebieg 123 200 km.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: false,
    vin: "SJNFBAF15U1345678",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T03:00:00.000Z",
  },
  {
    id: "car-wader-4",
    tenant_id: WADER_TENANT_ID,
    slug: "renault-master-l2h2-furgon-2021",
    make: "Renault",
    model: "Master",
    year: 2021,
    price: 49900,
    mileage: 163380,
    fuel_type: "Diesel",
    engine_capacity: "2.3 dCi",
    transmission: "Manualna",
    color: "Biały",
    description:
      "Renault Master L2H2 furgon z 2021 roku. Niski przebieg 163 380 km, kamera cofania, czujniki parkowania, klimatyzacja. Przestrzeń ładunkowa w nienagannym stanie, gotowy do pracy od zaraz.",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: true,
    vin: "VF1MA000067456789",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T04:00:00.000Z",
  },
  {
    id: "car-wader-5",
    tenant_id: WADER_TENANT_ID,
    slug: "renault-clio-iv-rs-200km-2014",
    make: "Renault",
    model: "Clio RS",
    year: 2014,
    price: 29999,
    mileage: 136139,
    fuel_type: "Benzyna",
    engine_capacity: "1.6 RS 200 KM",
    transmission: "Automat",
    color: "Żółty",
    description:
      "Wyjątkowy hot-hatch Renault Clio IV RS o mocy 200 KM ze sportową automatyczną skrzynią biegów EDC i łopatkami przy kierownicy. Dynamiczne przyspieszenie i znakomite prowadzenie.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: true,
    vin: "VF15R400E51567890",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T05:00:00.000Z",
  },
  {
    id: "car-wader-6",
    tenant_id: WADER_TENANT_ID,
    slug: "bmw-seria-1-e81-2-0-2007",
    make: "BMW",
    model: "Seria 1",
    year: 2007,
    price: 11900,
    mileage: 251000,
    fuel_type: "Benzyna",
    engine_capacity: "2.0 Benzyna",
    transmission: "Manualna",
    color: "Czarny",
    description:
      "BMW Seria 1 E81 z silnikiem benzynowym 2.0 (143 KM). Zadbany stan techniczny, czyste wnętrze, sprawna klimatyzacja, alufelgi i klasyczny napęd na tylną oś.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: false,
    vin: "WBAUB71030V678901",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T06:00:00.000Z",
  },
  {
    id: "car-wader-7",
    tenant_id: WADER_TENANT_ID,
    slug: "audi-q3-2-0-tfsi-quattro-2012",
    make: "Audi",
    model: "Q3",
    year: 2012,
    price: 42900,
    mileage: 39990,
    fuel_type: "Benzyna",
    engine_capacity: "2.0 TFSI",
    transmission: "Manualna",
    color: "Szary",
    description:
      "Kompaktowy SUV Audi Q3 z cenionym stałym napędem na cztery koła Quattro. Zdumiewająco niski, udokumentowany przebieg 39 990 km. Samochód bezwypadkowy, pedantycznie utrzymany.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: false,
    vin: "WAUZZZ8U4CR789012",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T07:00:00.000Z",
  },
  {
    id: "car-wader-8",
    tenant_id: WADER_TENANT_ID,
    slug: "ford-transit-mk8-9-osobowy-2020",
    make: "Ford",
    model: "Transit",
    year: 2020,
    price: 79999,
    mileage: 142600,
    fuel_type: "Diesel",
    engine_capacity: "2.0 EcoBlue",
    transmission: "Manualna",
    color: "Biały",
    description:
      "Ford Transit VIII MK8 w wersji 9-osobowej ze specjalistycznym najazdem. Rocznik 2020, silnik 2.0 EcoBlue, przebieg 142 600 km. Wzorowy stan techniczny, idealny dla transportu osób lub firmy.",
    images: [
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    ],
    is_sold: false,
    is_featured: true,
    vin: "WF0XXXTTGXLR89012",
    export_to_autoplac: true,
    autoplac_status: "ready",
    created_at: "2026-10-28T08:00:00.000Z",
  },
];
