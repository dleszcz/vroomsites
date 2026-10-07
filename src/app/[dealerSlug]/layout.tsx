import { notFound } from "next/navigation";
import { resolveTenant } from "@/lib/tenant";

export default async function DealerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dealerSlug: string }>;
}) {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) {
    notFound();
  }

  return children;
}
