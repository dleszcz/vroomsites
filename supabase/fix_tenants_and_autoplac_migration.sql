-- ==============================================================================
-- Vroom Ecosystem — Kompleksowa migracja naprawcza (Fix "profiles" + Autoplac v8)
-- Projekt Supabase: xfagkubntiqvrvbmoira (https://xfagkubntiqvrvbmoira.supabase.co)
-- Instrukcja: Wklej i uruchom w Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- KROK 1: Usunięcie błędu 'relation "profiles" does not exist'
-- Projekt historycznie używał tabeli "profiles", którą przemianowano na "tenants".
-- Jeśli w bazie istnieją stare polityki RLS lub triggery odpytujące "profiles",
-- utworzenie widoku zgodności wstecznej natychmiast rozwiązuje problem:
CREATE OR REPLACE VIEW profiles AS 
  SELECT * FROM tenants;

-- KROK 2: Włączenie RLS i czyszczenie starych polityk na tabeli TENANTS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Usuwamy ewentualne stare/konfliktowe polityki RLS na tenants
DROP POLICY IF EXISTS "Authenticated users can update tenants" ON tenants;
DROP POLICY IF EXISTS "Authenticated users can insert tenants" ON tenants;
DROP POLICY IF EXISTS "Public can read tenants" ON tenants;
DROP POLICY IF EXISTS "Users can update own tenant" ON tenants;
DROP POLICY IF EXISTS "Users can update own profile" ON tenants;
DROP POLICY IF EXISTS "Superadmins can update tenants" ON tenants;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON tenants;

-- Nowe, czyste polityki RLS dla TENANTS
CREATE POLICY "Public can read tenants" ON tenants
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Authenticated users can update tenants" ON tenants
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert tenants" ON tenants
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- KROK 3: Dodanie kolumn dla Autoplac.pl do tabeli TENANTS
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS autoplac_enabled BOOLEAN DEFAULT false;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS autoplac_feed_token UUID DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_autoplac_feed_token 
  ON tenants (autoplac_feed_token);

-- KROK 4: Dodanie kolumn dla Autoplac.pl / CEPiK do tabeli CARS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

ALTER TABLE cars ADD COLUMN IF NOT EXISTS vin VARCHAR(17);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS first_registration_date DATE;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS export_to_autoplac BOOLEAN DEFAULT true;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS autoplac_status TEXT DEFAULT 'draft';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS autoplac_error_message TEXT;

-- Upewnij się, że wszystkie aktualnie niesprzedane auta mają aktywny eksport do feedu
UPDATE cars SET export_to_autoplac = true WHERE is_sold = false;

CREATE INDEX IF NOT EXISTS idx_cars_autoplac_feed 
  ON cars (tenant_id, is_sold, export_to_autoplac) 
  WHERE is_sold = false AND export_to_autoplac = true;

-- KROK 5: Czyste polityki RLS dla tabeli CARS
DROP POLICY IF EXISTS "Public can read cars" ON cars;
CREATE POLICY "Public can read cars" ON cars
  FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
CREATE POLICY "Authenticated users can insert cars" ON cars
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update cars" ON cars;
CREATE POLICY "Authenticated users can update cars" ON cars
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete cars" ON cars;
CREATE POLICY "Authenticated users can delete cars" ON cars
  FOR DELETE TO authenticated
  USING (true);

-- ==============================================================================
-- WERYFIKACJA (Wyświetli status w konsoli po uruchomieniu)
-- ==============================================================================
SELECT 'Migracja naprawcza wykonana pomyślnie!' AS status;
