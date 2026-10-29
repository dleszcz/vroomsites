import { Tenant, Car } from "@/types/database";

/**
 * Dev-only seed registry for local development and testing.
 * Prevents 404 errors when remote Supabase database does not have
 * freshly added local test tenants (such as Wadera) yet.
 * 
 * In production (process.env.NODE_ENV === "production"), this is completely inert.
 */

export function getDevSeedTenant(slug: string): Tenant | null {
  if (process.env.NODE_ENV !== "development") return null;

  try {
    if (slug === "wadera") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { WADER_TENANT } = require("../../scripts/seeds/seed-wader");
      return WADER_TENANT as Tenant;
    }
    if (slug === "d-car" || slug === "dcar") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { DCAR_TENANT } = require("../../scripts/seeds/seed-dcar");
      return DCAR_TENANT as Tenant;
    }
    return null;
  } catch (err) {
    console.error("[getDevSeedTenant error]:", err);
    return null;
  }
}

export function getDevSeedCars(tenantId: string): Car[] {
  if (process.env.NODE_ENV !== "development") return [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { WADER_TENANT_ID, WADER_CARS } = require("../../scripts/seeds/seed-wader");
    if (tenantId === WADER_TENANT_ID) return WADER_CARS as Car[];

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DCAR_TENANT_ID, DCAR_CARS } = require("../../scripts/seeds/seed-dcar");
    if (tenantId === DCAR_TENANT_ID) return DCAR_CARS as Car[];

    return [];
  } catch (err) {
    console.error("[getDevSeedCars error]:", err);
    return [];
  }
}

export function getAllDevSeedTenants(): Tenant[] {
  if (process.env.NODE_ENV !== "development") return [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { WADER_TENANT } = require("../../scripts/seeds/seed-wader");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DCAR_TENANT } = require("../../scripts/seeds/seed-dcar");
    return [WADER_TENANT as Tenant, DCAR_TENANT as Tenant];
  } catch (err) {
    console.error("[getAllDevSeedTenants error]:", err);
    return [];
  }
}

export function getAllDevSeedCars(): Car[] {
  if (process.env.NODE_ENV !== "development") return [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { WADER_CARS } = require("../../scripts/seeds/seed-wader");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DCAR_CARS } = require("../../scripts/seeds/seed-dcar");
    return [...(WADER_CARS as Car[]), ...(DCAR_CARS as Car[])];
  } catch (err) {
    console.error("[getAllDevSeedCars error]:", err);
    return [];
  }
}
