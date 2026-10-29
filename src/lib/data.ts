import { Tenant, Car } from "@/types/database";
import { unstable_cache } from "next/cache";

export const getTenant = unstable_cache(
  async (slug: string): Promise<Tenant | null> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data;
      }

      // Dev-only fallback to avoid 404 when remote DB lacks local test tenants
      if (process.env.NODE_ENV === "development") {
        const { getDevSeedTenant } = await import("@/lib/dev-seed-helper");
        const devTenant = getDevSeedTenant(slug);
        if (devTenant) {
          return devTenant;
        }
      }

      return null;
    } catch {
      if (process.env.NODE_ENV === "development") {
        const { getDevSeedTenant } = await import("@/lib/dev-seed-helper");
        return getDevSeedTenant(slug);
      }
      return null;
    }
  },
  ['tenant-by-slug'],
  { revalidate: process.env.NODE_ENV === 'development' ? 1 : 3600, tags: ['tenants'] }
);

export const getCars = unstable_cache(
  async (tenantId: string): Promise<Car[]> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }

      // Dev-only fallback to avoid empty state when testing newly seeded tenants
      if (process.env.NODE_ENV === "development") {
        const { getDevSeedCars } = await import("@/lib/dev-seed-helper");
        const devCars = getDevSeedCars(tenantId);
        if (devCars.length > 0) {
          return devCars;
        }
      }

      return data || [];
    } catch {
      if (process.env.NODE_ENV === "development") {
        const { getDevSeedCars } = await import("@/lib/dev-seed-helper");
        return getDevSeedCars(tenantId);
      }
      return [];
    }
  },
  ['cars-by-tenant'],
  { revalidate: process.env.NODE_ENV === 'development' ? 1 : 60, tags: ['cars'] }
);

export const getCar = unstable_cache(
  async (carSlug: string): Promise<Car | null> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("slug", carSlug)
        .single();

      if (!error && data) {
        return data;
      }

      if (process.env.NODE_ENV === "development") {
        const { getAllDevSeedCars } = await import("@/lib/dev-seed-helper");
        const devCars = getAllDevSeedCars();
        const match = devCars.find((c) => c.slug === carSlug || c.id === carSlug);
        if (match) return match;
      }

      return null;
    } catch {
      return null;
    }
  },
  ['car-by-slug'],
  { revalidate: process.env.NODE_ENV === 'development' ? 1 : 60, tags: ['cars'] }
);

export const getAllTenants = unstable_cache(
  async (): Promise<Tenant[]> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("tenants")
        .select("*");

      const tenants = (!error && data) ? data : [];

      if (process.env.NODE_ENV === "development") {
        const { getAllDevSeedTenants } = await import("@/lib/dev-seed-helper");
        const devTenants = getAllDevSeedTenants();
        for (const dt of devTenants) {
          if (!tenants.some((t) => t.slug === dt.slug)) {
            tenants.push(dt);
          }
        }
      }

      return tenants;
    } catch {
      return [];
    }
  },
  ['all-tenants'],
  { revalidate: process.env.NODE_ENV === 'development' ? 1 : 3600, tags: ['tenants'] }
);

export const getAllCars = unstable_cache(
  async (): Promise<Car[]> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_sold", false);

      const cars = (!error && data) ? data : [];

      if (process.env.NODE_ENV === "development" && cars.length === 0) {
        const { getAllDevSeedCars } = await import("@/lib/dev-seed-helper");
        cars.push(...getAllDevSeedCars());
      }

      return cars;
    } catch {
      return [];
    }
  },
  ['all-unsold-cars'],
  { revalidate: process.env.NODE_ENV === 'development' ? 1 : 60, tags: ['cars'] }
);
