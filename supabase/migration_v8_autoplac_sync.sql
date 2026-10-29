-- ============================================================
-- Vroom Ecosystem — Migracja v8: Pola Autoplac.pl i Feedu XML
-- Uruchom w Supabase Dashboard -> SQL Editor (projekt axzenvjqkhcbctnvofkl / xfagkubntiqvrvbmoira)
-- 100% kompatybilność wsteczna z działającą produkcją D-Car (d-car.com.pl)
-- ============================================================

-- 1. Upewnij się, że RLS jest bezwzględnie włączone dla tabel CARS oraz TENANTS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 2. Rozszerzenie tabeli CARS o dane wymagane przez Autoplac / CEPiK
ALTER TABLE cars ADD COLUMN IF NOT EXISTS vin VARCHAR(17);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS first_registration_date DATE;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS export_to_autoplac BOOLEAN DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS autoplac_status TEXT DEFAULT 'draft'; -- 'draft' | 'ready' | 'synced' | 'error'
ALTER TABLE cars ADD COLUMN IF NOT EXISTS autoplac_error_message TEXT;

-- Indeks na potrzeby natychmiastowego generowania feedu XML
CREATE INDEX IF NOT EXISTS idx_cars_autoplac_feed 
  ON cars (tenant_id, is_sold, export_to_autoplac) 
  WHERE is_sold = false AND export_to_autoplac = true;

-- 3. Rozszerzenie tabeli TENANTS o token eksportu feedu XML
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS autoplac_feed_token UUID DEFAULT gen_random_uuid();
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS autoplac_enabled BOOLEAN DEFAULT false;

-- Indeks unikalny dla szybkiego i bezpiecznego wyszukiwania tenanta po tokenie feedu
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_autoplac_feed_token 
  ON tenants (autoplac_feed_token);

-- 4. Aktualizacja Polityk RLS dla tabeli CARS
-- Odczyt publiczny (anon): widzi auta publiczne dla strony www komisu
DROP POLICY IF EXISTS "Public can read cars" ON cars;
CREATE POLICY "Public can read cars" ON cars
  FOR SELECT TO public
  USING (true);

-- Wstawianie aut przez zalogowanych dealerów
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
CREATE POLICY "Authenticated users can insert cars" ON cars
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Edycja aut przez zalogowanych dealerów
DROP POLICY IF EXISTS "Authenticated users can update cars" ON cars;
CREATE POLICY "Authenticated users can update cars" ON cars
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Usuwanie aut przez zalogowanych dealerów
DROP POLICY IF EXISTS "Authenticated users can delete cars" ON cars;
CREATE POLICY "Authenticated users can delete cars" ON cars
  FOR DELETE TO authenticated
  USING (true);
