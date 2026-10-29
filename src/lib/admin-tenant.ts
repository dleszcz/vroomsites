import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { getDevSeedTenant } from "@/lib/dev-seed-helper";

export const getCachedCurrentTenant = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    // In dev mode, fallback to dev seed tenant to facilitate local testing of admin UI
    if (process.env.NODE_ENV === "development") {
      const devTenant = getDevSeedTenant("wadera") || getDevSeedTenant("d-car");
      if (devTenant) {
        return {
          ...devTenant,
          is_super_admin: true,
        };
      }
    }
    return null;
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (tenant) return tenant;

  // Fallback
  const { data: fallbackTenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("is_super_admin", false)
    .limit(1)
    .maybeSingle();

  return fallbackTenant || null;
});

