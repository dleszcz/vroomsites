-- ============================================================
-- UNIWERSALNY SEED DEMO: 10 SYNTETYCZNYCH AUT DLA ŚRODOWISKA LOKALNEGO
-- Uruchom ten skrypt w Supabase SQL Editor na lokalnej/testowej bazie
-- ============================================================

DO $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- 1. Utworzenie lub pobranie uniwersalnego tenanta demo
  SELECT id INTO v_tenant_id FROM tenants WHERE slug = 'demo' LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    INSERT INTO tenants (
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
      business_rules,
      has_active_site,
      autoplac_enabled
    ) VALUES (
      'demo',
      'Vroom Motors Demo',
      'Wzorcowy salon sprzedaży sprawdzonych samochodów używanych. Prezentacja możliwości ekosystemu VroomSites.',
      '/images/dcar-logo.png',
      '+48 500 600 700',
      '48500600700',
      'ul. Motoryzacyjna 12',
      'Warszawa',
      '00-001',
      'warszawski',
      'mazowieckie',
      jsonb_build_object(
        'primaryColor', '#1686E0',
        'accentColor', '#38BDF8',
        'logoUrl', '/images/dcar-logo.png',
        'heroTitle', 'Sprawdzone samochody z gwarancją',
        'heroSubtitle', 'Szeroki wybór pewnych aut z udokumentowaną historią. Sprawdź naszą aktualną ofertę z placu.',
        'heroImageUrl', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        'colors', jsonb_build_object(
          'primary', '#1686E0',
          'primaryForeground', '#ffffff',
          'accent', '#38BDF8',
          'accentForeground', '#ffffff',
          'background', '#ffffff',
          'foreground', '#09090b',
          'surface', '#f8fafc',
          'muted', '#64748b',
          'headerBg', '#09090b',
          'footerBg', '#09090b'
        )
      ),
      jsonb_build_array(
        jsonb_build_object(
          'id', 'srv-sales',
          'type', 'car_sales',
          'enabled', true,
          'title', 'Sprzedaż Samochodów Używanych',
          'description', 'Starannie wyselekcjonowane i zweryfikowane pojazdy z pewną historią techniczną.'
        ),
        jsonb_build_object(
          'id', 'srv-finance',
          'type', 'car_finance',
          'enabled', true,
          'title', 'Finansowanie i Leasing',
          'description', 'Elastyczne kredyty oraz leasingi na procedurach uproszczonych z minimum formalności.'
        ),
        jsonb_build_object(
          'id', 'srv-warranty',
          'type', 'car_warranty',
          'enabled', true,
          'title', 'Gwarancja Techniczna',
          'description', 'Możliwość objęcia każdego zakupionego pojazdu pisemną gwarancją techniczną na okres do 24 miesięcy.'
        )
      ),
      jsonb_build_object(
        'features', jsonb_build_object('carBuying', false),
        'sections', jsonb_build_array(
          jsonb_build_object('id', 'sec-hero', 'type', 'hero', 'enabled', true, 'title', 'Sprawdzone samochody osobowe i dostawcze'),
          jsonb_build_object('id', 'sec-vehicles', 'type', 'vehicles', 'enabled', true, 'title', 'Aktualna oferta na sprzedaż'),
          jsonb_build_object('id', 'sec-about', 'type', 'about', 'enabled', true, 'title', 'O nas — Vroom Motors Demo'),
          jsonb_build_object('id', 'sec-services', 'type', 'services', 'enabled', true, 'title', 'Nasze usługi i korzyści'),
          jsonb_build_object('id', 'sec-contact', 'type', 'contact', 'enabled', true, 'title', 'Kontakt i lokalizacja')
        )
      ),
      jsonb_build_object(
        'metaTitle', 'Vroom Motors Demo - Sprawdzone Samochody Używane',
        'metaDescription', 'Pewne auta z gwarancją i udokumentowaną historią. Sprawdź ofertę demonstracyjną.'
      ),
      jsonb_build_object('tradeIn', jsonb_build_object('enabled', false)),
      true,
      true
    )
    RETURNING id INTO v_tenant_id;
  END IF;

  -- 2. Usunięcie dotychczasowych aut tenanta demo
  DELETE FROM cars WHERE tenant_id = v_tenant_id;

  -- 3. Wstawienie 10 uniwersalnych modeli testowych
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
    'audi-a4-avant-2-0-tdi-2021',
    'Audi',
    'A4 Avant',
    2021,
    118900,
    84500,
    'Diesel',
    '1968 cm³ (190 KM)',
    'Automat',
    'Kombi',
    'Audi A4 Avant 2.0 TDI S Tronic w idealnym stanie technicznym i wizualnym. Regularnie serwisowany w ASO, pełna historia serwisowa, bezwypadkowy. Bogate wyposażenie obejmujące pakiet S-Line, reflektory Matrix LED, wirtualny kokpit, aktywny tempomat oraz fotele sportowe z tapicerką skórzaną. Faktura VAT 23%.',
    ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VRM2021DEMO0001X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'bmw-seria-3-320d-m-sport-2020',
    'BMW',
    'Seria 3',
    2020,
    134000,
    76000,
    'Diesel',
    '1995 cm³ (190 KM)',
    'Automat',
    'Sedan',
    'BMW 320d xDrive Sedan w fabrycznym pakiecie M Sport. Dynamiczny silnik diesla o mocy 190 KM z napędem na cztery koła i 8-biegową skrzynią Steptronic. Lakier metalizowany, zawieszenie adaptacyjne M, sportowy układ kierowniczy, fotele M z pamięcią ustawień. Samochód bezwypadkowy, po pełnym przeglądzie.',
    ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VRM2020DEMO0002X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'volkswagen-golf-viii-1-5-etsi-2022',
    'Volkswagen',
    'Golf',
    2022,
    89900,
    34200,
    'Hybryda',
    '1498 cm³ (150 KM)',
    'Automat',
    'Hatchback',
    'Volkswagen Golf VIII z oszczędnym napędem miękkiej hybrydy 1.5 eTSI oraz automatyczną skrzynią DSG. Znakomity stan techniczny, zaledwie 34 200 km przebiegu. Wersja wyposażenia Style z cyfrowymi zegarami Digital Cockpit Pro, ambientowym oświetleniem 30 kolorów i asystentem pasa ruchu Travel Assist.',
    ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VRM2022DEMO0003X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'mercedes-benz-klasa-c-220d-2019',
    'Mercedes-Benz',
    'Klasa C',
    2019,
    109000,
    96500,
    'Diesel',
    '1950 cm³ (194 KM)',
    'Automat',
    'Sedan',
    'Mercedes-Benz C 220 d Sedan z 9-stopniową automatyczną skrzynią biegów 9G-TRONIC. Wersja poliftowa z nowoczesnym silnikiem OM654 o kulturze pracy klasy premium. Reflektory MULTIBEAM LED, system COMAND Online, nagłośnienie Burmester Surround, czarna podsufitka. Samochód zarejestrowany i ubezpieczony.',
    ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VRM2019DEMO0004X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'volvo-xc60-d4-inscription-2020',
    'Volvo',
    'XC60',
    2020,
    149900,
    88000,
    'Diesel',
    '1969 cm³ (190 KM)',
    'Automat',
    'SUV',
    'Volvo XC60 D4 AWD w ekskluzywnej wersji Inscription. Napęd na 4 koła, 8-biegowa skrzynia Geartronic. Wentylowane fotele z naturalnej skóry Nappa z masażami, dach panoramiczny, nagłośnienie Harman Kardon, pakiet bezpieczeństwa IntelliSafe z asystentem martwego pola BLIS.',
    ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VRM2020DEMO0005X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'toyota-rav4-2-5-hybrid-2021',
    'Toyota',
    'RAV4',
    2021,
    136500,
    53000,
    'Hybryda',
    '2487 cm³ (222 KM)',
    'Automat',
    'SUV',
    'Toyota RAV4 2.5 Hybrid AWD-i w wersji wyposażenia Selection. Niezawodny napęd hybrydowy czwartej generacji o łącznej mocy 222 KM z inteligentnym napędem na cztery koła. Dwukolorowe nadwozie, bezkluczykowy dostęp Smart Entry, kamera cofania, podgrzewane fotele przednie i kierownica.',
    ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'],
    false,
    true,
    'VRM2021DEMO0006X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'ford-focus-st-line-1-5-2021',
    'Ford',
    'Focus',
    2021,
    76900,
    48500,
    'Benzyna',
    '1496 cm³ (150 KM)',
    'Manualna',
    'Kombi',
    'Ford Focus Kombi ST-Line z dynamicznym i elastycznym silnikiem 1.5 EcoBoost 150 KM. Sportowe zderzaki, 17-calowe alufelgi, sportowa spłaszczona kierownica ze skóry, system multimedialny SYNC 3 z obsługą Apple CarPlay i Android Auto, podgrzewana przednia szyba Quickclear.',
    ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'VRM2021DEMO0007X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'porsche-macan-2-0-pdk-2020',
    'Porsche',
    'Macan',
    2020,
    199000,
    61000,
    'Benzyna',
    '1984 cm³ (245 KM)',
    'Automat',
    'SUV',
    'Porsche Macan 2.0 Turbo o mocy 245 KM ze sportową skrzynią biegów PDK i napędem na wszystkie koła. Wykończenie wnętrza w skórze, 20-calowe koła Macan Turbo, pakiet Sport Chrono z przełącznikiem trybów jazdy, zawieszenie PASM z regulacją twardości, nagłośnienie BOSE.',
    ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'VRM2020DEMO0008X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'renault-master-l2h2-2-3-dci-2021',
    'Renault',
    'Master',
    2021,
    82000,
    114000,
    'Diesel',
    '2299 cm³ (150 KM)',
    'Manualna',
    'Dostawczy',
    'Renault Master L2H2 furgon z silnikiem 2.3 dCi 150 KM Twin Turbo. Przestrzeń ładunkowa wyłożona profesjonalną zabudową ze sklejki, drzwi tylne otwierane 270 stopni, kamera cofania z monitorem w lusterku, czujniki parkowania, klimatyzacja. Gotowy do pracy bez nakładów finansowych.',
    ARRAY['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'VRM2021DEMO0009X',
    true,
    'ready'
  ),
  (
    v_tenant_id,
    'kia-sportage-1-6-t-gdi-2022',
    'Kia',
    'Sportage',
    2022,
    99900,
    29000,
    'Benzyna',
    '1598 cm³ (150 KM)',
    'Manualna',
    'SUV',
    'Kia Sportage V najnowszej generacji z silnikiem benzynowym 1.6 T-GDI 150 KM. Bardzo niski przebieg 29 000 km, fabryczna gwarancja producenta do 2029 roku. Wyposażenie: zakrzywiony podwójny ekran panoramiczny, kamera 360 stopni, asystent unikania kolizji drogowych, automatyczna dwustrefowa klimatyzacja.',
    ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'],
    false,
    false,
    'VRM2022DEMO0010X',
    true,
    'ready'
  );

  RAISE NOTICE 'Pomyślnie zsynchronizowano uniwersalną flotę demo 10 aut!';
END $$;
