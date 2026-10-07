import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getCachedCurrentTenant = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) return null;

  const { data: tenant, error: tenantError } = await supabase
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
