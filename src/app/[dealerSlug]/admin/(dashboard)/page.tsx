import { redirect } from "next/navigation";
import { getAdminBasePath } from "@/lib/admin-utils";
import { getCurrentTenant } from "@/app/[dealerSlug]/admin/actions";

export default async function AdminPage() {
  const tenant = await getCurrentTenant();
  const basePath = await getAdminBasePath();
  
  if (!tenant) redirect(`${basePath}/admin/login`);

  if (tenant.is_super_admin && tenant.slug === "superadmin") {
    redirect(`${basePath}/admin/settings`);
  } else {
    redirect(`${basePath}/admin/settings`);
  }
}
