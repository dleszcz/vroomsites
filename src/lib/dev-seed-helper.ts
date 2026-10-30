import { Tenant, Car } from "@/types/database";
import { getUniversalMockCars, createUniversalMockTenant } from "./universal-dev-seeds";

/**
 * Universal Dev-only seed registry for local development and testing.
 * Prevents 404 errors when remote Supabase database does not have
 * a freshly accessed dealer slug or vehicles yet.
 * 
 * In production (process.env.NODE_ENV === "production"), this is completely inert.
 */

export function getDevSeedTenant(slug: string): Tenant | null {
  if (process.env.NODE_ENV !== "development") return null;

  try {
    return createUniversalMockTenant(slug);
  } catch (err) {
    console.error("[getDevSeedTenant error]:", err);
    return null;
  }
}

export function getDevSeedCars(tenantId: string): Car[] {
  if (process.env.NODE_ENV !== "development") return [];

  try {
    return getUniversalMockCars(tenantId);
  } catch (err) {
    console.error("[getDevSeedCars error]:", err);
    return [];
  }
}

export function getAllDevSeedTenants(): Tenant[] {
  if (process.env.NODE_ENV !== "development") return [];

  try {
    return [
      createUniversalMockTenant("demo"),
      createUniversalMockTenant("d-car"),
      createUniversalMockTenant("wadera"),
    ];
  } catch (err) {
    console.error("[getAllDevSeedTenants error]:", err);
    return [];
  }
}

export function getAllDevSeedCars(): Car[] {
  if (process.env.NODE_ENV !== "development") return [];

  try {
    return getUniversalMockCars();
  } catch (err) {
    console.error("[getAllDevSeedCars error]:", err);
    return [];
  }
}

