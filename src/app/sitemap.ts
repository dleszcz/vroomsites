import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllTenants, getCars } from "@/lib/data";
import { tenantToTenant, resolveTenant } from "@/lib/tenant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";
  const reqHeaders = await headers();
  const host = reqHeaders.get("host")?.split(":")[0].toLowerCase().replace(/^www\./, "");

  // ── CASE 1: Custom Domain Sitemap (e.g. d-car.com.pl) ──
  if (host && !host.includes("localhost") && !host.includes("vroomdealer.pl") && !host.includes("vercel.app")) {
    const tenant = await resolveTenant({ domain: host });
    if (tenant) {
      const tenantBaseUrl = `https://${tenant.customDomain || host}`;

      const homeUrl: MetadataRoute.Sitemap = [
        {
          url: tenantBaseUrl,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        },
      ];

      const localPages: MetadataRoute.Sitemap = (tenant.localSeo?.localPages || [])
        .filter((lp) => lp.enabled && lp.indexable)
        .map((lp) => ({
          url: `${tenantBaseUrl}/${lp.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        }));

      const cars = await getCars(tenant.id);
      const carPages: MetadataRoute.Sitemap = cars
        .filter((car) => !car.is_sold)
        .map((car) => ({
          url: `${tenantBaseUrl}/${car.slug}`,
          lastModified: new Date(car.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));

      return [...homeUrl, ...localPages, ...carPages];
    }
  }

  // ── CASE 2: Main SaaS Platform Sitemap (vroomdealer.pl) ──
  const rawTenants = await getAllTenants();
  const tenants = rawTenants.filter(
    (p) => (p as unknown as { is_published?: boolean }).is_published !== false
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const dealerPages: MetadataRoute.Sitemap = tenants
    .filter((p) => !p.custom_domain)
    .map((tenant) => ({
      url: `${baseUrl}/${tenant.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  const localSeoPages: MetadataRoute.Sitemap = [];
  for (const tenant of tenants) {
    if (tenant.custom_domain) continue; // Custom domains serve their own isolated sitemaps
    const parsedTenant = tenantToTenant(tenant);

    if (parsedTenant.localSeo?.localPages) {
      for (const localPage of parsedTenant.localSeo.localPages) {
        if (localPage.enabled && localPage.indexable) {
          localSeoPages.push({
            url: `${baseUrl}/${parsedTenant.slug}/${localPage.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.85,
          });
        }
      }
    }
  }

  return [...staticPages, ...dealerPages, ...localSeoPages];
}
