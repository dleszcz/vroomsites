import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenant, getCar, getCars } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { CarGallery } from "@/components/car-gallery";
import { CarSpecs } from "@/components/car-specs";
import { VehicleSchema } from "@/components/vehicle-schema";
import { ContactBar } from "@/components/contact-bar";
import { TrackVehicleView } from "@/components/track-vehicle-view";
import { resolveTenant } from "@/lib/tenant";
import { LocalSeoPage } from "@/components/local-seo-page";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { SingleCarPage } from "@/components/single-car-page";
import { InventoryPage } from "@/components/inventory-page";
import { LegalPage } from "@/components/legal-page";

type Props = {
  params: Promise<{ dealerSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug, slug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) return {};

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${dealerSlug}`;
  const canonicalUrl = `${baseUrl}/${slug}`;
  const heroImage = tenant.branding.media?.heroImageUrl;
  const ogImageUrl = heroImage
    ? heroImage.startsWith("http")
      ? heroImage
      : `${baseUrl}${heroImage}`
    : undefined;
  const themeColor =
    tenant.branding.colors.headerBg || tenant.branding.colors.primary || "#080808";

  // Helper for generating full social metadata
  const buildMetadata = (
    title: string,
    description: string,
    imageUrl?: string,
    isIndexable = true
  ): Metadata => {
    const finalOgImage = imageUrl || ogImageUrl;
    return {
      title,
      description,
      icons: {
        icon: tenant.branding.faviconUrl && tenant.branding.faviconUrl !== "/icon" ? tenant.branding.faviconUrl : `/api/icon?tenant=${dealerSlug}`,
        shortcut: tenant.branding.faviconUrl && tenant.branding.faviconUrl !== "/icon" ? tenant.branding.faviconUrl : `/api/icon?tenant=${dealerSlug}`,
        apple: tenant.branding.faviconUrl && tenant.branding.faviconUrl !== "/icon" ? tenant.branding.faviconUrl : `/api/icon?tenant=${dealerSlug}`,
      },
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: tenant.businessName,
        locale: "pl_PL",
        type: "website",
        images: finalOgImage
          ? [{ url: finalOgImage, width: 1200, height: 630, alt: title }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: finalOgImage ? [finalOgImage] : [],
      },
      robots: {
        index: isIndexable,
        follow: true,
      },
      other: {
        "fb:app_id": process.env.NEXT_PUBLIC_FB_APP_ID || "",
      },
    };
  };

  // 1. Check if slug matches a Local SEO page
  const localPage = tenant.localSeo?.localPages?.find((lp) => lp.slug === slug);
  if (localPage) {
    if (!localPage.enabled) {
      return { title: "Not Found", robots: { index: false, follow: false } };
    }

    const title = (
      localPage.seo?.title || `Skup aut ${localPage.city} | ${tenant.businessName}`
    ).replace(/—|–/g, "-");
    const description = (
      localPage.seo?.metaDescription ||
      `Skup samochodów za gotówkę w ${localPage.city}. Bezpłatna wycena online, szybki dojazd i natychmiastowa płatność.`
    ).replace(/—|–/g, "-");

    return buildMetadata(title, description, undefined, localPage.indexable);
  }

  // 2. Service subpages: /skup-aut, /samochody, /kontakt, /o-nas
  if (slug === "skup-aut") {
    const title = `Skup aut za gotówkę | ${tenant.businessName}`;
    const description = `Profesjonalny i bezpieczny skup aut w ${
      tenant.location?.city || "Twojej okolicy"
    }. Bezpłatna wycena online, dojazd do klienta i płatność gotówką od ręki.`;
    return buildMetadata(title, description);
  }

  if (slug === "samochody") {
    const title = `Samochody używane na sprzedaż | ${tenant.businessName}`;
    const description = `Sprawdź pełną ofertę sprawdzonych samochodów używanych z gwarancją w ${tenant.businessName}. Pewne auta ze sprawdzoną historią.`;
    return buildMetadata(title, description);
  }

  if (slug === "kontakt") {
    const title = `Kontakt | ${tenant.businessName}`;
    const description = `Skontaktuj się z ${tenant.businessName}. Telefon: ${
      tenant.contact.phone || ""
    }, Adres: ${tenant.location?.address || ""}, ${tenant.location?.city || ""}.`;
    return buildMetadata(title, description);
  }

  if (slug === "o-nas") {
    const title = `O nas | ${tenant.businessName}`;
    const description = `Poznaj ${tenant.businessName} - lokalny skup aut i komis samochodowy z wieloletnim doświadczeniem w uczciwym skupie pojazdów.`;
    return buildMetadata(title, description);
  }

  // 2b. Legal pages
  if (slug === "polityka-prywatnosci") {
    const title = `Polityka prywatności | ${tenant.businessName}`;
    const description = `Polityka prywatności serwisu ${tenant.businessName}. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.`;
    return buildMetadata(title, description, undefined, false);
  }

  if (slug === "regulamin") {
    const title = `Regulamin | ${tenant.businessName}`;
    const description = `Regulamin korzystania z serwisu internetowego ${tenant.businessName}.`;
    return buildMetadata(title, description, undefined, false);
  }

  // 3. Check if slug matches a car listing
  const tenant = await getTenant(dealerSlug);
  const car = await getCar(slug);

  if (!tenant || !car) return {};

  const carName = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}`;
  const priceStr = car.price ? `${formatPrice(car.price)} PLN` : "Zapytaj o cenę";
  const title = `${carName} - ${priceStr} | ${tenant.business_name}`;
  const description = `${carName}${
    car.mileage ? `, ${car.mileage.toLocaleString("pl-PL")} km` : ""
  }${
    car.fuel_type ? `, ${car.fuel_type}` : ""
  }. Sprawdź ogłoszenie, wyposażenie i stan techniczny w ${tenant.business_name}${
    tenant.city ? `, ${tenant.city}` : ""
  }.`;

  const carImage = car.images?.[0]
    ? car.images[0].startsWith("http")
      ? car.images[0]
      : `${baseUrl}${car.images[0]}`
    : undefined;

  return buildMetadata(title, description, carImage);
}

export default async function DynamicSlugPage({ params }: Props) {
  const { dealerSlug, slug } = await params;
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

  // 1. Check if slug is a Local SEO Page
  const localPage = tenant.localSeo?.localPages?.find((lp) => lp.slug === slug);
  if (localPage) {
    if (!localPage.enabled) {
      notFound();
    }
    return <LocalSeoPage tenant={tenant} localPage={localPage} baseUrl={baseUrl} isCustomDomain={isCustomDomain} />;
  }

  // 2. Subpages handling
  if (slug === "skup-aut") {
    return <SectionRenderer tenant={tenant} mode="skup-aut" isCustomDomain={isCustomDomain} />;
  }

  if (slug === "samochody") {
    const allCars = await getCars(tenant.id);
    return <InventoryPage tenant={tenant} cars={allCars} isCustomDomain={isCustomDomain} />;
  }

  if (["kontakt", "o-nas"].includes(slug)) {
    return <SectionRenderer tenant={tenant} mode="all" isCustomDomain={isCustomDomain} />;
  }

  // 2b. Legal pages
  if (slug === "polityka-prywatnosci") {
    return <LegalPage tenant={tenant} type="privacy" />;
  }

  if (slug === "regulamin") {
    return <LegalPage tenant={tenant} type="terms" />;
  }

  // 3. Check if slug is a Car Listing
  const [tenant, car, allCars] = await Promise.all([
    getTenant(dealerSlug),
    getCar(slug),
    getCars(tenant.id),
  ]);

  if (!tenant || !car) {
    notFound();
  }

  const pageUrl = `${baseUrl}/${slug}`;
  const relatedCars = allCars.filter(
    (c) => String(c.id) !== String(car.id) && c.slug !== car.slug && !c.is_sold
  );

  return (
    <>
      <VehicleSchema
        car={car}
        dealerName={tenant.business_name}
        url={pageUrl}
      />
      <SingleCarPage tenant={tenant} car={car} relatedCars={relatedCars} isCustomDomain={isCustomDomain} />
      <TrackVehicleView car={car} />
    </>
  );
}
