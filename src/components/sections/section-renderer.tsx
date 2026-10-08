import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
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
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getTenantUrl } from "@/lib/urls";
import { StickyMobileCta } from "../sticky-mobile-cta";

interface SectionRendererProps {
  tenant: DealerTenant;
  mode?: "all" | "skup-aut" | "kontakt" | "o-nas" | "uslugi";
  isCustomDomain?: boolean;
}

export function SectionRenderer({ tenant, mode = "all", isCustomDomain }: SectionRendererProps) {
  const isSkupMode = mode === "skup-aut";
  const sections = tenant.pageConfig?.sections || [];
  let enabled = sections.filter((section) => section.enabled !== false);

  if (isSkupMode) {
    // For dedicated /skup-aut landing page:
    // Filter out: vehicles (cars for sale), about (O nas), faq (FAQ), and general hero
    enabled = enabled.filter(
      (section) =>
        section.type !== "vehicles" &&
        section.type !== "about" &&
        section.type !== "faq" &&
        section.type !== "hero"
    );

    // Ensure lead_form is rendered first
    const leadFormIndex = enabled.findIndex((s) => s.type === "lead_form");
    if (leadFormIndex > 0) {
      const [leadFormSec] = enabled.splice(leadFormIndex, 1);
      enabled.unshift(leadFormSec);
    }
  } else if (mode === "kontakt") {
    enabled = enabled.filter((s) => s.type === "contact" || s.type === "lead_form");
    enabled.sort((a, b) => (a.type === "contact" ? -1 : 1));
  } else if (mode === "o-nas") {
    enabled = enabled.filter((s) => s.type === "about" || s.type === "process" || s.type === "reviews");
    enabled.sort((a, b) => {
      if (a.type === "about") return -1;
      if (b.type === "about") return 1;
      return 0;
    });
  } else if (mode === "uslugi") {
    enabled = enabled.filter((s) => s.type === "services" || s.type === "faq" || s.type === "service_areas");
    enabled.sort((a, b) => {
      if (a.type === "services") return -1;
      if (b.type === "services") return 1;
      return 0;
    });
  } else if (mode === "all") {
    // Hide contact from homepage since we have a dedicated page and footer
    enabled = enabled.filter((s) => s.type !== "contact");
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
        <section style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #060810 100%)", padding: "24px 0 32px" }}>
          <div className="vd-container">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain) },
                { label: "Kontakt" },
              ]}
            />
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "32px auto 0" }}>
              <h1 className="vd-heading" style={{ fontSize: "2.5rem", marginBottom: "16px", color: "#fff" }}>Kontakt</h1>
              <p className="vd-text" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)" }}>Skontaktuj się z nami w dowolnej sprawie. Jesteśmy do Twojej dyspozycji.</p>
            </div>
          </div>
        </section>
      )}
      {mode === "o-nas" && (
        <section style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #060810 100%)", padding: "24px 0 32px" }}>
          <div className="vd-container">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain) },
                { label: "O nas" },
              ]}
            />
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "32px auto 0" }}>
              <h1 className="vd-heading" style={{ fontSize: "2.5rem", marginBottom: "16px", color: "#fff" }}>O nas</h1>
              <p className="vd-text" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)" }}>Poznaj naszą historię, wartości i zespół, który na co dzień dba o najwyższą jakość świadczonych przez nas usług.</p>
            </div>
          </div>
        </section>
      )}
      {mode === "uslugi" && (
        <section style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #060810 100%)", padding: "24px 0 32px" }}>
          <div className="vd-container">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain) },
                { label: "Nasze usługi" },
              ]}
            />
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "32px auto 0" }}>
              <h1 className="vd-heading" style={{ fontSize: "2.5rem", marginBottom: "16px", color: "#fff" }}>Nasze usługi</h1>
              <p className="vd-text" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)" }}>Sprawdź pełen zakres usług, które oferujemy. Zapewniamy profesjonalne doradztwo i kompleksową obsługę na każdym etapie.</p>
            </div>
          </div>
        </section>
      )}

      {/* Top Header for Skup Aut dedicated page */}
      {isSkupMode && (
        <section style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #060810 100%)", padding: "24px 0 0" }}>
          <div className="vd-container">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain) },
                { label: "Skup aut za gotówkę" },
              ]}
            />
          </div>
        </section>
      )}

      {enabled.map((config: SectionConfig) => {
        switch (config.type) {
          case "hero":
            return <HeroSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "trust":
            return <ValuePropsSection key={config.id} tenant={tenant} config={config} />;
          case "process":
            return <ProcessSection key={config.id} tenant={tenant} config={config} />;
          case "services":
            return <ServicesSection key={config.id} tenant={tenant} config={config} />;
          case "reviews":
            return <TrustSection key={config.id} tenant={tenant} config={config} />;
          case "vehicles":
            return <VehiclesSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "about":
            return <AboutSection key={config.id} tenant={tenant} config={config} />;
          case "service_areas":
            return <ServiceAreasSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "lead_form":
            return (
              <React.Fragment key={config.id}>
                <LeadFormSection tenant={tenant} config={config} />
                {isRecentlyBoughtCarsSectionEnabled && <RecentlyBoughtCarsSection tenant={tenant} />}
                {!hasServiceAreasSection && hasLocalPages && <ServiceAreasSection tenant={tenant} isCustomDomain={isCustomDomain} />}
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
