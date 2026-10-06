import { getCurrentTenant, getAdminCars } from "@/app/admin/actions";
import { CarsManager } from "@/components/admin/cars-manager";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ tenant?: string }>;
};

export default async function AdminCarsPage({ searchParams }: Props) {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const isSuperAdmin = Boolean(tenant.is_super_admin);
  const tenantSlug = isSuperAdmin && params.tenant ? params.tenant : tenant.slug;

  // Don't render if superadmin and no tenant selected
  if (isSuperAdmin && !params.tenant) {
    return (
      <div style={{ padding: "40px 0" }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>
          🚗 Oferta Samochodów
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

  const cars = await getAdminCars(tenantSlug);

  return (
    <div style={{ padding: "40px 0" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: "800", marginBottom: "6px" }}>
          🚗 Oferta Samochodów
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          Zarządzaj statusem aut w ofercie komisu <strong style={{ color: "#94a3b8" }}>{tenantSlug}</strong>. 
          Kliknij przycisk, aby oznaczyć auto jako sprzedane lub przywrócić je do oferty.
        </p>
      </div>

      <CarsManager cars={cars} tenantSlug={tenantSlug} tenantName={tenantSlug} />
    </div>
  );
}
