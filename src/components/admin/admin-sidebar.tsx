"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/[dealerSlug]/admin/actions";

interface TenantItem {
  slug: string;
  businessName: string;
  customDomain?: string | null;
}

interface AdminSidebarProps {
  businessName: string;
  slug: string;
  basePath?: string;
  isSuperAdmin?: boolean;
  userEmail?: string;
  targetLogoUrl?: string | null;
  allTenants?: TenantItem[];
  siteUrl?: string;
}

export function AdminSidebar({
  businessName,
  slug,
  basePath = "",
  isSuperAdmin = false,
  userEmail,
  targetLogoUrl,
  siteUrl,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={styles.sidebar}>
      {/* User Info Header */}
      <div style={styles.userSection}>
        <div style={styles.userAvatar}>
          {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userEmail}>{userEmail || "Administrator"}</div>
          {isSuperAdmin ? (
            <div style={styles.superAdminBadge}>Super Administrator</div>
          ) : (
            <div style={styles.roleText}>Właściciel Komisu</div>
          )}
        </div>
      </div>

      {/* Target Tenant Header */}
      <div style={styles.brandSection}>
        {targetLogoUrl ? (
          <img src={targetLogoUrl} alt={businessName} style={styles.tenantLogo} />
        ) : (
          <div style={styles.brandIcon}>
            {businessName ? businessName.charAt(0).toUpperCase() : "C"}
          </div>
        )}
        <div style={styles.brandInfo}>
          <div style={styles.brandLabel}>ZARZĄDZASZ KOMISEM</div>
          <div style={styles.brandName}>{businessName}</div>
          <div style={styles.brandSlug}>ID: {slug}</div>
          <a
            href={siteUrl || `/${slug}`}
            target="_blank"
            rel="noreferrer"
            style={{...styles.liveSiteLink, marginTop: "12px", display: "inline-flex"}}
          >
            <svg style={{ width: "14px", height: "14px", flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            {siteUrl ? siteUrl.replace(/^https?:\/\//, '') : `/${slug}`}
          </a>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav style={styles.nav}>
        <div style={styles.group}>


          <Link
            href={`${basePath}/admin/settings`}
            style={{
              ...styles.navItem,
              ...(pathname.startsWith(`${basePath}/admin/settings`) ? styles.navItemActive : {}),
            }}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Konfiguracja Komisu</span>
          </Link>

          <Link
            href={`${basePath}/admin/cars`}
            style={{
              ...styles.navItem,
              ...(pathname.startsWith(`${basePath}/admin/cars`) ? styles.navItemActive : {}),
            }}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0"></path>
            </svg>
            <span>Oferta Samochodów</span>
          </Link>

          <Link
            href={`${basePath}/admin/leads`}
            style={{
              ...styles.navItem,
              ...(pathname.startsWith(`${basePath}/admin/leads`) ? styles.navItemActive : {}),
            }}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Skup (Leady)</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <button onClick={() => signOut()} style={styles.logoutBtn}>
          <svg style={{ width: "16px", height: "16px", flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Wyloguj się
        </button>
        <div style={styles.poweredBy}>VroomDealer Engine</div>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: "270px",
    height: "100vh",
    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    borderRight: "1px solid rgba(148, 163, 184, 0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    flexShrink: 0,
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    marginBottom: "8px",
  },
  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  userEmail: {
    color: "#f1f5f9",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  superAdminBadge: {
    color: "#10b981",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "2px",
  },
  roleText: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "500",
    marginTop: "2px",
  },
  brandSection: {
    background: "rgba(15, 23, 42, 0.4)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    marginBottom: "24px",
  },
  tenantLogo: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    objectFit: "contain",
    background: "#fff",
    padding: "2px",
  },
  brandIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
  },
  brandInfo: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  brandLabel: {
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "2px",
  },
  brandName: {
    color: "#f8fafc",
    fontSize: "15px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  brandSlug: {
    color: "#94a3b8",
    fontSize: "11px",
    fontFamily: "monospace",
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
    width: "20px",
    height: "20px",
    flexShrink: 0,
    opacity: 0.85,
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
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  poweredBy: {
    textAlign: "center",
    color: "#475569",
    fontSize: "11px",
  },
};
