import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant";
import { CustomNotFound } from "@/components/custom-not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strona nie istnieje",
  description: "Przepraszamy, ale strona której szukasz nie istnieje.",
};

export default async function NotFound() {
  const headersList = await headers();
  const tenantSlug = headersList.get("x-tenant-slug");

  if (tenantSlug) {
    const tenant = await resolveTenant({ slug: tenantSlug });
    if (tenant) {
      return (
        <CustomNotFound
          tenantSlug={tenant.slug}
          businessName={tenant.businessName}
          phone={tenant.contact.phone || undefined}
        />
      );
    }
  }

  return <CustomNotFound />;
}
