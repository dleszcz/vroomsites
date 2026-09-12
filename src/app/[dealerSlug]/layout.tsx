import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant";
import { BrandProvider } from "@/components/brand-provider";
import { DealerHeader } from "@/components/dealer-header";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getTenantUrl } from "@/lib/urls";

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

  const reqHeaders = await headers();
  const host = (reqHeaders.get("host") || "").split(":")[0].toLowerCase().replace(/^www\./, "");
  const isCustomDomain =
    host !== "vroomdealer.pl" &&
    host !== "localhost" &&
    host !== "127.0.0.1" &&
    !host.endsWith(".vercel.app");

  const privacyUrl = getTenantUrl(tenant.slug, "/polityka-prywatnosci", tenant.customDomain, isCustomDomain);

  return (
    <BrandProvider branding={tenant.branding}>
      <ScrollToTop />
      <AnalyticsScripts tenant={tenant} />
      {tenant.analytics?.pixelId && <MetaPixel pixelId={tenant.analytics.pixelId} />}
      <div className="dealer-layout">
        <DealerHeader tenant={tenant} isCustomDomain={isCustomDomain} />
        <main className="dealer-main">{children}</main>
        <Footer tenant={tenant} isCustomDomain={isCustomDomain} />
      </div>
      <CookieConsent
        primaryColor={tenant.branding.colors.primary}
        privacyPolicyUrl={privacyUrl}
      />
    </BrandProvider>
  );
}
