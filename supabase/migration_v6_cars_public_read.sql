-- ============================================================
-- VroomDealer — Migration v6: Public Cars Read Access
-- Safe for production: all operations are idempotent
-- ============================================================

-- Allow anonymous and public users to read cars so the frontend can display them
DROP POLICY IF EXISTS "Public can read cars" ON cars;
CREATE POLICY "Public can read cars" ON cars
  FOR SELECT TO public
  USING (true);
