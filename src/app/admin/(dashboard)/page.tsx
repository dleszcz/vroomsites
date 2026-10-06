import { redirect } from "next/navigation";
import { getCurrentTenant } from "@/app/admin/actions";

export default async function AdminPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) redirect("/admin/login");

  if (tenant.is_super_admin) {
    redirect("/admin/tenants");
  } else {
    redirect("/admin/leads");
  }
}
