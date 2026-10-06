"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Car } from "@/types/database";
import { toggleCarSoldStatus, toggleCarFeaturedStatus } from "@/app/admin/actions";
import { formatPrice, formatMileage } from "@/lib/utils";

interface CarsManagerProps {
  cars: Car[];
  tenantSlug: string;
  tenantName: string;
}

type FilterStatus = "all" | "available" | "featured" | "sold";

export function CarsManager({ cars: initialCars, tenantSlug, tenantName }: CarsManagerProps) {
  const [cars, setCars] = useState(initialCars);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);


  const availableCount = cars.filter((c) => !c.is_sold).length;
  const soldCount = cars.filter((c) => c.is_sold).length;
  const featuredCount = cars.filter((c) => c.is_featured && !c.is_sold).length;

  const filteredCars = cars.filter((car) => {
    if (filter === "available") return !car.is_sold;
    if (filter === "featured") return car.is_featured && !car.is_sold;
    if (filter === "sold") return car.is_sold;
    return true;
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
      {/* Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{cars.length}</div>
          <div style={styles.statLabel}>Wszystkie auta</div>
        </div>
        <div style={{ ...styles.statCard, borderColor: "rgba(16, 185, 129, 0.3)" }}>
          <div style={{ ...styles.statNumber, color: "#10b981" }}>{availableCount}</div>
          <div style={styles.statLabel}>Dostępne</div>
        </div>
        <div style={{ ...styles.statCard, borderColor: "rgba(245, 158, 11, 0.3)" }}>
          <div style={{ ...styles.statNumber, color: "#f59e0b" }}>{featuredCount}</div>
          <div style={styles.statLabel}>Wyróżnione</div>
        </div>
        <div style={{ ...styles.statCard, borderColor: "rgba(239, 68, 68, 0.3)" }}>
          <div style={{ ...styles.statNumber, color: "#ef4444" }}>{soldCount}</div>
          <div style={styles.statLabel}>Sprzedane</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterRow}>
        {(
          [
            { key: "all", label: `Wszystkie (${cars.length})`, color: "#94a3b8" },
            { key: "available", label: `🟢 Dostępne (${availableCount})`, color: "#10b981" },
            { key: "featured", label: `⭐ Wyróżnione (${featuredCount})`, color: "#f59e0b" },
            { key: "sold", label: `🔴 Sprzedane (${soldCount})`, color: "#ef4444" },
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
      </div>

      {/* Cars List */}
      {cars.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: "48px", margin: "0 0 12px" }}>🚗</p>
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>
            Brak samochodów w bazie Supabase.
          </p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: "48px", margin: "0 0 12px" }}>🚗</p>
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
                  <div style={styles.noImage}>🚗</div>
                )}
              </div>

              {/* Info */}
              <div style={styles.carInfo}>
                <div style={styles.carTitle}>
                  {car.make} {car.model}
                  {car.is_featured && !car.is_sold && (
                    <span style={styles.featuredBadge}>⭐ Wyróżnione</span>
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

              {/* Status Badge */}
              <div
                style={{
                  ...styles.statusBadge,
                  ...(car.is_sold
                    ? { background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }
                    : { background: "rgba(16, 185, 129, 0.15)", color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)" }),
                }}
              >
                {car.is_sold ? "Sprzedany" : "Dostępny"}
              </div>

              {/* Action Buttons */}
              <div style={styles.actionsGroup}>
                <button
                  onClick={() => handleToggleFeatured(car.id, !!car.is_featured)}
                  disabled={isPending && togglingFeaturedId === car.id}
                  title={car.is_featured ? "Usuń wyróżnienie" : "Ustaw jako wyróżnione"}
                  style={{
                    ...styles.toggleBtn,
                    ...(car.is_featured
                      ? { background: "rgba(245, 158, 11, 0.18)", color: "#f59e0b", borderColor: "rgba(245, 158, 11, 0.45)" }
                      : { background: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", borderColor: "rgba(148, 163, 184, 0.2)" }),
                    ...(isPending && togglingFeaturedId === car.id ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                  }}
                >
                  {isPending && togglingFeaturedId === car.id
                    ? "⏳..."
                    : car.is_featured
                    ? "⭐ Wyróżniony"
                    : "☆ Wyróżnij"}
                </button>

                <button
                  onClick={() => handleToggle(car.id, car.is_sold)}
                  disabled={isPending && togglingId === car.id}
                  style={{
                    ...styles.toggleBtn,
                    ...(car.is_sold
                      ? { background: "rgba(16, 185, 129, 0.15)", color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)" }
                      : { background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }),
                    ...(isPending && togglingId === car.id ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                  }}
                >
                  {isPending && togglingId === car.id
                    ? "⏳ Aktualizacja..."
                    : car.is_sold
                    ? "↩️ Przywróć"
                    : "✅ Oznacz jako sprzedany"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
