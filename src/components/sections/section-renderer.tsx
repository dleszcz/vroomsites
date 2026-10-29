import React from "react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";
import { HeroSection } from "./hero-section";
import { ValuePropsSection } from "./value-props-section";
import { TrustSection } from "./trust-section";
import { ServicesSection } from "./services-section";
import { ProcessSection } from "./process-section";
import { VehiclesSection } from "./vehicles-section";
import { AboutSection } from "./about-section";
import { LeadFormSection } from "./lead-form-section";
import { FAQSection } from "./faq-section";
import { ContactSection } from "./contact-section";
import { ServiceAreasSection } from "./service-areas-section";
import { RecentlyBoughtCarsSection } from "./recently-bought-cars-section";
import { getTenantUrl } from "@/lib/urls";
import { StickyMobileCta } from "../sticky-mobile-cta";
import { Car } from "@/types/database";

interface SectionRendererProps {
  tenant: DealerTenant;
  cars?: Car[];
  mode?: "all" | "skup-aut" | "kontakt" | "o-nas" | "uslugi";
  isCustomDomain?: boolean;
}

export function SectionRenderer({ tenant, cars = [], mode = "all", isCustomDomain }: SectionRendererProps) {
  const isSkupMode = mode === "skup-aut";
  const sections = tenant.pageConfig?.sections || [];
  let enabled = sections.filter((section) => section.enabled !== false);

  if (isSkupMode) {
    // For dedicated /skup-aut landing page:
    // Only keep: lead_form (valuation form) + trust (ValueProps) + process (How it works)
    // Exclude: services, reviews, contact, vehicles, about, faq, hero
    enabled = enabled.filter(
      (section) =>
        section.type === "lead_form" ||
        section.type === "trust" ||
        section.type === "process"
    );

    // Sort order: lead_form first, then trust (value props), then process
    enabled.sort((a, b) => {
      const order: Record<string, number> = { lead_form: 1, trust: 2, process: 3 };
      return (order[a.type] || 99) - (order[b.type] || 99);
    });
  } else if (mode === "kontakt") {
    // Dedicated contact page: only contact section (no lead_form / "Darmowa Wycena")
    enabled = enabled.filter((s) => s.type === "contact");
  } else if (mode === "o-nas") {
    // Dedicated about page: only about and reviews (no skup process)
    enabled = enabled.filter((s) => s.type === "about" || s.type === "reviews");
    enabled.sort((a, b) => {
      if (a.type === "about") return -1;
      if (b.type === "about") return 1;
      return 0;
    });
  } else if (mode === "uslugi") {
    enabled = enabled.filter((s) => s.type === "services" || s.type === "faq" || s.type === "service_areas");
    
    // Inject service areas section at the end of the services page if tenant has local pages
    const hasLocalPages = (tenant.localSeo?.localPages?.filter((lp) => lp.enabled && lp.indexable) || []).length > 0;
    if (hasLocalPages && !enabled.some((s) => s.type === "service_areas")) {
      enabled.push({ id: "injected-service-areas", type: "service_areas", enabled: true });
    }

    enabled.sort((a, b) => {
      if (a.type === "services") return -1;
      if (b.type === "services") return 1;
      return 0;
    });
  } else if (mode === "all") {
    // Homepage: sales & showroom focus.
    // Exclude contact (has footer), skup-specific blocks (trust & process belong on /skup-aut),
    // and exclude valuation lead_form if dealer has disabled car buying
    const carBuying = hasCarBuying(tenant);
    enabled = enabled.filter(
      (s) =>
        s.type !== "contact" &&
        s.type !== "trust" &&
        s.type !== "process" &&
        (carBuying || s.type !== "lead_form")
    );

    // Ensure vehicles section appears directly after hero on homepage
    const heroIndex = enabled.findIndex((s) => s.type === "hero");
    const vehiclesIndex = enabled.findIndex((s) => s.type === "vehicles");
    if (heroIndex !== -1 && vehiclesIndex !== -1 && vehiclesIndex !== heroIndex + 1) {
      const [vehiclesSec] = enabled.splice(vehiclesIndex, 1);
      enabled.splice(heroIndex + 1, 0, vehiclesSec);
    }
  }

  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";
  const accentColor = tenant.branding?.colors?.accent || primaryColor;
  const headerBg = tenant.branding?.colors?.headerBg || "#080808";
  const footerBg = tenant.branding?.colors?.footerBg || "#080808";

  const hasServiceAreasSection = enabled.some((s) => s.type === "service_areas");
  const hasLocalPages = (tenant.localSeo?.localPages?.filter((lp) => lp.enabled && lp.indexable) || []).length > 0;
  const isRecentlyBoughtCarsSectionEnabled = false; // To integrate with backend/db

  return (
    <div
      className="landing-engine-sections"
      style={{
        ["--color-primary" as string]: primaryColor,
        ["--color-accent" as string]: accentColor,
        ["--color-brand" as string]: primaryColor,
        ["--color-header-bg" as string]: headerBg,
        ["--color-footer-bg" as string]: footerBg
      }}
    >
      {/* Top Header for Subpages */}
      {mode === "kontakt" && (
        <section className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-10 md:py-12 text-zinc-900 dark:text-zinc-50">
          <div className="vd-container text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-2 font-heading">Kontakt</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
              Skontaktuj się z nami w dowolnej sprawie. Jesteśmy do Twojej dyspozycji 7 dni w tygodniu.
            </p>
          </div>
        </section>
      )}
      {mode === "o-nas" && (
        <section className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-10 md:py-12 text-zinc-900 dark:text-zinc-50">
          <div className="vd-container text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-2 font-heading">O nas</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
              Poznaj naszą historię, standardy i zespół, który dba o najwyższą jakość obsługi klienta.
            </p>
          </div>
        </section>
      )}
      {mode === "uslugi" && (
        <section className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-10 md:py-12 text-zinc-900 dark:text-zinc-50">
          <div className="vd-container text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-2 font-heading">
              {hasCarBuying(tenant) ? "Nasze usługi" : "Nasza oferta i usługi"}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
              {hasCarBuying(tenant)
                ? "Sprawdź pełen zakres profesjonalnych usług motoryzacyjnych przygotowanych dla kierowców."
                : "Sprawdź zakres profesjonalnych usług związanych ze sprzedażą, sprowadzaniem i przygotowaniem pojazdów."}
            </p>
          </div>
        </section>
      )}

      {enabled.map((config: SectionConfig) => {
        switch (config.type) {
          case "hero":
            return <HeroSection key={config.id} tenant={tenant} config={config} cars={cars} isCustomDomain={isCustomDomain} />;
          case "trust":
            return <ValuePropsSection key={config.id} tenant={tenant} config={config} />;
          case "process":
            return <ProcessSection key={config.id} tenant={tenant} config={config} />;
          case "services":
            return <ServicesSection key={config.id} tenant={tenant} config={config} />;
          case "reviews":
            return <TrustSection key={config.id} tenant={tenant} config={config} />;
          case "vehicles":
            return <VehiclesSection key={config.id} tenant={tenant} config={config} cars={cars} isCustomDomain={isCustomDomain} />;
          case "about":
            return <AboutSection key={config.id} tenant={tenant} config={config} />;
          case "service_areas":
            return <ServiceAreasSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "lead_form":
            return (
              <React.Fragment key={config.id}>
                <LeadFormSection tenant={tenant} config={config} />
                {isRecentlyBoughtCarsSectionEnabled && <RecentlyBoughtCarsSection tenant={tenant} />}
              </React.Fragment>
            );
          case "faq":
            return <FAQSection key={config.id} tenant={tenant} config={config} />;
          case "contact":
            return <ContactSection key={config.id} tenant={tenant} config={config} hideHeader={mode === "kontakt"} />;
          default:
            return null;
        }
      })}

      <StickyMobileCta tenant={tenant} isCustomDomain={isCustomDomain} />
    </div>
  );
}
