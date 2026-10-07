"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Clock3,
} from "lucide-react";
import { DealerTenant } from "@/types/landing";
import { Car } from "@/types/database";
import { CarGallery } from "@/components/car-gallery";
import { CarCard } from "@/components/car-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatPrice, formatMileage } from "@/lib/utils";
import { getTenantUrl } from "@/lib/urls";

interface SingleCarPageProps {
  tenant: DealerTenant;
  car: Car;
  relatedCars?: Car[];
  isCustomDomain?: boolean;
}

export function SingleCarPage({ tenant, car, relatedCars = [], isCustomDomain }: SingleCarPageProps) {
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";
  const phone = tenant.contact?.phone || "";
  const cleanPhone = phone.replace(/\s+/g, "");
  const whatsapp = tenant.contact?.whatsapp;
  const cleanWhatsapp = whatsapp?.replace(/\D/g, "");

  const carName = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}`;
  const displayRelated = relatedCars.slice(0, 3);
  const hasMoreRelated = relatedCars.length > displayRelated.length;

  const tradeInHref = getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Clean Compact Top Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
          color: "#fff",
          paddingBlock: "24px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="vd-container">
          <Breadcrumbs
            variant="dark"
            items={[
              { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain) },
              { label: "Samochody na sprzedaż", href: getTenantUrl(tenant.slug, "/samochody", tenant.customDomain) },
              { label: `${car.make} ${car.model}` },
            ]}
          />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                {car.is_sold ? (
                  <span style={{ padding: "3px 8px", borderRadius: "4px", background: "#ef4444", color: "#fff", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                    Sprzedany
                  </span>
                ) : (
                  <span style={{ padding: "3px 8px", borderRadius: "4px", background: "#10b981", color: "#fff", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                    Dostępny od ręki
                  </span>
                )}
                {car.is_featured && !car.is_sold && (
                  <span style={{ padding: "3px 8px", borderRadius: "4px", background: primaryColor, color: "#fff", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                    Wyróżniony
                  </span>
                )}
              </div>
              <h1 className="vd-heading" style={{ fontSize: "clamp(24px, 3vw, 34px)", color: "#fff", margin: 0, lineHeight: 1.2 }}>
                {carName}
              </h1>
            </div>

            <Link
              href={getTenantUrl(tenant.slug, "/samochody", tenant.customDomain)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={16} /> Powrót do oferty
            </Link>
          </div>
        </div>
      </section>

      {/* Main Detail Grid Section */}
      <section style={{ padding: "32px 0 60px" }}>
        <div className="vd-container">
          <div className="car-detail-layout">

            {/* Left Column: Gallery, Specs, Description */}
            <div className="car-detail-main">
              {/* Photo Gallery Box */}
              <div
                style={{
                  background: "#ffffff",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  marginBottom: "24px",
                }}
              >
                <CarGallery images={car.images || []} alt={carName} />
              </div>

              {/* Technical Specifications Grid */}
              <div
                style={{
                  background: "#ffffff",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  marginBottom: "24px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShieldCheck size={22} style={{ color: primaryColor }} />
                  Dane techniczne pojazdu
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
                  {car.year && (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--color-bg-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <Calendar size={20} style={{ color: primaryColor, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--color-text-soft)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Rok produkcji</span>
                        <strong style={{ fontSize: "14px", color: "var(--color-foreground)" }}>{car.year}</strong>
                      </div>
                    </div>
                  )}

                  {car.mileage && (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--color-bg-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <Gauge size={20} style={{ color: primaryColor, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--color-text-soft)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Przebieg</span>
                        <strong style={{ fontSize: "14px", color: "var(--color-foreground)" }}>{formatMileage(car.mileage)}</strong>
                      </div>
                    </div>
                  )}

                  {car.fuel_type && (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--color-bg-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <Fuel size={20} style={{ color: primaryColor, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--color-text-soft)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Rodzaj paliwa</span>
                        <strong style={{ fontSize: "14px", color: "var(--color-foreground)" }}>{car.fuel_type}</strong>
                      </div>
                    </div>
                  )}

                  {car.engine_capacity && (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--color-bg-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <Settings size={20} style={{ color: primaryColor, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--color-text-soft)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Silnik</span>
                        <strong style={{ fontSize: "14px", color: "var(--color-foreground)" }}>{car.engine_capacity}</strong>
                      </div>
                    </div>
                  )}

                  {car.transmission && (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--color-bg-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <Settings size={20} style={{ color: primaryColor, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--color-text-soft)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Skrzynia biegów</span>
                        <strong style={{ fontSize: "14px", color: "var(--color-foreground)" }}>{car.transmission}</strong>
                      </div>
                    </div>
                  )}

                  {car.color && (
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--color-bg-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <Palette size={20} style={{ color: primaryColor, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--color-text-soft)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Kolor nadwozia</span>
                        <strong style={{ fontSize: "14px", color: "var(--color-foreground)" }}>{car.color}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Box with top padding & heading */}
              {car.description && (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    marginBottom: "24px",
                  }}
                >
                  <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "14px", marginTop: 0 }}>
                    Opis pojazdu
                  </h2>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                    {car.description}
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div
                style={{
                  background: "#ffffff",
                  padding: "20px 24px",
                  borderRadius: "16px",
                  border: "1px solid var(--color-border)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Sprawdzony stan techniczny</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Pewny przebieg i historia</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Legalna umowa & dokumenty</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Purchasing & Dealer Box */}
            <div className="car-detail-sidebar">
              <div
                style={{
                  background: "#ffffff",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Pricing Display */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-soft)", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                    Cena samochodu
                  </span>
                  {car.price && !car.is_sold ? (
                    <div>
                      <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--color-foreground)", lineHeight: 1.1 }}>
                        {formatPrice(car.price)}{" "}
                        <span style={{ fontSize: "18px", fontWeight: 700, color: primaryColor }}>PLN</span>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--color-text-soft)", display: "block", marginTop: "4px" }}>
                        Umowa kupna-sprzedaży • Zwolnienie z opłaty PCC 2%
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#ef4444" }}>
                      Pojazd Sprzedany
                    </div>
                  )}
                </div>

                <hr style={{ border: 0, borderTop: "1px solid var(--color-border)", margin: 0 }} />

                {/* Primary Contact CTAs */}
                {!car.is_sold && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {phone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="vd-button vd-button--primary"
                        style={{ background: primaryColor, width: "100%", justifyContent: "center", paddingBlock: "12px", fontSize: "14px" }}
                      >
                        <Phone size={16} /> Zadzwoń: {phone}
                      </a>
                    )}

                    {cleanWhatsapp && (
                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=Dzień%20dobry,%20pytam%20o%20samochód%20${encodeURIComponent(carName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vd-button"
                        style={{ background: "#25D366", color: "#fff", width: "100%", justifyContent: "center", paddingBlock: "12px", fontSize: "14px" }}
                      >
                        Napisz na WhatsApp
                      </a>
                    )}
                  </div>
                )}

                {/* Trade-In Box (scrolling to lead form) */}
                {tenant.businessRules?.tradeIn?.enabled && (
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: `${primaryColor}0d`,
                      border: `1px solid ${primaryColor}25`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <RefreshCw size={16} style={{ color: primaryColor }} />
                      <strong style={{ fontSize: "13px", color: "var(--color-foreground)" }}>
                        {tenant.businessRules.tradeIn.title || "Auto w rozliczeniu"}
                      </strong>
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: "var(--color-text-soft)", lineHeight: 1.4 }}>
                      Zostaw swój obecny samochód w rozliczeniu przy zakupie tego auta!
                    </p>
                    <Link
                      href={tradeInHref}
                      style={{ fontSize: "12px", fontWeight: 700, color: primaryColor, textDecoration: "none", display: "inline-block" }}
                    >
                      Zgłoś auto do darmowej wyceny ➔
                    </Link>
                  </div>
                )}

                {/* Dealer Info Block */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: "var(--color-bg-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "var(--color-text-soft)" }}>
                    Sprzedawca
                  </span>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-foreground)" }}>
                    {tenant.businessName}
                  </div>
                  {(tenant.location?.address || tenant.location?.city) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-text-soft)" }}>
                      <MapPin size={15} style={{ color: primaryColor, flexShrink: 0 }} />
                      <span>
                        {tenant.location.address}{tenant.location.address && tenant.location.city ? ", " : ""}{tenant.location.city}
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-text-soft)" }}>
                    <Clock3 size={15} style={{ color: primaryColor, flexShrink: 0 }} />
                    <span>Pn–Pt: 8:00–20:00, Sob–Nd: 10:00–18:00</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Cars Section */}
      {displayRelated.length > 0 && (
        <section className="vd-section vd-section--soft">
          <div className="vd-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <span className="vd-eyebrow">Pozostała oferta</span>
                <h2 className="vd-heading">Podobne samochody w ofercie</h2>
              </div>
              {hasMoreRelated && (
                <Link href={`/${tenant.slug}/samochody`} style={{ color: primaryColor, fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  Zobacz pełną ofertę ➔
                </Link>
              )}
            </div>

            <div className="vehicles__grid">
              {displayRelated.map((relatedCar) => (
                <CarCard key={relatedCar.id} car={relatedCar} dealerSlug={tenant.slug} customDomain={tenant.customDomain} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
