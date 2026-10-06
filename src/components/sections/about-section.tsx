import React from "react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";

interface Props {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function AboutSection({ tenant, config }: Props) {
  const carBuying = hasCarBuying(tenant);
  const rawTitle = config?.title;
  const title = !rawTitle || rawTitle.toLowerCase().includes("o nas") ? (carBuying ? "Komis i skup aut" : "Komis samochodowy") : rawTitle;
  const subtitle = config?.subtitle;
  const description =
    (config?.data?.description as string) ||
    tenant.businessDescription ||
    (carBuying
      ? `Jesteśmy lokalnym komisem samochodowym i skupem aut z wieloletnim doświadczeniem. Zapewniamy profesjonalne podejście, uczciwe rynkowe wyceny i natychmiastową wypłatę gotówki.`
      : `Jesteśmy lokalnym komisem samochodowym. Oferujemy sprawdzone auta używane, uczciwe ceny i pomoc w formalnościach.`);
  const image = (config?.data?.imageUrl as string) || tenant.branding.media?.heroImageUrl;

  return (
    <section id="about" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div style={{ display: "grid", gridTemplateColumns: image ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr", gap: "36px", alignItems: "center" }}>
          <div>
            <span className="vd-eyebrow">O nas</span>
            <h2 className="vd-heading" style={{ marginBottom: "12px" }}>{title}</h2>
            {subtitle && <p style={{ fontSize: "16px", color: "var(--color-primary)", fontWeight: 600, marginBottom: "16px" }}>{subtitle}</p>}
            <p className="vd-copy" style={{ lineHeight: 1.7 }}>{description}</p>

            {(tenant.location?.address || tenant.location?.city) && (
              <div style={{ marginTop: "20px", fontSize: "14px", color: "var(--color-text-soft)", fontWeight: 600 }}>
                📍 Siedziba: {tenant.location.address}{tenant.location.address && tenant.location.city ? ", " : ""}{tenant.location.city}
              </div>
            )}
          </div>

          {image && (
            <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
              <img src={image} alt={tenant.businessName} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
