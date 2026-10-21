-- ============================================================
-- VroomSites / VroomDealer — Migracja v7: Uprawnienia Admina do aut i komisów (RLS)
-- Uruchom w Supabase Dashboard -> SQL Editor (projekt axzenvjqkhcbctnvofkl)
-- ============================================================

-- 1. Upewnij się, że RLS jest włączone
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- 2. Zezwól zalogowanym użytkownikom (panel admina) na dodawanie aut
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
CREATE POLICY "Authenticated users can insert cars" ON cars
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 3. Zezwól zalogowanym użytkownikom na edycję aut (w tym zmianę statusu sprzedane / wyróżnione)
DROP POLICY IF EXISTS "Authenticated users can update cars" ON cars;
CREATE POLICY "Authenticated users can update cars" ON cars
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Zezwól zalogowanym użytkownikom na usuwanie aut
DROP POLICY IF EXISTS "Authenticated users can delete cars" ON cars;
CREATE POLICY "Authenticated users can delete cars" ON cars
  FOR DELETE TO authenticated
  USING (true);

-- 5. Publiczny odczyt aut (dla strony www komisu i podstron pojedynczych aut)
DROP POLICY IF EXISTS "Public can read cars" ON cars;
CREATE POLICY "Public can read cars" ON cars
  FOR SELECT TO public
  USING (true);

-- ============================================================
-- 6. Tabela TENANTS (dla pewności, żeby edycja ustawień i dodawanie komisów nie były blokowane)
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can insert tenants" ON tenants;
CREATE POLICY "Authenticated users can insert tenants" ON tenants
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update tenants" ON tenants;
CREATE POLICY "Authenticated users can update tenants" ON tenants
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read tenants" ON tenants;
CREATE POLICY "Public can read tenants" ON tenants
  FOR SELECT TO public
  USING (true);
