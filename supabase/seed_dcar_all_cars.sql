-- ============================================================
-- VroomDealer — Wstawienie wszystkich 6 aut dla d-car do bazy Supabase
-- Bezpieczne i idempotentne (ON CONFLICT lub sprawdzenie po slugu)
-- Wklej w Supabase Dashboard > SQL Editor > Run
-- ============================================================

DO $$
DECLARE
  v_profile_id uuid;
BEGIN
  -- 1. Pobierz ID profilu d-car
  SELECT id INTO v_profile_id FROM profiles WHERE slug = 'd-car' LIMIT 1;

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Nie znaleziono profilu o slugu "d-car" w tabeli profiles!';
  END IF;

  -- 2. Wstawienie Mitsubishi Outlander (jeśli nie istnieje)
  IF NOT EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = 'mitsubishi-outlander-lift-2007-lpg') THEN
    INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured)
    VALUES (
      v_profile_id,
      'mitsubishi-outlander-lift-2007-lpg',
      'Mitsubishi', 'Outlander Lift', 2007, 8300, 263900, 'Benzyna + LPG', '2.0 136KM', 'Manualna', 'Srebrny',
      'Sprzedam zadbane Mitsubishi Outlander
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
Pozdrawiam',
      ARRAY[
        'https://ireland.apollo.olxcdn.com:443/v1/files/847mkdurwqdn3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/vzh9i1jt0fzg-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/3kbci89l6wue-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/p2zy5kr6n9202-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/bq2o7wdbyadg-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/iub6e3m9mywk-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/okinff3245fm2-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/zk8m0wl3tvy91-PL/image'
      ],
      false, true
    );
  END IF;

  -- 3. Wstawienie Opel Astra II (jeśli nie istnieje)
  IF NOT EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = 'opel-astra-ii-1-6-8v-2000-benzyna') THEN
    INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured)
    VALUES (
      v_profile_id,
      'opel-astra-ii-1-6-8v-2000-benzyna',
      'Opel', 'Astra II 1.6 8V', 2000, 3300, 146000, 'Benzyna', '1.6 8V 84KM', 'Manualna', 'Srebrny',
      'Sprzedam Opel Astra II, rok produkcji 2000, silnik 1.6 8V benzyna. Przebieg oryginalny 146 tys. km. Opłaty aktualne do przyszłego roku. Mechanicznie bez wkładu finansowego! Stan blacharski oceniam na dobry z plusem, ładnie się prezentuje. Klimatyzacja mrozi! Elektryczne szyby, hak holowniczy. Pozdrawiam.',
      ARRAY[
        'https://ireland.apollo.olxcdn.com:443/v1/files/0ynomnj3m2gc3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/gbjzemfg8p9n2-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/6y7byu176nuv2-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/csdoahbsx2se-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/mjw3iq6u6kxb3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/8pecuaw9hyw62-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/rn7ma36n74vd3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/nt1t0l3ajl2t2-PL/image'
      ],
      false, true
    );
  END IF;

  -- 4. Wstawienie Audi A3 8P (jeśli nie istnieje)
  IF NOT EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = 'audi-a38p-2-0-tdi-2003-diesel') THEN
    INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured)
    VALUES (
      v_profile_id,
      'audi-a38p-2-0-tdi-2003-diesel',
      'Audi', 'A3 8P 2.0 TDI', 2003, 2700, 210000, 'Diesel', '2.0 TDI 140KM', 'Manualna', 'Czarny',
      'Sprzedam Audi A3 8P. Rok produkcji 2003, 2.0 diesel 140km. Silnik, skrzynia, zawieszenie w dobrym stanie. Blacharsko do drobnych poprawek i lakier do polerki. OC aktualne, PT wyszedł na dniach. Lokalizacja Topólka 87-875. Cena 2700 zł adekwatna do stanu pojazdu. Autem można wracać na kołach bądź mogę dostarczyć pod wskazany adres po oględzinach. Pozdrawiam.',
      ARRAY[
        'https://ireland.apollo.olxcdn.com:443/v1/files/084a38g4ub2o-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/sbfqrj9vqrsn-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/5dbrotpttk611-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/f21glet2oxq11-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/ilub181qtjks2-PL/image'
      ],
      false, true
    );
  END IF;

  -- 5. Wstawienie Hyundai i30 (jeśli nie istnieje)
  IF NOT EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = 'hyundai-i30-2015-lift-1-4-crdi') THEN
    INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured)
    VALUES (
      v_profile_id,
      'hyundai-i30-2015-lift-1-4-crdi',
      'Hyundai', 'i30 Lift', 2015, 22500, 165000, 'Diesel', '1.4 CRDi 90KM', 'Manualna', 'Biały',
      'Sprzedam Hyundai i30 2015r 1.4 CRDi polift. OC, AC, PT świeżo wykupione na rok. Stan blacharski wzorowy. Mechanicznie bez wkładu finansowego. Bogate wyposażenie, klimatyzacja mrozi! Jesteśmy właścicielami od 2019r. Cena 22 500 zł do negocjacji po oględzinach auta. Pozdrawiam.',
      ARRAY[
        'https://ireland.apollo.olxcdn.com:443/v1/files/kglaocjlrnge1-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/nqfw0fxdn2w92-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/det4pf68zpn61-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/90xa9fbfkd4i3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/yb3obcmet74w1-PL/image'
      ],
      false, true
    );
  END IF;

  -- 6. Wstawienie Audi A3 Sportback (jeśli nie istnieje)
  IF NOT EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = 'audi-a3-sportback-2-0-tfsi-2004-benzyna') THEN
    INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured)
    VALUES (
      v_profile_id,
      'audi-a3-sportback-2-0-tfsi-2004-benzyna',
      'Audi', 'A3 Sportback 2.0 TFSI', 2004, 12800, 198000, 'Benzyna', '2.0 TFSI 200KM', 'Automatyczna (z łopatkami)', 'Czarny',
      'Sprzedam Audi A3 Sportback z silnikiem benzynowym 2.0 TFSI o mocy 200 KM w połączeniu z automatyczną skrzynią biegów. Autko ze sportowym charakterem oraz bogatym wyposażeniem. Mechanicznie w bdb stanie bez wkładu. Blacharsko bez korozji! Łopatki przy kierownicy, przelot, alufelgi z oponami zimowymi. Cena 12 800 zł do negocjacji. Możliwość zamiany na tańsze. Pozdrawiam.',
      ARRAY[
        'https://ireland.apollo.olxcdn.com:443/v1/files/i3a6q9kvq7t81-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/lycj1gyadcyg3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/nf781m8q62xc-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/1u8kk360t8uh3-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/nr2hu5hbhmyc2-PL/image'
      ],
      false, true
    );
  END IF;

  -- 7. Wstawienie Opel Astra H (jeśli nie istnieje)
  IF NOT EXISTS (SELECT 1 FROM cars WHERE profile_id = v_profile_id AND slug = 'opel-astra-h-lift-1-6-2007-benzyna') THEN
    INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured)
    VALUES (
      v_profile_id,
      'opel-astra-h-lift-1-6-2007-benzyna',
      'Opel', 'Astra H Lift 1.6', 2007, 4300, 185000, 'Benzyna', '1.6 16V 105KM', 'Manualna', 'Srebrny',
      'Sprzedam Opel Astra H 2007r polift 1.6 benzyna. Klimatyzacja mrozi! Mechanicznie w bdb stanie. Blacharsko do poprawek jak na zdjęciach. Cena 4300 zł. Pozdrawiam.',
      ARRAY[
        'https://ireland.apollo.olxcdn.com:443/v1/files/75lcjthguw6c1-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/yhuvbbfyf0t01-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/jkyd99warkad1-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/p8nlbpo8gzt01-PL/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/fbxnjnv1r666-PL/image'
      ],
      false, false
    );
  END IF;

  RAISE NOTICE 'Zsynchronizowano kompletną flotę aut dla d-car w bazie Supabase!';
END $$;
