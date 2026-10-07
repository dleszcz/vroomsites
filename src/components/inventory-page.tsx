"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, RefreshCw, ChevronDown } from "lucide-react";
import { DealerTenant } from "@/types/landing";
import { Car } from "@/types/database";
import { CarCard } from "@/components/car-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getTenantUrl } from "@/lib/urls";

interface InventoryPageProps {
  tenant: DealerTenant;
  cars: Car[];
  isCustomDomain?: boolean;
}

export function InventoryPage({ tenant, cars, isCustomDomain }: InventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFuel, setSelectedFuel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [statusFilter, setStatusFilter] = useState<"available" | "sold" | "all">("available");

  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

  const availableCount = cars.filter((c) => !c.is_sold).length;
  const soldCount = cars.filter((c) => c.is_sold).length;

  // Filter cars based on search, fuel type, and sold status
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      searchQuery === "" ||
      `${car.make} ${car.model} ${car.year ?? ""}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFuel = selectedFuel === "all" || car.fuel_type?.toLowerCase() === selectedFuel.toLowerCase();
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && !car.is_sold) ||
      (statusFilter === "sold" && car.is_sold);
    return matchesSearch && matchesFuel && matchesStatus;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
    return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
  });

  const tradeInHref = getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Header Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
          color: "#fff",
          paddingBlock: "28px 36px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="vd-container">
          <Breadcrumbs
            variant="dark"
            items={[
              { label: tenant.businessName, href: `/${tenant.slug}` },
              { label: "Samochody na sprzedaż" },
            ]}
          />
          <div style={{ marginTop: "16px" }}>
            <span className="vd-eyebrow" style={{ color: primaryColor, display: "block", marginBottom: "6px" }}>
              Oferta samochodów używanych
            </span>
            <h1 className="vd-heading" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", color: "#fff", marginBottom: "10px", lineHeight: 1.2 }}>
              Samochody na sprzedaż - {tenant.businessName}
            </h1>
            <p className="vd-copy" style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", maxWidth: "680px", margin: 0 }}>
              Sprawdź naszą pełną ofertę samochodów z gwarancją. Oferujemy autentyczne przebiegi, badania techniczne i możliwość zakupu w rozliczeniu.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section style={{ padding: "32px 0 60px" }}>
        <div className="vd-container">
          {/* Controls Bar */}
          <div
            className="inventory-filter-bar"
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              marginBottom: "32px",
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", flex: "1 1 280px" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
              />
              <input
                type="text"
                placeholder="Szukaj marki lub modelu (np. BMW, Audi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 14px 0 42px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  color: "#0f172a",
                  background: "#f8fafc",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            {/* Fuel Filter & Sort Selects */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  style={{
                    height: "44px",
                    padding: "0 36px 0 16px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    background: "#ffffff",
                    cursor: "pointer",
                    appearance: "none",
                    minWidth: "160px",
                  }}
                >
                  <option value="all">Wszystkie napędy</option>
                  <option value="diesel">Diesel</option>
                  <option value="benzyna">Benzyna</option>
                  <option value="hybryda">Hybryda</option>
                  <option value="elektryczny">Elektryczny</option>
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
              </div>

              <div style={{ position: "relative" }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "price_asc" | "price_desc")}
                  style={{
                    height: "44px",
                    padding: "0 36px 0 16px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    background: "#ffffff",
                    cursor: "pointer",
                    appearance: "none",
                    minWidth: "180px",
                  }}
                >
                  <option value="newest">Najnowsze ogłoszenia</option>
                  <option value="price_asc">Cena: od najniższej</option>
                  <option value="price_desc">Cena: od najwyższej</option>
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
            {([
              { key: "available" as const, label: `🟢 Dostępne (${availableCount})` },
              ...(soldCount > 0 ? [{ key: "sold" as const, label: `🔴 Sprzedane (${soldCount})` }] : []),
              { key: "all" as const, label: `Wszystkie (${cars.length})` },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "10px",
                  border: statusFilter === tab.key ? `2px solid ${primaryColor}` : "1.5px solid #cbd5e1",
                  background: statusFilter === tab.key ? `${primaryColor}10` : "#ffffff",
                  color: statusFilter === tab.key ? primaryColor : "#64748b",
                  fontSize: "13px",
                  fontWeight: statusFilter === tab.key ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            ))}

            <span style={{ marginLeft: "auto", fontSize: "13px", color: "var(--color-text-soft)" }}>
              {statusFilter === "available" && availableCount > 0 && "Wszystkie auta sprawdzone technicznie"}
              {statusFilter === "sold" && soldCount > 0 && "Historia sprzedanych pojazdów"}
            </span>
          </div>

          {/* Cars Grid */}
          {sortedCars.length > 0 ? (
            <div className="vehicles__grid">
              {sortedCars.map((car) => (
                <CarCard key={car.id} car={car} dealerSlug={tenant.slug} customDomain={tenant.customDomain} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                Brak wyników wyszukiwania
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-soft)", marginBottom: "20px" }}>
                Nie znaleźliśmy samochodów spełniających podane kryteria filtracji.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFuel("all");
                }}
                className="vd-button vd-button--primary"
                style={{ background: primaryColor }}
              >
                Zresetuj filtry
              </button>
            </div>
          )}

          {/* Trade-In Banner */}
          {tenant.businessRules?.tradeIn?.enabled && (
            <div
              style={{
                marginTop: "48px",
                padding: "24px 28px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${primaryColor}0d 0%, ${primaryColor}1a 100%)`,
                border: `1px solid ${primaryColor}30`,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${primaryColor}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: primaryColor,
                    flexShrink: 0,
                  }}
                >
                  <RefreshCw size={22} />
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700 }}>
                    {tenant.businessRules.tradeIn.title || "Chcesz kupić auto? Zostaw swoje w rozliczeniu!"}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)", maxWidth: "560px" }}>
                    {tenant.businessRules.tradeIn.description ||
                      "Wyceń swój obecny samochód bezpłatnie w 15 minut i pomniejsz koszt zakupu nowego pojazdu."}
                  </p>
                </div>
              </div>
              <a
                href={tradeInHref}
                className="vd-button vd-button--primary"
                style={{ background: primaryColor, textDecoration: "none" }}
              >
                Wyceń swoje auto w rozliczeniu ➔
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
