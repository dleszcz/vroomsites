"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { MultiStepLeadForm } from "./multi-step-lead-form";

interface LeadFormSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function LeadFormSection({ tenant, config }: LeadFormSectionProps) {
  const title = config?.title || "Bezpłatna wycena samochodu";
  const sectionTitle = title;
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";
  const accentColor = tenant.branding?.colors?.accent || primaryColor;

  return (
    <section id="lead-form" style={{ width: "100%", padding: "5rem 0", background: "#0a0f1d" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem" }}>
          <span
            style={{
              display: "inline-block",
              color: accentColor,
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            SZYBKA WYCENA SKUPU
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "1rem",
              lineHeight: 1.15,
            }}
          >
            {sectionTitle}
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--color-text-soft, rgba(255,255,255,0.7))",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Wypełnij krótki formularz wyceny w 4 krokach. Przyjedziemy po Twoje auto i zapłacimy gotówką od ręki!
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              marginTop: "1.25rem",
            }}
          >
            {[
              "Skup aut w każdym stanie",
              "Sprawne & Uszkodzone",
              "Powypadkowe",
              "Bez OC / Przeglądu",
            ].map((badge, idx) => (
              <span
                key={idx}
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: "rgba(22, 134, 224, 0.15)",
                  border: "1px solid rgba(22, 134, 224, 0.35)",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        <MultiStepLeadForm tenant={tenant} />
      </div>
    </section>
  );
}

