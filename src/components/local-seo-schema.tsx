import React from "react";
import { DealerTenant, LocalPageConfig } from "@/types/landing";

interface LocalSeoSchemaProps {
  tenant: DealerTenant;
  localPage: LocalPageConfig;
  canonicalUrl: string;
}

export function LocalSeoSchema({ tenant, localPage, canonicalUrl }: LocalSeoSchemaProps) {
  const phone = tenant.contact?.phone || "";
  const address = tenant.location?.address || "";
  const city = tenant.location?.city || tenant.localSeo?.primaryLocation?.city || "";
  const postalCode = tenant.location?.postalCode || tenant.localSeo?.primaryLocation?.postalCode || "";
  const county = tenant.location?.county || tenant.localSeo?.primaryLocation?.county || "";
  const region = tenant.location?.region || tenant.localSeo?.primaryLocation?.region || "";
  const logoUrl = tenant.logoUrl || tenant.branding?.logoUrl || "";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${canonicalUrl}#dealer`,
    name: tenant.businessName,
    description: localPage.seo?.metaDescription || tenant.businessDescription || undefined,
    url: canonicalUrl,
    telephone: phone,
    logo: logoUrl ? logoUrl : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: address || undefined,
      addressLocality: city || undefined,
      postalCode: postalCode || undefined,
      addressCounty: county || undefined,
      addressRegion: region || undefined,
      addressCountry: "PL",
    },
    areaServed: tenant.localSeo?.serviceAreas?.map((sa) => ({
      "@type": "AdministrativeArea",
      name: sa.city,
    })) || [{ "@type": "City", name: localPage.city }],
    priceRange: "$$",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tenant.businessName,
        item: tenant.customDomain ? `https://${tenant.customDomain}` : `https://vroomdealer.pl/${tenant.slug}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Skup aut",
        item: `${tenant.customDomain ? `https://${tenant.customDomain}` : `https://vroomdealer.pl/${tenant.slug}`}/skup-aut`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: localPage.city,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
