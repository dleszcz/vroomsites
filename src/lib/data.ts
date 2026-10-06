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

      if (error || !data) {
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  ['tenant-by-slug'],
  { revalidate: 3600, tags: ['tenants'] }
);

export const getCars = unstable_cache(
  async (tenantId: string): Promise<Car[]> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("cars")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!data) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },
  ['cars-by-tenant'],
  { revalidate: 60, tags: ['cars'] }
);

export const getCar = unstable_cache(
  async (carSlug: string): Promise<Car | null> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("cars")
        .select("*")
        .eq("slug", carSlug)
        .single();

      if (!data) {
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  ['car-by-slug'],
  { revalidate: 60, tags: ['cars'] }
);

export const getAllTenants = unstable_cache(
  async (): Promise<Tenant[]> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase.from("tenants").select("*");

      if (error || !data) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },
  ['all-tenants'],
  { revalidate: 3600, tags: ['tenants'] }
);

export const getAllCars = unstable_cache(
  async (): Promise<Car[]> => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("cars")
        .select("*")
        .eq("is_sold", false);

      if (!data) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },
  ['all-unsold-cars'],
  { revalidate: 60, tags: ['cars'] }
);
