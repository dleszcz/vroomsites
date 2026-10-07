import { getAdminBasePath } from "@/lib/admin-utils";
import { getCurrentTenant, getTenantBySlug } from "@/app/[dealerSlug]/admin/actions";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = {
  title: "Ustawienia Komisu | Panel Admina",
};

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ dealerSlug: string }>;
}) {
  const currentTenant = await getCurrentTenant();
  const basePath = await getAdminBasePath();
  if (!currentTenant) redirect(`${basePath}/admin/login`);

  const { dealerSlug } = await params;
  const isSuperAdmin = Boolean(currentTenant.is_super_admin);

  let targetTenant = currentTenant;

  if (isSuperAdmin && dealerSlug !== "superadmin") {
    const fetched = await getTenantBySlug(dealerSlug);
    if (fetched) {
      targetTenant = fetched;
    }
  }

  return (
    <div>
      <div style={headerStyles.wrapper}>
        <h1 style={headerStyles.title}>
          Ustawienia komisu
        </h1>
        <p style={headerStyles.subtitle}>
          Kompleksowa konfiguracja wizytówki, brandingu, kontaktów, integracji i SEO
        </p>
      </div>

      <SettingsForm
        targetSlug={isSuperAdmin && targetTenant.slug !== currentTenant.slug ? targetTenant.slug : undefined}
        tenant={{
          business_name: targetTenant.business_name ?? null,
          business_description: targetTenant.business_description ?? null,
          custom_domain: targetTenant.custom_domain ?? null,
          notification_email: targetTenant.notification_email ?? null,
          google_sheets_webhook_url: targetTenant.google_sheets_webhook_url ?? null,
          contact_phone: targetTenant.contact_phone ?? null,
          whatsapp_number: targetTenant.whatsapp_number ?? null,
          address: targetTenant.address ?? null,
          city: targetTenant.city ?? null,
          postal_code: targetTenant.postal_code ?? null,
          county: targetTenant.county ?? null,
          region: targetTenant.region ?? null,
          pixel_id: targetTenant.pixel_id ?? null,
          branding: (targetTenant.branding as Record<string, unknown>) ?? null,
          analytics: (targetTenant.analytics as Record<string, unknown>) ?? null,
          opening_hours: (targetTenant.opening_hours as Record<string, unknown>) ?? null,
          business_rules: (targetTenant.business_rules as Record<string, unknown>) ?? null,
          seo: (targetTenant.seo as Record<string, unknown>) ?? null,
        }}
      />
    </div>
  );
}

const headerStyles: Record<string, React.CSSProperties> = {
  wrapper: {
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
};
