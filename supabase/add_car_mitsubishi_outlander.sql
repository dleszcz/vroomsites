-- ============================================================
-- VroomDealer — Dodanie Mitsubishi Outlander Lift do bazy profilu 'd-car'
-- Bezpieczny i idempotentny skrypt SQL (nie psuje niczego, nie duplikuje ogłoszenia)
-- Wklej w: Supabase Dashboard > SQL Editor > Run
-- ============================================================

DO $$
DECLARE
  v_profile_id uuid;
  v_slug text := 'mitsubishi-outlander-lift-2007-lpg';
  v_description text := 'Sprzedam zadbane Mitsubishi Outlander
Rok produkcji 2007
2.0 benzyna+ LPG
OC i PT sierpień 2027r
Stan blacharski bdb, brak korozji, normalne ślady użytkowania
Ładnie się prezentuje
Mechanicznie bez wkładu finansowego
Klimatyzacja mrozi
4 x elektryczne szyby
Podgrzewane fotele itp
Dobrze jeździ na benzynie i gazie
Cena 8300 zł
Pozdrawiam';
  v_images text[] := ARRAY[
    'https://ireland.apollo.olxcdn.com:443/v1/files/847mkdurwqdn3-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/vzh9i1jt0fzg-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/3kbci89l6wue-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/p2zy5kr6n9202-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/bq2o7wdbyadg-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/iub6e3m9mywk-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/okinff3245fm2-PL/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/zk8m0wl3tvy91-PL/image'
  ];
BEGIN
  -- 1. Znajdź ID profilu d-car
  SELECT id INTO v_profile_id FROM profiles WHERE slug = 'd-car' LIMIT 1;

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Nie znaleziono profilu o slugu "d-car" w tabeli profiles!';
  END IF;

  -- 2. Sprawdź czy ogłoszenie już istnieje - jeśli tak, zaktualizuj; jeśli nie, dodaj
  IF EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = v_slug) THEN
    UPDATE cars SET
      make = 'Mitsubishi',
      model = 'Outlander Lift',
      year = 2007,
      price = 8300,
      mileage = 263900,
      fuel_type = 'Benzyna + LPG',
      engine_capacity = '2.0 136KM',
      transmission = 'Manualna',
      color = 'Srebrny',
      description = v_description,
      images = v_images,
      is_sold = false,
      is_featured = true
    WHERE profile_id = v_profile_id AND slug = v_slug;

    RAISE NOTICE 'Auto % dla d-car już istniało - zostało pomyślnie zaktualizowane.', v_slug;
  ELSE
    INSERT INTO cars (
      profile_id,
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
      is_featured
    ) VALUES (
      v_profile_id,
      v_slug,
      'Mitsubishi',
      'Outlander Lift',
      2007,
      8300,
      263900,
      'Benzyna + LPG',
      '2.0 136KM',
      'Manualna',
      'Srebrny',
      v_description,
      v_images,
      false,
      true
    );

    RAISE NOTICE 'Auto % zostało pomyślnie dodane do bazy d-car!', v_slug;
  END IF;
END $$;
