"use client";

import React from "react";
import { Phone, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface ContactSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
  hideHeader?: boolean;
}

export function ContactSection({ tenant, config, hideHeader }: ContactSectionProps) {
  const phone = tenant.contact.phone;
  const telUrl = phone ? `tel:${phone.replace(/\s/g, "")}` : "#";
  const whatsappNumber = tenant.contact.whatsapp;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Dzień dobry! Piszę ze strony ${tenant.businessName} w sprawie wyceny lub zakupu auta.`
      )}`
    : null;
  const facebookUrl = tenant.contact.facebook;

  return (
    <section
      id="contact"
      className={`vd-section ${hideHeader ? "pt-6 pb-16" : "vd-section--bordered vd-section--soft"}`}
    >
      <div className="vd-container">
        {!hideHeader && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="vd-eyebrow">Dane kontaktowe</span>
            <h2 className="vd-heading mb-3">
              {config?.title || `Skontaktuj się z ${tenant.businessName}`}
            </h2>
            <p className="vd-copy">
              Jesteśmy do Twojej dyspozycji 7 dni w tygodniu. Zadzwoń, napisz lub odwiedź nas osobiście.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Phone box */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-900 mb-5">
                <Phone className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">
                Telefon bezpośredni
              </h3>
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                Szybka rozmowa z doradcą i natychmiastowa bezpłatna wycena pojazdu.
              </p>
            </div>
            {phone && (
              <a
                href={telUrl}
                onClick={() => trackEvent("phone_clicked", { source: "contact_section" })}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-md font-semibold text-sm transition-opacity shadow-xs"
                style={{
                  background: tenant.branding?.colors?.primary || "var(--color-primary, #0d94e7)",
                  color: "#ffffff",
                }}
              >
                <Phone className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
                <span style={{ color: "#ffffff" }}>{phone}</span>
              </a>
            )}
          </div>

          {/* WhatsApp box */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <MessageCircle className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">
                Wiadomość WhatsApp
              </h3>
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                Prześlij zdjęcia i krótki opis auta do szybkiej wyceny w kilkadziesiąt sekund.
              </p>
            </div>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_clicked", { source: "contact_section" })}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
                style={{ color: "#ffffff" }}
              >
                <MessageCircle className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
                <span style={{ color: "#ffffff" }}>Napisz na WhatsApp</span>
              </a>
            )}
          </div>

          {/* Location box */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-900 mb-5">
                <MapPin className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">
                Adres i siedziba
              </h3>
              <p className="font-semibold text-sm text-zinc-900 mb-1">
                {tenant.businessName}
              </p>
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                {tenant.location?.address ? `${tenant.location.address}, ` : ""}
                {tenant.location?.city || "Polska"}
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${tenant.businessName} ${tenant.location?.address || ""} ${tenant.location?.city || ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-semibold text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-zinc-500" />
              <span>Zobacz w Google Maps</span>
            </a>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-10 rounded-lg overflow-hidden border border-zinc-200 h-80 md:h-96 shadow-sm">
          <iframe
            width="100%"
            height="100%"
            className="border-0 w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${tenant.businessName} ${tenant.location?.address || ""} ${tenant.location?.city || ""}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      </div>
    </section>
  );
}
