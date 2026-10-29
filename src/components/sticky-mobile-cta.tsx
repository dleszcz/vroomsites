"use client";

import { Phone, MessageCircle, Car } from "lucide-react";
import { DealerTenant, hasCarBuying } from "@/types/landing";
import { getTenantUrl } from "@/lib/urls";

interface StickyMobileCtaProps {
  tenant: DealerTenant;
  isCustomDomain?: boolean;
}

export function StickyMobileCta({ tenant, isCustomDomain }: StickyMobileCtaProps) {
  const phone = tenant.contact.phone || "";
  const cleanPhone = phone.replace(/\s+/g, "");
  const rawWhatsapp = tenant.contact.whatsapp || "";
  const cleanWhatsapp = rawWhatsapp.replace(/\D/g, "");

  const carBuying = hasCarBuying(tenant);
  const vehiclesHref = getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain);

  const handleSellClick = (e: React.MouseEvent) => {
    if (!carBuying) return;
    e.preventDefault();
    const targetEl = document.getElementById("lead-form") || document.getElementById("sell-car");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] shadow-lg">
      <div className="max-w-md mx-auto grid grid-flow-col auto-cols-fr gap-2">
        {/* Call Button */}
        {phone && (
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-md bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            style={{ color: "#ffffff" }}
          >
            <Phone className="w-4 h-4 text-sky-400" strokeWidth={1.75} />
            <span style={{ color: "#ffffff" }}>Zadzwoń</span>
          </a>
        )}

        {/* WhatsApp Button */}
        {cleanWhatsapp && (
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              carBuying
                ? "Dzień dobry, chcę wycenić/sprzedać samochód."
                : "Dzień dobry, pytam o samochód z Państwa oferty."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-md bg-emerald-950/70 border border-emerald-600/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-900/50 transition-colors"
            style={{ color: "#34d399" }}
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
            <span style={{ color: "#34d399" }}>WhatsApp</span>
          </a>
        )}

        {/* Action Button: Wycena lub Oferta */}
        <a
          href={carBuying ? getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain) : vehiclesHref}
          onClick={handleSellClick}
          className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
          style={{ color: "#ffffff" }}
        >
          <Car className="w-4 h-4 text-white" strokeWidth={1.75} style={{ color: "#ffffff" }} />
          <span style={{ color: "#ffffff" }}>{carBuying ? "Wycena" : "Oferta"}</span>
        </a>
      </div>
    </div>
  );
}
