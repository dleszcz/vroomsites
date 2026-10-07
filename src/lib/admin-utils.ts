import { headers } from "next/headers";

export async function getAdminBasePath() {
  const headersList = await headers();
  const isCustomDomain = headersList.get("x-is-custom-domain") === "true";
  const tenantSlug = headersList.get("x-tenant-slug") || "d-car";
  return isCustomDomain ? "" : `/${tenantSlug}`;
}
