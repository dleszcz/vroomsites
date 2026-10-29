"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DealerTenant, HeroConfig, SectionConfig, hasCarBuying } from "@/types/landing";
import { Car } from "@/types/database";
import { trackEvent } from "@/lib/analytics";
import { getTenantUrl } from "@/lib/urls";
import { QuickVehicleSearch } from "@/components/public/quick-vehicle-search";

interface HeroSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
  cars?: Car[];
  isCustomDomain?: boolean;
}

export function HeroSection({ tenant, config, cars = [], isCustomDomain }: HeroSectionProps) {
  const data = (config?.data || {}) as HeroConfig;
  const heroImage = data.image || tenant.branding.media?.heroImageUrl || "/images/default-hero.webp";
  const isLocalOrKnownRemote =
    heroImage.startsWith("/") ||
    heroImage.includes("supabase.co") ||
    heroImage.includes("unsplash.com") ||
    heroImage.includes("olxcdn.com") ||
    heroImage.includes("wikimedia.org");
  const carBuying = hasCarBuying(tenant);

  const vehiclesHref = getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain);
  const vehiclesAnchorHref = "#vehicles";
  const contactHref = getTenantUrl(tenant.slug, "/#footer", tenant.customDomain, isCustomDomain);

  // Hero is standard sales-first for every dealer; skup is highlighted if configured
  const cityName = tenant.location?.city;
  const locativeCity = cityName
    ? cityName.endsWith("ka")
      ? `${cityName.slice(0, -2)}ce`
      : cityName.endsWith("a")
        ? `${cityName.slice(0, -1)}ie`
        : cityName
    : null;

  const isOldSkupTitle = tenant.branding.heroTitle?.toLowerCase().includes("sprzedaj nam");
  const heroTitle =
    data.title ||
    (!isOldSkupTitle && tenant.branding.heroTitle) ||
    (locativeCity ? `Sprawdzone samochody używane w ${locativeCity}` : "Sprawdzone samochody używane z gwarancją");

  const isOldSkupSubtitle = tenant.branding.heroSubtitle?.toLowerCase().includes("zbędnych formalności");
  const defaultSubtitle = carBuying
    ? `Zweryfikowane pojazdy od ręki na placu w ${locativeCity || "naszym komisie"}. Prowadzimy również skup za gotówkę.`
    : `Zweryfikowane pojazdy od ręki w ${locativeCity || "naszym salonie"} z udokumentowaną historią.`;
  const heroDescription =
    data.description ||
    (!isOldSkupSubtitle && tenant.branding.heroSubtitle) ||
    defaultSubtitle;

  const primaryHref = data.primaryCta?.href || vehiclesAnchorHref;
  const primaryLabel =
    data.primaryCta?.label ||
    (cars.length > 0 ? `Zobacz ofertę (${cars.length})` : "Zobacz samochody na sprzedaż");

  const secondaryHref =
    data.secondaryCta?.href ||
    (carBuying ? getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain) : contactHref);
  const secondaryLabel =
    data.secondaryCta?.label || (carBuying ? "Sprzedaj lub zamień auto" : "Skontaktuj się z nami");

  return (
    <section id="hero" className="dealer-hero pb-4 sm:pb-6">
      {heroImage && (
        <div className="dealer-hero__media" aria-hidden="true">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={85}
            className="dealer-hero__image"
            unoptimized={!isLocalOrKnownRemote}
          />
        </div>
      )}
      <div className="vd-container relative z-10 flex flex-col justify-between pt-5 sm:pt-7 md:pt-8">
        <div className="dealer-hero__copy mb-3 sm:mb-4">
          <h1 className="dealer-hero__title">
            {heroTitle}
          </h1>
          <p className="dealer-hero__description">
            {heroDescription}
          </p>

          <div className="dealer-hero__actions">
            <Link
              className="vd-button vd-button--primary dealer-hero__button shadow-sm"
              href={primaryHref}
              style={{
                background: tenant.branding.colors.primary || "var(--color-primary)",
                color: "#ffffff",
              }}
            >
              <span>{primaryLabel}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" strokeWidth={2.2} />
            </Link>
            <Link
              className="vd-button dealer-hero__button border border-white/60 hover:border-white text-white hover:bg-white hover:text-zinc-950 font-semibold transition-all duration-150 backdrop-blur-xs shadow-xs"
              href={secondaryHref}
              onClick={() => carBuying && trackEvent("lead_form_started", { source: "hero_skup_link", dealer_id: tenant.id })}
            >
              <span>{secondaryLabel}</span>
            </Link>
          </div>
        </div>

        {/* Quick Vehicle Search bar anchored at bottom of Hero */}
        {cars.length > 0 && (
          <div className="w-full mt-1 sm:mt-2">
            <QuickVehicleSearch tenant={tenant} cars={cars} isCustomDomain={isCustomDomain} />
          </div>
        )}
      </div>
    </section>
  );
}
