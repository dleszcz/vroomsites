import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant, getTenantBySlug } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata = {
  title: "Leady | Panel Admina",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const tenant = await getCurrentTenant();
  if (!tenant) redirect("/admin/login");

  const resolvedParams = await searchParams;
  const isSuperAdmin = Boolean(tenant.is_super_admin);

  const supabase = await createClient();

  // For Superadmin, default tenant filter is "all" (not tenant.slug which is 'superadmin')
  const targetTenant = isSuperAdmin
    ? resolvedParams.tenant || "all"
    : tenant.slug;

  let targetTenant = tenant;
  if (isSuperAdmin && targetTenant !== "all") {
    const fetched = await getTenantBySlug(targetTenant);
    if (fetched) targetTenant = fetched;
  }

  let query = supabase.from("leads").select("*");
  if (targetTenant !== "all") {
    if (targetTenant && targetTenant.id && targetTenant.slug) {
      query = query.or(`dealer_id.eq.${targetTenant.id},dealer_id.eq.${targetTenant.slug}`);
    } else {
      query = query.eq("dealer_id", targetTenant);
    }
  }

  const { data: leads, error } = await query
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error(
      "Error fetching leads details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
  }

  const isAllView = isSuperAdmin && targetTenant === "all";

  return (
    <div>
      <div style={headerStyles.wrapper}>
        <div>
          <h1 style={headerStyles.title}>
            {isAllView ? "📊 Wszystkie Zgłoszenia (SaaS)" : "📋 Zgłoszenia (Leady)"}{" "}
            {isSuperAdmin && !isAllView && (
              <span style={headerStyles.tenantTag}>
                [{targetTenant.business_name || targetTenant}]
              </span>
            )}
          </h1>
          <p style={headerStyles.subtitle}>
            {isAllView
              ? "Zbiorczy podgląd zgłoszeń ze wszystkich uruchomionych komisów"
              : isSuperAdmin && targetTenant !== "all"
              ? `Zarządzaj zgłoszeniami wycen klientów dla: ${targetTenant.business_name || targetTenant}`
              : "Zarządzaj zgłoszeniami wycen od klientów"}
          </p>
        </div>
        <div style={headerStyles.badge}>
          {leads?.length || 0} zgłoszeń
        </div>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  );
}

const headerStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 4px",
  },
  tenantTag: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "600",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0",
  },
  badge: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10b981",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },
};
