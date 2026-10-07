import { getAdminBasePath } from "@/lib/admin-utils";
import { getCurrentTenant } from "@/app/[dealerSlug]/admin/actions";
import { redirect } from "next/navigation";

import Link from "next/link";
export const metadata = {
  title: "Konfiguracja Platformy VroomDealer | Panel Admina",
};

export default async function AdminPlatformPage() {
  const currentTenant = await getCurrentTenant();
  const basePath = await getAdminBasePath();
  
  if (!currentTenant) redirect(`${basePath}/admin/login`);

  if (!currentTenant.is_super_admin) {
    redirect(`${basePath}/admin/login`);
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🌐 Konfiguracja Platformy SaaS (VroomDealer.pl)</h1>
          <p style={styles.subtitle}>
            Zarządzaj stroną główną platformy, ofertą handlową i cennikiem dla nowych komisów
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🚀 Strona Główna VroomDealer.pl</h3>
        <p style={styles.cardDesc}>
          Główny portal sprzedażowy B2B VroomDealer.pl generuje leady od właścicieli komisów samochodowych.
        </p>

        <div style={styles.infoBox}>
          <strong>Status Środowiska:</strong> Aktywne (VroomDealer SaaS Multi-tenant v1.2.0)
          <br />
          <strong>Główny Serwer:</strong> `https://vroomdealer.pl` (z obsługą domen `*.vroomdealer.pl` oraz własnych domen klientów).
        </div>

        <div style={styles.sectionDivider} />

        <div style={styles.quickLinksGrid}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={styles.linkButton}
          >
            🌐 Otwórz stronę główną VroomDealer.pl ↗
          </a>
          <Link
            href={`${getAdminBasePath()}/admin/tenants`}
            style={styles.linkButtonAccent}
          >
            🏢 Przejdź do zarządzania komisami ➔
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: "24px",
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
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "16px",
    padding: "28px",
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  cardDesc: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0 0 20px",
  },
  infoBox: {
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "10px",
    padding: "16px",
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  sectionDivider: {
    height: "1px",
    background: "rgba(148, 163, 184, 0.1)",
    margin: "24px 0",
  },
  quickLinksGrid: {
    display: "flex",
    gap: "12px",
  },
  linkButton: {
    background: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    color: "#60a5fa",
    borderRadius: "10px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
  },
  linkButtonAccent: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
  },
};
