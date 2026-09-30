-- ============================================================
-- VroomDealer — Migration v5: Cars Management (RLS for Authenticated)
-- Safe for production: all operations are idempotent
-- ============================================================

-- Allow authenticated users (admin panel) to manage cars
DROP POLICY IF EXISTS "Authenticated users can manage cars" ON cars;
CREATE POLICY "Authenticated users can manage cars" ON cars
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow reading cars for authenticated users (needed for admin panel)
DROP POLICY IF EXISTS "Authenticated users can read cars" ON cars;
CREATE POLICY "Authenticated users can read cars" ON cars
  FOR SELECT TO authenticated
  USING (true);
