"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

interface TenantItem {
  slug: string;
  businessName: string;
  customDomain?: string | null;
}

interface AdminSidebarProps {
  businessName: string;
  slug: string;
  isSuperAdmin?: boolean;
  allTenants?: TenantItem[];
}

export function AdminSidebar({
  businessName,
  slug,
  isSuperAdmin = false,
  allTenants = [],
}: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTenantParam = searchParams.get("tenant");

  // Determine active context
  const activeTenant = isSuperAdmin && activeTenantParam && activeTenantParam !== "all"
    ? allTenants.find((t) => t.slug === activeTenantParam) || { slug: activeTenantParam, businessName: activeTenantParam }
    : null;

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandSection}>
        <div style={styles.brandIcon}>🚗</div>
        <div>
          <div style={styles.brandName}>
            VroomDealer
            {isSuperAdmin && <span style={styles.crownBadge} title="Konto Superadmina">👑</span>}
          </div>
          <div style={styles.brandSub}>
            {isSuperAdmin ? "Panel Właściciela SaaS" : businessName}
          </div>
        </div>
      </div>

      {/* Superadmin Context Switcher Dropdown */}
      {isSuperAdmin && (
        <div style={styles.switcherBox}>
          <label style={styles.switcherLabel}>🏢 KONTEKST ZARZĄDZANIA</label>
          <select
            value={activeTenantParam || "all"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "all") {
                window.location.href = "/admin/tenants";
              } else {
                window.location.href = `/admin/leads?tenant=${val}`;
              }
            }}
            style={styles.switcherSelect}
          >
            <option value="all">🌐 Widok SaaS (Wszystkie komisy)</option>
            <optgroup label="── Poszczególne Komisy ──">
              {allTenants.map((t) => (
                <option key={t.slug} value={t.slug}>
                  🏢 {t.businessName || t.slug}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      )}

      {/* Navigation Groups */}
      <nav style={styles.nav}>
        {/* SECTION 1: Superadmin SaaS Navigation */}
        {isSuperAdmin && (
          <div style={styles.group}>
            <div style={styles.groupTitle}>PLATFORMA SAAS</div>
            <Link
              href="/admin/tenants"
              style={{
                ...styles.navItem,
                ...(pathname.startsWith("/admin/tenants") ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>🏢</span>
              <span>Lista Komisów</span>
            </Link>

            <Link
              href="/admin/leads?tenant=all"
              style={{
                ...styles.navItem,
                ...(pathname.startsWith("/admin/leads") && activeTenantParam === "all" ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>📊</span>
              <span>Wszystkie Leady</span>
            </Link>

            <Link
              href="/admin/platform"
              style={{
                ...styles.navItem,
                ...(pathname.startsWith("/admin/platform") ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>🌐</span>
              <span>Strona VroomDealer</span>
            </Link>
          </div>
        )}

        {/* SECTION 2: Active Tenant Management (Only shown when a tenant is selected or for regular dealer) */}
        {(!isSuperAdmin || activeTenant) && (
          <div style={styles.group}>
            <div style={styles.groupTitle}>
              {activeTenant
                ? `WYBRANY KOMIS: ${activeTenant.businessName.toUpperCase()}`
                : "ZARZĄDZANIE KOMISEM"}
            </div>

            <Link
              href={
                activeTenant
                  ? `/admin/leads?tenant=${activeTenant.slug}`
                  : "/admin/leads"
              }
              style={{
                ...styles.navItem,
                ...(pathname.startsWith("/admin/leads") && activeTenantParam !== "all" ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>📋</span>
              <span>Leady Komisu</span>
            </Link>

            <Link
              href={
                activeTenant
                  ? `/admin/cars?tenant=${activeTenant.slug}`
                  : "/admin/cars"
              }
              style={{
                ...styles.navItem,
                ...(pathname.startsWith("/admin/cars") ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>🚗</span>
              <span>Oferta Samochodów</span>
            </Link>

            <Link
              href={
                activeTenant
                  ? `/admin/settings?tenant=${activeTenant.slug}`
                  : "/admin/settings"
              }
              style={{
                ...styles.navItem,
                ...(pathname.startsWith("/admin/settings") ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>⚙️</span>
              <span>Ustawienia Komisu</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        {(activeTenant || !isSuperAdmin) && (
          <a
            href={activeTenant ? `/${activeTenant.slug}` : `/${slug}`}
            target="_blank"
            rel="noreferrer"
            style={styles.liveSiteLink}
          >
            🔗 Podgląd wizytówki ({activeTenant ? activeTenant.slug : slug}) ↗
          </a>
        )}

        <button onClick={() => signOut()} style={styles.logoutBtn}>
          🚪 Wyloguj się
        </button>
        <div style={styles.poweredBy}>VroomDealer SaaS Engine</div>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: "270px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    borderRight: "1px solid rgba(148, 163, 184, 0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "sticky",
    top: 0,
    flexShrink: 0,
  },
  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
    paddingBottom: "16px",
  },
  brandIcon: {
    fontSize: "32px",
  },
  brandName: {
    color: "#f1f5f9",
    fontSize: "17px",
    fontWeight: "800",
    lineHeight: "1.2",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    letterSpacing: "-0.3px",
  },
  crownBadge: {
    fontSize: "14px",
  },
  brandSub: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "500",
    marginTop: "2px",
  },
  switcherBox: {
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "12px",
    padding: "10px 12px",
    marginBottom: "20px",
  },
  switcherLabel: {
    color: "#10b981",
    fontSize: "10px",
    fontWeight: "800",
    display: "block",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },
  switcherSelect: {
    width: "100%",
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "8px",
    color: "#f1f5f9",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  groupTitle: {
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.8px",
    padding: "0 12px 6px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.15s ease",
  },
  navItemActive: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10b981",
    fontWeight: "700",
  },
  navIcon: {
    fontSize: "16px",
  },
  footer: {
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "16px",
  },
  liveSiteLink: {
    display: "block",
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
  },
  poweredBy: {
    textAlign: "center",
    color: "#475569",
    fontSize: "11px",
  },
};
