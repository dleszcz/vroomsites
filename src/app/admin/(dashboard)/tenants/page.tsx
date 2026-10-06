import { getCurrentTenant, getAllTenants } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateTenantModal } from "@/components/admin/create-tenant-modal";
import { headers } from "next/headers";

export const metadata = {
  title: "Zarządzanie Komisami (SaaS) | Panel Admina",
};

export default async function AdminTenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const currentTenant = await getCurrentTenant();
  if (!currentTenant) redirect("/admin/login");

  if (!currentTenant.is_super_admin) {
    redirect("/admin/leads");
  }

  const { created } = await searchParams;
  const tenants = await getAllTenants();
  
  const headersList = await headers();
  const host = headersList.get("host") || "vroomdealer.pl";

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏢 Lista Komisów Samochodowych (Tenanci)</h1>
          <p style={styles.subtitle}>
            Zarządzaj wszystkimi uruchomionymi komisami na platformie VroomDealer SaaS
          </p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.badge}>
            {tenants.length} aktywne komisy
          </div>
          <CreateTenantModal host={host} />
        </div>
      </div>

      {created && (
        <div style={styles.createdBanner}>
          🎉 Pomyślnie utworzono nowy komis <strong>/{created}</strong>! Możesz go teraz skonfigurować lub otworzyć jego stronę.
        </div>
      )}

      {tenants.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>Brak dodanych komisów</h3>
          <p>Kliknij przycisk „Dodaj Nowy Komis”, aby utworzyć pierwszy profil komisu samochodowego.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {tenants.map((t) => (
            <div key={t.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>{t.business_name || t.slug}</div>
                  <div style={styles.slugBadge}>{host}/{t.slug}</div>
                </div>
                <div style={styles.activeDot} title="Aktywny komis" />
              </div>

              <div style={styles.cardBody}>
                {t.custom_domain ? (
                  <p style={styles.detailRow}>
                    <strong>🌐 Domena podpięta:</strong>{" "}
                    <a
                      href={`https://${t.custom_domain}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.domainLink}
                    >
                      {t.custom_domain} ↗
                    </a>
                  </p>
                ) : (
                  <p style={styles.detailRow}>
                    <strong>🌐 Własna domena:</strong> <span style={{ color: "#64748b" }}>Brak (używa {host}/{t.slug})</span>
                  </p>
                )}
                {t.contact_phone && (
                  <p style={styles.detailRow}>
                    <strong>📞 Telefon:</strong> {t.contact_phone}
                  </p>
                )}
                {t.notification_email && (
                  <p style={styles.detailRow}>
                    <strong>✉️ Powiadomienia:</strong> {t.notification_email}
                  </p>
                )}
                {t.city && (
                  <p style={styles.detailRow}>
                    <strong>📍 Miasto:</strong> {t.city}
                  </p>
                )}
              </div>

              <div style={styles.cardFooter}>
                <a
                  href={`/${t.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.viewSiteBtn}
                >
                  🔗 Wizytówka Live ↗
                </a>

                <Link
                  href={`/admin/leads?tenant=${t.slug}`}
                  style={styles.leadsBtn}
                >
                  📋 Leady
                </Link>

                <Link
                  href={`/admin/settings?tenant=${t.slug}`}
                  style={styles.manageBtn}
                >
                  ⚙️ Edytuj
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 4px",
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
  createdBanner: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#a7f3d0",
    fontSize: "14px",
    marginBottom: "24px",
  },
  emptyState: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px dashed rgba(148, 163, 184, 0.2)",
    borderRadius: "16px",
    padding: "48px",
    textAlign: "center",
    color: "#94a3b8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 4px",
  },
  slugBadge: {
    color: "#10b981",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  activeDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#10b981",
    boxShadow: "0 0 8px #10b981",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  detailRow: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0",
  },
  domainLink: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "600",
  },
  cardFooter: {
    display: "flex",
    gap: "8px",
    paddingTop: "14px",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  },
  viewSiteBtn: {
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    flex: 1,
  },
  leadsBtn: {
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    color: "#10b981",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    flex: 1,
  },
  manageBtn: {
    background: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    color: "#fbbf24",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    flex: 1,
  },
};
