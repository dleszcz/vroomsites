"use client";

import React from "react";
import { Check } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { MultiStepLeadForm } from "./multi-step-lead-form";

interface LeadFormSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function LeadFormSection({ tenant, config }: LeadFormSectionProps) {
  const sectionTitle = config?.title || "Bezpłatna wycena samochodu";
  const primaryColor = tenant.branding.colors.primary || "var(--color-primary, #0d94e7)";

  return (
    <section id="lead-form" className="w-full py-16 md:py-20 bg-zinc-50 border-t border-b border-zinc-200 text-zinc-900">
      <div className="vd-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span
            className="text-xs font-bold tracking-widest uppercase mb-2 block"
            style={{ color: primaryColor }}
          >
            Szybka wycena online
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 mb-3 font-heading">
            {sectionTitle}
          </h2>

          <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
            Wypełnij krótki formularz wyceny w kilku prostych krokach. Otrzymasz natychmiastowy kontakt i bezpłatną kalkulację.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {[
              "Skup aut w każdym stanie",
              "Sprawne i uszkodzone",
              "Powypadkowe",
              "Bez OC i przeglądu",
            ].map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-zinc-200 text-zinc-700 text-xs font-medium shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>

        <MultiStepLeadForm tenant={tenant} />
      </div>
    </section>
  );
}
