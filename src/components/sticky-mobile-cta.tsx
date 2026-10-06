"use client";

import React from "react";
import { Phone, MessageCircle, Car } from "lucide-react";
import { DealerTenant, hasCarBuying } from "@/types/landing";

import { getTenantUrl } from "@/lib/urls";

interface StickyMobileCtaProps {
  tenant: DealerTenant;
  isCustomDomain?: boolean;
}

export function StickyMobileCta({ tenant, isCustomDomain }: StickyMobileCtaProps) {
  const phone = tenant.contact.phone || "";
  const rawWhatsapp = tenant.contact.whatsapp || "";
  const cleanWhatsapp = rawWhatsapp.replace(/\D/g, "");
  const colCount = 1 + (phone ? 1 : 0) + (cleanWhatsapp ? 1 : 0);
  const gridTemplateColumns = colCount === 3 ? "1fr 1fr 1.2fr" : colCount === 2 ? "1fr 1.2fr" : "1fr";
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

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
    <div
      className="vd-sticky-mobile-cta"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(10, 15, 29, 0.94)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "10px 12px calc(10px + env(safe-area-inset-bottom, 0px))",
        boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns,
          gap: "8px",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        {/* Call Button */}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              height: "48px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Phone size={16} style={{ color: "#38bdf8" }} />
            Zadzwoń
          </a>
        )}

        {/* WhatsApp Button */}
        {cleanWhatsapp && (
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(carBuying ? "Dzień dobry, chcę wycenić/sprzedać samochód." : "Dzień dobry, pytam o samochód z Państwa oferty.")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              height: "48px",
              borderRadius: "10px",
              background: "rgba(37, 211, 102, 0.15)",
              border: "1px solid rgba(37, 211, 102, 0.35)",
              color: "#25D366",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        )}

        {/* Sell Car Button */}
        <a
          href={carBuying ? getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain) : vehiclesHref}
          onClick={handleSellClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            height: "48px",
            borderRadius: "10px",
            background: primaryColor,
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: `0 4px 14px ${primaryColor}55`,
          }}
        >
          <Car size={16} />
          {carBuying ? "Wycena" : "Oferta"}
        </a>
      </div>
    </div>
  );
}
