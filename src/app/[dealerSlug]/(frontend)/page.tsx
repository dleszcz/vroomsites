import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { resolveTenant } from "@/lib/tenant";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { DealerSchema } from "@/components/vehicle-schema";

type Props = {
  params: Promise<{ dealerSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) return {};

  const title = (
    tenant.seo?.metaTitle ||
    `${tenant.businessName} - Skup Aut i Sprzedaż Samochodów`
  ).replace(/—|–/g, "-");
  const description = (
    tenant.seo?.metaDescription ||
    tenant.businessDescription ||
    `Profesjonalny skup aut za gotówkę oraz sprawdzone samochody używane z gwarancją w ${tenant.businessName}. Bezpłatna wycena i dojazd.`
  ).replace(/—|–/g, "-");

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${dealerSlug}`;

  const heroImage = tenant.branding.media?.heroImageUrl;
  const ogImageUrl = heroImage
    ? heroImage.startsWith("http")
      ? heroImage
      : `${baseUrl}${heroImage}`
    : undefined;

  return {
    title: {
      absolute: title,
    },
    description,
    icons: {
      icon: tenant.branding.faviconUrl && tenant.branding.faviconUrl !== "/icon" ? tenant.branding.faviconUrl : `/api/icon?tenant=${dealerSlug}`,
      shortcut: tenant.branding.faviconUrl && tenant.branding.faviconUrl !== "/icon" ? tenant.branding.faviconUrl : `/api/icon?tenant=${dealerSlug}`,
      apple: tenant.branding.faviconUrl && tenant.branding.faviconUrl !== "/icon" ? tenant.branding.faviconUrl : `/api/icon?tenant=${dealerSlug}`,
    },
    alternates: { canonical: baseUrl },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: tenant.businessName,
      locale: "pl_PL",
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    other: {
      "fb:app_id": process.env.NEXT_PUBLIC_FB_APP_ID || "",
    },
  };
}

export async function generateViewport({ params }: Props): Promise<import("next").Viewport> {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });
  return {
    themeColor: tenant?.branding?.colors?.headerBg || tenant?.branding?.colors?.primary || "#080808",
  };
}

export default async function DealerPage({ params }: Props) {
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

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${tenant.slug}`;

  return (
    <>
      <DealerSchema
        name={tenant.businessName}
        description={tenant.businessDescription || undefined}
        address={tenant.location?.address || undefined}
        city={tenant.location?.city || undefined}
        phone={tenant.contact.phone || undefined}
        url={baseUrl}
      />

      <SectionRenderer tenant={tenant} isCustomDomain={isCustomDomain} />
    </>
  );
}
