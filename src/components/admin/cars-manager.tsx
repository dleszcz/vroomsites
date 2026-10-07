"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Car } from "@/types/database";
import { toggleCarSoldStatus, toggleCarFeaturedStatus } from "@/app/[dealerSlug]/admin/actions";
import { formatPrice, formatMileage } from "@/lib/utils";
import { CarForm } from "./car-form";

interface CarsManagerProps {
  cars: Car[];
  tenantSlug: string;
  tenantName: string;
  siteUrl?: string;
}

type FilterStatus = "all" | "available" | "featured" | "sold";

export function CarsManager({ cars: initialCars, tenantSlug, tenantName, siteUrl }: CarsManagerProps) {
  const [cars, setCars] = useState(initialCars);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editCarId, setEditCarId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  React.useEffect(() => {
    setCars(initialCars);
  }, [initialCars]);

  const availableCount = cars.filter((c) => !c.is_sold).length;
  const soldCount = cars.filter((c) => c.is_sold).length;
  const featuredCount = cars.filter((c) => c.is_featured && !c.is_sold).length;

  const filteredCars = cars.filter((car) => {
    if (filter === "available") return !car.is_sold;
    if (filter === "featured") return car.is_featured && !car.is_sold;
    if (filter === "sold") return car.is_sold;
    return true;
  }).sort((a, b) => {
    if (a.is_sold === b.is_sold) return 0;
    return a.is_sold ? 1 : -1;
  });

  const handleToggle = (carId: string, currentIsSold: boolean) => {
    setTogglingId(carId);
    // Optimistic update
    setCars((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, is_sold: !currentIsSold } : c))
    );

    startTransition(async () => {
      try {
        await toggleCarSoldStatus(carId, !currentIsSold, tenantSlug);
      } catch (err) {
        // Revert on error
        setCars((prev) =>
          prev.map((c) => (c.id === carId ? { ...c, is_sold: currentIsSold } : c))
        );
        alert(`Błąd: ${err instanceof Error ? err.message : "Nieznany błąd"}`);
      } finally {
        setTogglingId(null);
      }
    });
  };

  const handleToggleFeatured = (carId: string, currentIsFeatured: boolean) => {
    setTogglingFeaturedId(carId);
    // Optimistic update
    setCars((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, is_featured: !currentIsFeatured } : c))
    );

    startTransition(async () => {
      try {
        await toggleCarFeaturedStatus(carId, !currentIsFeatured, tenantSlug);
      } catch (err) {
        // Revert on error
        setCars((prev) =>
          prev.map((c) => (c.id === carId ? { ...c, is_featured: currentIsFeatured } : c))
        );
        alert(`Błąd: ${err instanceof Error ? err.message : "Nieznany błąd"}`);
      } finally {
        setTogglingFeaturedId(null);
      }
    });
  };

  return (
    <div>

      {/* Filter Tabs */}
      <div style={styles.filterRow}>
        {(
          [
            { key: "all", label: `Wszystkie (${cars.length})`, color: "#94a3b8" },
            { key: "available", label: `Dostępne (${availableCount})`, color: "#10b981" },
            { key: "featured", label: `Wyróżnione (${featuredCount})`, color: "#f59e0b" },
            { key: "sold", label: `Sprzedane (${soldCount})`, color: "#ef4444" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              ...styles.filterTab,
              ...(filter === tab.key
                ? {
                    background: `${tab.color}20`,
                    color: tab.color,
                    borderColor: `${tab.color}50`,
                  }
                : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
        
        <div style={{ marginLeft: "auto" }}>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: isAdding ? "rgba(239, 68, 68, 0.15)" : "#10b981",
              color: isAdding ? "#ef4444" : "#fff",
              border: isAdding ? "1px solid rgba(239, 68, 68, 0.3)" : "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {isAdding ? "Anuluj dodawanie" : "Dodaj auto"}
          </button>
        </div>
      </div>

      {isAdding && (
        <CarForm 
          tenantSlug={tenantSlug} 
          onSuccess={() => setIsAdding(false)} 
          onCancel={() => setIsAdding(false)} 
        />
      )}

      {/* Cars List */}
      {cars.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: "#64748b" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>
            Brak samochodów w ofercie.
          </p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: "#64748b" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>
            {filter === "sold"
              ? "Brak sprzedanych samochodów"
              : filter === "available"
              ? "Brak dostępnych samochodów"
              : filter === "featured"
              ? "Brak wyróżnionych samochodów"
              : "Brak wyników"}
          </p>
        </div>
      ) : (
        <div style={styles.carsList}>
          {filteredCars.map((car) => (
            <div
              key={car.id}
              style={{
                ...styles.carRow,
                ...(car.is_sold ? { opacity: 0.7 } : {}),
              }}
            >
              {/* Image */}
              <div style={styles.carImage}>
                {car.images?.[0] ? (
                  <Image
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                ) : (
                  <div style={styles.noImage}>
                    <svg style={{ width: "32px", height: "32px", color: "#475569" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={styles.carInfo}>
                <div style={styles.carTitle}>
                  {car.make} {car.model}
                  {car.is_sold && (
                    <span style={{...styles.featuredBadge, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)"}}>
                      Sprzedany
                    </span>
                  )}
                  {car.is_featured && !car.is_sold && (
                    <span style={styles.featuredBadge}>Wyróżnione</span>
                  )}
                </div>
                <div style={styles.carSpecs}>
                  {car.year && <span>{car.year}</span>}
                  {car.fuel_type && (
                    <>
                      <span style={styles.dot}>·</span>
                      <span>{car.fuel_type}</span>
                    </>
                  )}
                  {car.mileage && (
                    <>
                      <span style={styles.dot}>·</span>
                      <span>{formatMileage(car.mileage)}</span>
                    </>
                  )}
                  {car.engine_capacity && (
                    <>
                      <span style={styles.dot}>·</span>
                      <span>{car.engine_capacity}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div style={styles.carPrice}>
                {car.price ? `${formatPrice(car.price)} PLN` : "—"}
              </div>

              {/* Action Buttons */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpenId(menuOpenId === car.id ? null : car.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: "8px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                {menuOpenId === car.id && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    background: "#1e293b",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "8px",
                    padding: "4px",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "180px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                  }}>
                    <button onClick={() => { setEditCarId(car.id); setMenuOpenId(null); }} style={styles.menuItem}>
                      Edytuj
                    </button>
                    {siteUrl && (
                      <a 
                        href={`${siteUrl}/${car.slug}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{...styles.menuItem, textDecoration: "none", display: "block"}}
                      >
                        Zobacz na stronie
                      </a>
                    )}
                    <button onClick={() => { handleToggleFeatured(car.id, !!car.is_featured); setMenuOpenId(null); }} style={styles.menuItem}>
                      {isPending && togglingFeaturedId === car.id ? "Aktualizacja..." : car.is_featured ? "Usuń wyróżnienie" : "Wyróżnij"}
                    </button>
                    <button onClick={() => { handleToggle(car.id, !!car.is_sold); setMenuOpenId(null); }} style={{...styles.menuItem, color: car.is_sold ? "#10b981" : "#ef4444"}}>
                      {isPending && togglingId === car.id ? "Aktualizacja..." : car.is_sold ? "Przywróć do oferty" : "Oznacz jako sprzedany"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(isAdding || editCarId) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <CarForm 
              tenantSlug={tenantSlug} 
              initialData={editCarId ? cars.find(c => c.id === editCarId) : null}
              onSuccess={() => { setIsAdding(false); setEditCarId(null); }} 
              onCancel={() => { setIsAdding(false); setEditCarId(null); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  menuItem: {
    background: "transparent",
    border: "none",
    color: "#f1f5f9",
    padding: "10px 12px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "13px",
    borderRadius: "6px",
    width: "100%",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#1e293b",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "14px",
    padding: "20px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#f1f5f9",
    lineHeight: "1.1",
  },
  statLabel: {
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: "4px",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterTab: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(30, 41, 59, 0.4)",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  carsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  carRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 18px",
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    borderRadius: "14px",
    transition: "all 0.15s ease",
  },
  carImage: {
    width: "72px",
    height: "52px",
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
    background: "rgba(15, 23, 42, 0.6)",
  },
  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#475569",
  },
  carInfo: {
    flex: 1,
    minWidth: 0,
  },
  carTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  featuredBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#f59e0b",
    background: "rgba(245, 158, 11, 0.12)",
    padding: "2px 8px",
    borderRadius: "6px",
  },
  carSpecs: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "3px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexWrap: "wrap",
  },
  dot: {
    color: "#475569",
  },
  carPrice: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    minWidth: "100px",
    textAlign: "right",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid",
    whiteSpace: "nowrap",
    minWidth: "90px",
    textAlign: "center",
  },
  actionsGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  toggleBtn: {
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(30, 41, 59, 0.3)",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
};
