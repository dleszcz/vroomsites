import { getAdminBasePath } from "@/lib/admin-utils";
import { getCurrentTenant, getAdminCars, getTenantBySlug } from "@/app/[dealerSlug]/admin/actions";
import { CarsManager } from "@/components/admin/cars-manager";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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

  // Don't render if superadmin and no tenant selected
  if (isSuperAdmin && dealerSlug === "superadmin") {
    return (
      <div style={{ padding: 0 }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>
          Oferta Samochodów
        </h1>
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>
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

  return (
      <div style={{ padding: 0 }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
          Oferta Samochodów
        </h1>
        <a
          href={`${siteUrl}/samochody`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#60a5fa",
            fontSize: "13px",
            fontWeight: "500",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          <svg style={{ width: "14px", height: "14px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Podgląd oferty na stronie komisu
        </a>
      </div>

      <CarsManager cars={cars} tenantSlug={tenantSlug} tenantName={tenantSlug} siteUrl={siteUrl} />
    </div>
  );
}
