import { redirect } from "next/navigation";
import { getCurrentTenant, getAllTenants } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Panel Admina | VroomDealer",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    redirect("/admin/login");
  }

  const isSuperAdmin = Boolean(tenant.is_super_admin);
  const allTenants = isSuperAdmin ? await getAllTenants() : [];

  return (
    <div style={layoutStyles.wrapper}>
      <AdminSidebar
        businessName={tenant.business_name}
        slug={tenant.slug}
        isSuperAdmin={isSuperAdmin}
        allTenants={allTenants.map((t) => ({
          slug: t.slug,
          businessName: t.business_name,
          customDomain: t.custom_domain,
        }))}
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
    minHeight: "100vh",
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
};
