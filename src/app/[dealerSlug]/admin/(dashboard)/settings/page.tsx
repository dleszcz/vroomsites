import { redirect } from "next/navigation";
import { getAdminBasePath } from "@/lib/admin-utils";
import { getCurrentTenant, getTenantBySlug } from "@/app/[dealerSlug]/admin/actions";
import { SettingsContainer } from "@/components/admin/settings";

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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Ustawienia komisu
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Kompleksowa konfiguracja wizytówki, brandingu, kontaktów, integracji zewnętrznych i SEO
        </p>
      </div>

      <SettingsContainer
        dealerSlug={dealerSlug}
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
          autoplac_enabled: targetTenant.autoplac_enabled ?? false,
          slug: targetTenant.slug ?? null,
          branding: (targetTenant.branding as Record<string, unknown>) ?? null,
          analytics: (targetTenant.analytics as Record<string, unknown>) ?? null,
          opening_hours: (targetTenant.opening_hours as Record<string, unknown>) ?? null,
          business_rules: (targetTenant.business_rules as Record<string, unknown>) ?? null,
          seo: (targetTenant.seo as Record<string, unknown>) ?? null,
          local_seo: (targetTenant.local_seo as Record<string, unknown>) ?? null,
          page_config: (targetTenant.page_config as Record<string, unknown>) ?? null,
        }}
      />
    </div>
  );
}
