"use client";

import React from "react";
import Link from "next/link";
import { Banknote, ClipboardCheck, Scale, Truck } from "lucide-react";
import { DealerTenant, HeroConfig, SectionConfig, hasCarBuying } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

import { getTenantUrl } from "@/lib/urls";

interface HeroSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
  isCustomDomain?: boolean;
}

const iconMap = { cash: Banknote, check: ClipboardCheck, truck: Truck, scale: Scale };

export function HeroSection({ tenant, config, isCustomDomain }: HeroSectionProps) {
  const data = (config?.data || {}) as HeroConfig;
  const heroImage = data.image || tenant.branding.media?.heroImageUrl || "";
  const carBuying = hasCarBuying(tenant);
  const benefits = data.benefits?.length ? data.benefits : carBuying ? [
    { label: "Gotówka od ręki", icon: "cash" },
    { label: "Auta w każdym stanie (sprawne / powypadkowe)", icon: "check" },
    { label: "Bezpłatna wycena", icon: "check" },
    { label: "Auto w rozliczeniu", icon: "cash" },
    { label: "Darmowa laweta & odbiór", icon: "truck" },
    { label: "Formalności po naszej stronie", icon: "scale" },
  ] : [
    { label: "Sprawdzone auta z historią", icon: "check" },
    { label: "Jazda próbna od ręki", icon: "check" },
    { label: "Finansowanie i leasing", icon: "cash" },
    { label: "Formalności po naszej stronie", icon: "scale" },
  ];

  const vehiclesHref = getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain);
  const contactHref = getTenantUrl(tenant.slug, "/#footer", tenant.customDomain, isCustomDomain);
  const primaryHref = data.primaryCta?.href || (carBuying ? getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain) : vehiclesHref);
  const secondaryHref = data.secondaryCta?.href || (carBuying ? vehiclesHref : contactHref);
  const primaryLabel = data.primaryCta?.label || (carBuying ? "Sprzedaj auto" : "Zobacz samochody");
  const primarySub = data.primaryCta?.sublabel || (carBuying ? "Bezpłatna wycena" : "Aktualna oferta");
  const secondaryLabel = data.secondaryCta?.label || (carBuying ? "Zobacz samochody" : "Skontaktuj się");
  const secondarySub = data.secondaryCta?.sublabel || (carBuying ? "Aktualna oferta" : "Umów jazdę próbną");

  return (
    <section id="hero" className="dealer-hero">
      {heroImage && <div className="dealer-hero__media" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />}
      <div className="vd-container dealer-hero__content">
        <div className="dealer-hero__copy">

          <h1 className="dealer-hero__title">{data.title || tenant.branding.heroTitle || (carBuying ? "Sprzedaj nam swoje auto" : `Znajdź swoje auto w ${tenant.businessName}`)}</h1>
          <p className="dealer-hero__description">{data.description || tenant.branding.heroSubtitle || (carBuying ? "Szybko, bezpiecznie i bez zbędnych formalności." : "Sprawdzone samochody używane w uczciwych cenach.")}</p>

          <div className="dealer-hero__actions">
            <Link className="vd-button vd-button--primary dealer-hero__button" href={primaryHref} onClick={() => carBuying && trackEvent("lead_form_started", { source: "hero_primary_cta", dealer_id: tenant.id })}>
              <span>{primaryLabel}</span>
              <small>{primarySub}</small>
            </Link>
            <Link className="vd-button vd-button--outline-dark dealer-hero__button" href={secondaryHref}>
              <span>{secondaryLabel}</span>
              <small>{secondarySub}</small>
            </Link>
          </div>

          <div className="dealer-hero__benefits">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[(benefit.icon || "check") as keyof typeof iconMap] || ClipboardCheck;
              return <div className="dealer-hero__benefit" key={`${benefit.label}-${index}`}><Icon size={16} strokeWidth={2} /><span>{benefit.label}</span></div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
