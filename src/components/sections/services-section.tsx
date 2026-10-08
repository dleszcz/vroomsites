"use client";

import React from "react";
import { CarFront, FileText, Siren, WalletCards } from "lucide-react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { getTenantUrl } from "@/lib/urls";

interface Props { tenant: DealerTenant; config?: SectionConfig; isCustomDomain?: boolean; }
const icons = [WalletCards, CarFront, Siren, FileText];
const defaults = [
  { title: "Skup aut", text: "Skupujemy auta wszystkich marek, w każdym stanie technicznym.", label: "Sprzedaj auto", href: "/skup-aut" },
  { title: "Sprzedaż aut", text: "Szeroki wybór sprawdzonych samochodów.", label: "Zobacz ofertę", href: "/samochody" },
  { title: "Pomoc drogowa", text: "Laweta 24/7 na terenie całego kraju.", label: "Zadzwoń", href: "" },
  { title: "Inne usługi", text: "Transport aut, przygotowanie do rejestracji i inne.", label: "Sprawdź", href: "/kontakt" },
];

export function ServicesSection({ tenant, isCustomDomain }: Props) {
  const carBuying = hasCarBuying(tenant);
  const phone = tenant.contact.phone || "";
  const leadHref = tenant.contact.whatsapp ? `https://wa.me/${tenant.contact.whatsapp.replace(/\D/g, "")}` : phone ? `tel:${phone.replace(/\s/g, "")}` : "#about";
  const configured = tenant.services
    .filter(s => s.enabled)
    .filter(s => carBuying || s.type !== "car_buying")
    .slice(0, 4);
  const baseDefaults = defaults.map((d, i) => ({ ...d, href: i === 2 ? `tel:${phone.replace(/\s/g, "")}` : d.href }));
  const cards = configured.length ? configured.map((service, i) => ({
    title: service.title,
    text: service.description,
    label: service.ctaLabel || defaults[i]?.label || "Sprawdź",
    href: service.ctaType === "phone" ? `tel:${(service.ctaValue || phone).replace(/\s/g, "")}` : service.ctaType === "whatsapp" || service.ctaType === "lead_form" ? leadHref : service.ctaValue || defaults[i]?.href || "/kontakt",
  })) : carBuying ? baseDefaults : baseDefaults.slice(1);

  return (
    <section id="services" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div className="services__header">
          <span className="vd-eyebrow">Nasza oferta</span>
          <h2 className="vd-heading">Usługi dla kierowców i właścicieli aut</h2>
        </div>
        <div className="services__grid">
          {cards.map((card, i) => {
            const Icon = icons[i] || FileText;
            return <div key={`${card.title}-${i}`} className="service-card">
              <Icon className="service-card__icon" strokeWidth={1.7} />
              <h3 className="service-card__title">{card.title}</h3>
              <p className="service-card__text">{card.text}</p>
              {card.href.startsWith("tel:") || card.href.startsWith("http") || card.href.startsWith("mailto:") ? (
                <a className="vd-button vd-button--outline service-card__button" href={card.href} onClick={() => trackEvent("service_clicked", { dealer_id: tenant.id, service: card.title })}>{card.label}</a>
              ) : (
                <Link className="vd-button vd-button--outline service-card__button" href={getTenantUrl(tenant.slug, card.href, tenant.customDomain, isCustomDomain)} onClick={() => trackEvent("service_clicked", { dealer_id: tenant.id, service: card.title })}>
                  {card.label}
                </Link>
              )}
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
