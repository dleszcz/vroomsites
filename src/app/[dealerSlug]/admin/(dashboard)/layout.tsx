import { redirect } from "next/navigation";
import { getCurrentTenant, getAllTenants, getTenantBySlug } from "@/app/[dealerSlug]/admin/actions";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Panel Admina | VroomDealer",
  robots: { index: false, follow: false },
};

import { headers } from "next/headers";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dealerSlug: string }>;
}) {
  const tenant = await getCurrentTenant();

  const headersList = await headers();
  const { dealerSlug } = await params;
  const isCustomDomain = headersList.get("x-is-custom-domain") === "true";
  const basePath = isCustomDomain ? "" : `/${dealerSlug}`;

  // 1. User must be logged in
  if (!tenant) {
    redirect(`${basePath}/admin/login`);
  }

  const isSuperAdmin = Boolean(tenant.is_super_admin);

  // 2. Authorization: Only superadmin or the tenant owner can access this panel
  if (!isSuperAdmin && tenant.slug !== dealerSlug) {
    redirect(`/${tenant.slug}/admin`);
  }

  const allTenants = isSuperAdmin ? await getAllTenants() : [];

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const targetTenant = isSuperAdmin ? (await getTenantBySlug(dealerSlug)) || tenant : tenant;

  const targetBranding = targetTenant.branding as Record<string, string> | undefined;
  const targetLogoUrl = targetBranding?.logoUrl || null;

  const host = headersList.get("host") || "";
  const isLocalhost = host.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const siteUrl = !isLocalhost && targetTenant.custom_domain 
    ? `https://${targetTenant.custom_domain}` 
    : `${origin}/${targetTenant.slug}`;

  return (
    <div style={layoutStyles.wrapper}>
      <AdminSidebar
        businessName={targetTenant.business_name}
        slug={targetTenant.slug}
        basePath={basePath}
        isSuperAdmin={isSuperAdmin}
        userEmail={user?.email}
        targetLogoUrl={targetLogoUrl}
        allTenants={allTenants.map((t) => ({
          slug: t.slug,
          businessName: t.business_name,
          customDomain: t.custom_domain,
        }))}
        siteUrl={siteUrl}
      />
      <main style={layoutStyles.main}>
        <div style={layoutStyles.content}>{children}</div>
      </main>
    </div>
  );
}

const layoutStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: "#0f172a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  main: {
    flex: 1,
    overflow: "auto",
    background: "#0f172a",
  },
  content: {
    padding: "24px",
  },
};
