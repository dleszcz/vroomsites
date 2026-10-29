"use client";

import React from "react";
import { CarFront, FileText, Siren, WalletCards, ArrowRight } from "lucide-react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { getTenantUrl } from "@/lib/urls";

interface Props {
  tenant: DealerTenant;
  config?: SectionConfig;
  isCustomDomain?: boolean;
}

const icons = [WalletCards, CarFront, Siren, FileText];
const defaults = [
  { title: "Skup aut", text: "Skupujemy auta wszystkich marek, w każdym stanie technicznym za gotówkę.", label: "Sprzedaj auto", href: "/skup-aut" },
  { title: "Sprzedaż aut", text: "Szeroki wybór sprawdzonych samochodów używanych z gwarancją.", label: "Zobacz ofertę", href: "/samochody" },
  { title: "Pomoc drogowa", text: "Szybki transport aut oraz pomoc drogowa 24/7 na terenie całego kraju.", label: "Zadzwoń", href: "" },
  { title: "Inne usługi", text: "Kompleksowe przygotowanie do rejestracji, finansowanie i doradztwo.", label: "Sprawdź kontakt", href: "/kontakt" },
];

export function ServicesSection({ tenant, isCustomDomain }: Props) {
  const carBuying = hasCarBuying(tenant);
  const phone = tenant.contact.phone || "";
  const leadHref = tenant.contact.whatsapp
    ? `https://wa.me/${tenant.contact.whatsapp.replace(/\D/g, "")}`
    : phone
    ? `tel:${phone.replace(/\s/g, "")}`
    : "#about";

  const configured = tenant.services
    .filter((s) => s.enabled)
    .filter((s) => carBuying || s.type !== "car_buying")
    .slice(0, 4);

  const baseDefaults = defaults.map((d, i) => ({
    ...d,
    href: i === 2 ? (phone ? `tel:${phone.replace(/\s/g, "")}` : "/kontakt") : d.href,
  }));

  const cards = configured.length
    ? configured.map((service, i) => ({
        title: service.title,
        text: service.description,
        label: service.ctaLabel || defaults[i]?.label || "Sprawdź",
        href:
          service.ctaType === "phone"
            ? `tel:${(service.ctaValue || phone).replace(/\s/g, "")}`
            : service.ctaType === "whatsapp" || service.ctaType === "lead_form"
            ? leadHref
            : service.ctaValue || defaults[i]?.href || "/kontakt",
      }))
    : carBuying
    ? baseDefaults
    : baseDefaults.slice(1);

  return (
    <section id="services" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className="vd-eyebrow"
            style={{ color: tenant.branding.colors.primary || "var(--color-primary)" }}
          >
            Zakres usług
          </span>
          <h2 className="vd-heading mb-3">
            {carBuying ? "Usługi dla kierowców i właścicieli aut" : "Nasza oferta i usługi dla kupujących"}
          </h2>
          <p className="vd-copy text-zinc-700 dark:text-zinc-300">
            {carBuying
              ? "Gwarantujemy przejrzyste zasady, profesjonalne podejście oraz szybką realizację każdej transakcji."
              : "Oferujemy sprawdzone pojazdy, transparentne warunki zakupu, fakturę oraz kompleksową pomoc w rejestracji."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = icons[i] || FileText;
            const isExternal =
              card.href.startsWith("tel:") ||
              card.href.startsWith("http") ||
              card.href.startsWith("mailto:");

            return (
              <div
                key={`${card.title}-${i}`}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-150"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-md flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--color-primary, #0d94e7) 12%, transparent)",
                      color: "var(--color-primary, #0d94e7)",
                    }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    {card.text}
                  </p>
                </div>

                {isExternal ? (
                  <a
                    href={card.href}
                    onClick={() =>
                      trackEvent("service_clicked", { dealer_id: tenant.id, service: card.title })
                    }
                    className="h-10 w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-semibold tracking-wide transition-all duration-150"
                  >
                    <span>{card.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-100 dark:group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ) : (
                  <Link
                    href={getTenantUrl(tenant.slug, card.href, tenant.customDomain, isCustomDomain)}
                    onClick={() =>
                      trackEvent("service_clicked", { dealer_id: tenant.id, service: card.title })
                    }
                    className="h-10 w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-semibold tracking-wide transition-all duration-150"
                  >
                    <span>{card.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-100 dark:group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
