import { getAdminBasePath } from "@/lib/admin-utils";
import { getCurrentTenant, getAdminCars, getTenantBySlug } from "@/app/[dealerSlug]/admin/actions";
import { CarsManagerContainer } from "@/components/admin/cars";
import { AutoplacFeedBanner } from "@/components/admin/autoplac-feed-banner";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ExternalLink } from "lucide-react";

type Props = {
  params: Promise<{ dealerSlug: string }>;
};

export default async function AdminCarsPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  const basePath = await getAdminBasePath();

  if (!tenant) {
    redirect(`${basePath}/admin/login`);
  }

  const { dealerSlug } = await params;
  const isSuperAdmin = Boolean(tenant.is_super_admin);
  const tenantSlug = isSuperAdmin && dealerSlug !== "superadmin" ? dealerSlug : tenant.slug;

  if (isSuperAdmin && dealerSlug === "superadmin") {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          Oferta Samochodów
        </h1>
        <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
          <p className="text-sm text-slate-400">
            Wybierz komis z listy w lewym menu, aby zarządzać jego ofertą samochodów.
          </p>
        </div>
      </div>
    );
  }

  const targetTenant = isSuperAdmin ? (await getTenantBySlug(tenantSlug)) || tenant : tenant;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocalhost = host.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const siteUrl = !isLocalhost && targetTenant.custom_domain
    ? `https://${targetTenant.custom_domain}`
    : `${origin}/${targetTenant.slug}`;

  const cars = await getAdminCars(tenantSlug);
  const feedIdentifier = targetTenant.slug || targetTenant.autoplac_feed_token || targetTenant.id;
  const feedUrl = `${origin}/api/integrations/autoplac/${feedIdentifier}/feed.xml`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Zarządzanie Flotą Samochodów
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zarządzaj ofertą pojazdów, cenami, parametrami technicznymi i synchronizacją z portalami.
          </p>
        </div>

        <a
          href={`${siteUrl}/samochody`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-4 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
          Podgląd oferty na stronie komisu
        </a>
      </div>

      {targetTenant.autoplac_enabled && (
        <AutoplacFeedBanner feedUrl={feedUrl} />
      )}

      <CarsManagerContainer
        initialCars={cars}
        tenantSlug={tenantSlug}
        tenantName={targetTenant.business_name || tenantSlug}
        siteUrl={siteUrl}
      />
    </div>
  );
}
