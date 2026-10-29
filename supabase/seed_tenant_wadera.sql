-- ==============================================================================
-- Vroom Ecosystem — Seed dla tenanta "Wadera Auto Handel" (Dąbrowa Biskupia)
-- Slug: wadera
-- Profil: Sprzedaż aut osobowych i dostawczych (BEZ modułu skupu aut)
-- ==============================================================================

DO $$
DECLARE
  v_tenant_id UUID := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
BEGIN
  -- 1. Wstawienie lub aktualizacja tenanta WADERA
  INSERT INTO tenants (
    id,
    slug,
    business_name,
    business_description,
    logo_url,
    contact_phone,
    whatsapp_number,
    address,
    city,
    postal_code,
    county,
    region,
    branding,
    services,
    page_config,
    seo,
    local_seo,
    business_rules,
    autoplac_enabled,
    autoplac_feed_token
  ) VALUES (
    v_tenant_id,
    'wadera',
    'Wadera Auto Handel',
    'Sprzedaż sprawdzonych samochodów osobowych i dostawczych w Dąbrowie Biskupiej. Pewne auta z udokumentowaną historią, przygotowane do natychmiastowego wyjazdu na drogę.',
    '/images/wadera-logo.webp',
    '724 657 236',
    '724657236',
    'ul. Długa 153A',
    'Dąbrowa Biskupia',
    '88-133',
    'inowrocławski',
    'kujawsko-pomorskie',
    jsonb_build_object(
      'primaryColor', '#DC2626',
      'accentColor', '#EF4444',
      'logoUrl', '/images/wadera-logo.webp',
      'heroTitle', 'Sprawdzone samochody osobowe i dostawcze w Dąbrowie Biskupiej',
      'heroSubtitle', 'Szeroki wybór pewnych aut z udokumentowaną historią. Sprawdź naszą aktualną ofertę z placu.',
      'heroImageUrl', '/images/wadera-hero-lot.webp',
      'media', jsonb_build_object(
        'heroImageUrl', '/images/wadera-hero-lot.webp'
      ),
      'colors', jsonb_build_object(
        'primary', '#DC2626',
        'primaryForeground', '#ffffff',
        'accent', '#EF4444',
        'accentForeground', '#ffffff',
        'background', '#ffffff',
        'foreground', '#09090b',
        'surface', '#f8fafc',
        'muted', '#64748b',
        'headerBg', '#ffffff',
        'footerBg', '#f8fafc'
      )
    ),
    jsonb_build_array(
      jsonb_build_object(
        'id', 'srv-sales',
        'type', 'car_sales',
        'enabled', true,
        'title', 'Sprzedaż Samochodów Używanych',
        'description', 'Samochody osobowe, vany i pojazdy dostawcze starannie zweryfikowane pod kątem sprawności i historii.',
        'ctaLabel', 'Zobacz ofertę',
        'ctaType', 'link',
        'ctaValue', '/samochody'
      ),
      jsonb_build_object(
        'id', 'srv-invoice',
        'type', 'warranty',
        'enabled', true,
        'title', 'Faktura VAT-marża i brak PCC',
        'description', 'Kupujący jest ustawowo zwolniony z opłaty skarbowej 2% PCC. Pełne bezpieczeństwo prawne i legalność transakcji.',
        'ctaLabel', 'Dowiedz się więcej',
        'ctaType', 'link',
        'ctaValue', '/kontakt'
      ),
      jsonb_build_object(
        'id', 'srv-import',
        'type', 'car_import',
        'enabled', true,
        'title', 'Auta na Zamówienie',
        'description', 'Wyszukiwanie i sprowadzanie wyselekcjonowanych pojazdów na indywidualne zlecenie klienta.',
        'ctaLabel', 'Zadzwoń do nas',
        'ctaType', 'phone',
        'ctaValue', '724 657 236'
      ),
      jsonb_build_object(
        'id', 'srv-transport',
        'type', 'car_transport',
        'enabled', true,
        'title', 'Transport i Dostawa',
        'description', 'Możliwość bezpiecznego transportu zakupionego u nas samochodu bezpośrednio pod wskazany adres.',
        'ctaLabel', 'Zapytaj o szczegóły',
        'ctaType', 'link',
        'ctaValue', '/kontakt'
      )
    ),
    jsonb_build_object(
      'features', jsonb_build_object(
        'carBuying', false
      ),
      'sections', jsonb_build_array(
        jsonb_build_object('id', 'sec-hero', 'type', 'hero', 'enabled', true, 'title', 'Sprawdzone samochody w Dąbrowie Biskupiej'),
        jsonb_build_object('id', 'sec-vehicles', 'type', 'vehicles', 'enabled', true, 'title', 'Aktualna oferta na sprzedaż'),
        jsonb_build_object('id', 'sec-about', 'type', 'about', 'enabled', true, 'title', 'O nas - Wadera Auto Handel'),
        jsonb_build_object('id', 'sec-services', 'type', 'services', 'enabled', true, 'title', 'Nasza oferta i usługi'),
        jsonb_build_object('id', 'sec-reviews', 'type', 'reviews', 'enabled', true, 'title', 'Dlaczego warto nam zaufać?'),
        jsonb_build_object('id', 'sec-contact', 'type', 'contact', 'enabled', true, 'title', 'Kontakt'),
        jsonb_build_object('id', 'sec-lead-form', 'type', 'lead_form', 'enabled', false)
      )
    ),
    jsonb_build_object(
      'metaTitle', 'Wadera Auto Handel - Sprzedaż Samochodów Dąbrowa Biskupia',
      'metaDescription', 'Sprawdzone samochody osobowe i dostawcze w Dąbrowie Biskupiej. Pewny stan techniczny, faktura, pomoc w rejestracji.'
    ),
    jsonb_build_object(
      'primaryLocation', jsonb_build_object(
        'city', 'Dąbrowa Biskupia',
        'locality', 'Dąbrowa Biskupia',
        'county', 'inowrocławski',
        'region', 'kujawsko-pomorskie',
        'postalCode', '88-133'
      ),
      'localPages', jsonb_build_array(
        jsonb_build_object(
          'slug', 'samochody-uzywane-inowroclaw',
          'city', 'Inowrocław',
          'enabled', true,
          'indexable', true,
          'priority', 1,
          'mode', 'sales',
          'seo', jsonb_build_object(
            'title', 'Samochody używane Inowrocław | Wadera Auto Handel',
            'metaDescription', 'Szukasz sprawdzonego auta z gwarancją w Inowrocławiu? Sprawdź ofertę salonu Wadera (15 min od Inowrocławia).',
            'h1', 'Sprawdzone samochody osobowe i dostawcze — Inowrocław'
          )
        ),
        jsonb_build_object(
          'slug', 'samochody-uzywane-aleksandrow-kujawski',
          'city', 'Aleksandrów Kujawski',
          'enabled', true,
          'indexable', true,
          'priority', 2,
          'mode', 'sales',
          'seo', jsonb_build_object(
            'title', 'Samochody używane Aleksandrów Kujawski | Wadera',
            'metaDescription', 'Pewne auta używane na sprzedaż dla klientów z Aleksandrowa Kujawskiego. Zobacz ofertę aut osobowych i dostawczych.',
            'h1', 'Samochody osobowe i dostawcze — Aleksandrów Kujawski'
          )
        ),
        jsonb_build_object(
          'slug', 'samochody-uzywane-radziejow',
          'city', 'Radziejów',
          'enabled', true,
          'indexable', true,
          'priority', 3,
          'mode', 'sales',
          'seo', jsonb_build_object(
            'title', 'Samochody używane Radziejów | Salon Wadera',
            'metaDescription', 'Sprawdzone auta na sprzedaż w Radziejowie i okolicach. Samochody osobowe, SUV-y i dostawcze z gwarancją stanu technicznego.',
            'h1', 'Pewne samochody używane — Radziejów i okolice'
          )
        ),
        jsonb_build_object(
          'slug', 'samochody-uzywane-kruszwica',
          'city', 'Kruszwica',
          'enabled', true,
          'indexable', true,
          'priority', 4,
          'mode', 'sales',
          'seo', jsonb_build_object(
            'title', 'Samochody używane Kruszwica | Wadera Auto Handel',
            'metaDescription', 'Pewne auta na sprzedaż dla mieszkańców Kruszwicy. Sprawdź ofertę salonu Wadera z Dąbrowy Biskupiej.',
            'h1', 'Sprawdzone samochody na sprzedaż — Kruszwica'
          )
        ),
        jsonb_build_object(
          'slug', 'samochody-uzywane-gniewkowo',
          'city', 'Gniewkowo',
          'enabled', true,
          'indexable', true,
          'priority', 5,
          'mode', 'sales',
          'seo', jsonb_build_object(
            'title', 'Samochody używane Gniewkowo | Wadera Auto Handel',
            'metaDescription', 'Kup pewne auto blisko Gniewkowa. Wadera Auto Handel w Dąbrowie Biskupiej — tylko 15 km od Gniewkowa.',
            'h1', 'Samochody osobowe z gwarancją — Gniewkowo'
          )
        ),
        jsonb_build_object(
          'slug', 'samochody-uzywane-strzelno',
          'city', 'Strzelno',
          'enabled', true,
          'indexable', true,
          'priority', 6,
          'mode', 'sales',
          'seo', jsonb_build_object(
            'title', 'Samochody używane Strzelno | Wadera Auto Handel',
            'metaDescription', 'Pewne auta na sprzedaż w okolicach Strzelna. Samochody osobowe i dostawcze sprawdzone pod kątem technicznym.',
            'h1', 'Sprawdzone auta z placu — Strzelno'
          )
        )
      )
    ),
    jsonb_build_object(
      'tradeIn', jsonb_build_object('enabled', false)
    ),
    true,
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
  )
  ON CONFLICT (slug) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    business_description = EXCLUDED.business_description,
    logo_url = EXCLUDED.logo_url,
    contact_phone = EXCLUDED.contact_phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    branding = EXCLUDED.branding,
    services = EXCLUDED.services,
    page_config = EXCLUDED.page_config,
    seo = EXCLUDED.seo,
    local_seo = EXCLUDED.local_seo,
    business_rules = EXCLUDED.business_rules;

  -- 2. Flota samochodów Wadera (8 realnych modeli z https://autoplac.pl/dealer/wader)
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
  (
    v_tenant_id,
    'vw-t-roc-1-5-tsi-2019',
    'Volkswagen',
    'T-Roc',
    2019,
    39999,
    77000,
    'Benzyna',
    '1.5 TSI',
    'Automat',
    'Srebrny',
    'Volkswagen T-Roc 1.5 TSI z automatyczną skrzynią biegów. Niski, w pełni udokumentowany przebieg 77 000 km. Samochód w znakomitym stanie wizualnym i technicznym, zadbany, bezwypadkowy.',
    ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'WVGZZZA1ZKV012345',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'mercedes-benz-cla-200-amg-line-2016',
    'Mercedes-Benz',
    'CLA',
    2016,
    41900,
    91000,
    'Benzyna',
    '2.0 Benzyna',
    'Automat',
    'Czarny',
    'Mercedes-Benz CLA (C117) w pakiecie AMG-Line. Przebieg 91 000 km, automatyczna skrzynia biegów 7G-DCT, sportowa stylistyka, reflektory LED i dynamiczne osiągi.',
    ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'WDD1173431N234567',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'nissan-juke-1-2-dig-t-kamery-360-2014',
    'Nissan',
    'Juke',
    2014,
    22900,
    123200,
    'Benzyna',
    '1.2 DIG-T',
    'Manualna',
    'Biały',
    'Nissan Juke z dynamicznym i oszczędnym silnikiem 1.2 DIG-T. Bogate wyposażenie obejmujące kamery 360°, nawigację i klimatyzację automatyczną. Przebieg 123 200 km.',
    ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'SJNFBAF15U1345678',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'renault-master-l2h2-furgon-2021',
    'Renault',
    'Master',
    2021,
    49900,
    163380,
    'Diesel',
    '2.3 dCi',
    'Manualna',
    'Biały',
    'Renault Master L2H2 furgon z 2021 roku. Niski przebieg 163 380 km, kamera cofania, czujniki parkowania, klimatyzacja. Przestrzeń ładunkowa w nienagannym stanie, gotowy do pracy od zaraz.',
    ARRAY['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VF1MA000067456789',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'renault-clio-iv-rs-200km-2014',
    'Renault',
    'Clio RS',
    2014,
    29999,
    136139,
    'Benzyna',
    '1.6 RS 200 KM',
    'Automat',
    'Żółty',
    'Wyjątkowy hot-hatch Renault Clio IV RS o mocy 200 KM ze sportową automatyczną skrzynią biegów EDC i łopatkami przy kierownicy. Dynamiczne przyspieszenie i znakomite prowadzenie.',
    ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VF15R400E51567890',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'bmw-seria-1-e81-2-0-2007',
    'BMW',
    'Seria 1',
    2007,
    11900,
    251000,
    'Benzyna',
    '2.0 Benzyna',
    'Manualna',
    'Czarny',
    'BMW Seria 1 E81 z silnikiem benzynowym 2.0 (143 KM). Zadbany stan techniczny, czyste wnętrze, sprawna klimatyzacja, alufelgi i klasyczny napęd na tylną oś.',
    ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'WBAUB71030V678901',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'audi-q3-2-0-tfsi-quattro-2012',
    'Audi',
    'Q3',
    2012,
    42900,
    39990,
    'Benzyna',
    '2.0 TFSI',
    'Manualna',
    'Szary',
    'Kompaktowy SUV Audi Q3 z cenionym stałym napędem na cztery koła Quattro. Zdumiewająco niski, udokumentowany przebieg 39 990 km. Samochód bezwypadkowy, pedantycznie utrzymany.',
    ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'WAUZZZ8U4CR789012',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'ford-transit-mk8-9-osobowy-2020',
    'Ford',
    'Transit',
    2020,
    79999,
    142600,
    'Diesel',
    '2.0 EcoBlue',
    'Manualna',
    'Biały',
    'Ford Transit VIII MK8 w wersji 9-osobowej ze specjalistycznym najazdem. Rocznik 2020, silnik 2.0 EcoBlue, przebieg 142 600 km. Wzorowy stan techniczny, idealny dla transportu osób lub firmy.',
    ARRAY['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'WF0XXXTTGXLR89012',
    true,
    'ready'
  );

END $$;

