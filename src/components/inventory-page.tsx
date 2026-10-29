"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DealerTenant } from "@/types/landing";
import { Car } from "@/types/database";
import { CarCard } from "@/components/car-card";
import { getTenantUrl } from "@/lib/urls";
import {
  InventoryFilterBar,
  InventoryEmptyState,
  InventorySkeleton,
  type StatusFilter,
  type SortOption,
} from "./public/inventory";

interface InventoryPageProps {
  tenant: DealerTenant;
  cars: Car[];
  isCustomDomain?: boolean;
}

function InventoryPageContent({ tenant, cars, isCustomDomain }: InventoryPageProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize from URL params
  const [selectedMake, setSelectedMake] = useState<string>(searchParams.get("make") || "all");
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get("model") || "all");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>(searchParams.get("maxPrice") || "all");
  const [selectedMinYear, setSelectedMinYear] = useState<string>(searchParams.get("minYear") || "all");
  const [selectedMaxMileage, setSelectedMaxMileage] = useState<string>(searchParams.get("maxMileage") || "all");
  const [selectedFuel, setSelectedFuel] = useState<string>(searchParams.get("fuel") || "all");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>((searchParams.get("status") as StatusFilter) || "available");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "newest");

  const primaryColor = tenant.branding?.colors?.primary || "#0d94e7";

  // Dynamic Options derived from cars
  const makes = useMemo(() => {
    const set = new Set<string>();
    cars.forEach((car) => {
      if (car.make) set.add(car.make.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const models = useMemo(() => {
    const set = new Set<string>();
    cars.forEach((car) => {
      if (selectedMake === "all" || car.make?.toLowerCase() === selectedMake.toLowerCase()) {
        if (car.model) {
          const baseModel = car.model.trim().split(" ")[0];
          set.add(baseModel);
        }
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cars, selectedMake]);

  const fuels = useMemo(() => {
    const set = new Set<string>();
    cars.forEach((car) => {
      if (car.fuel_type) set.add(car.fuel_type.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  // Synchronize URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedMake !== "all") params.set("make", selectedMake);
    if (selectedModel !== "all") params.set("model", selectedModel);
    if (selectedMaxPrice !== "all") params.set("maxPrice", selectedMaxPrice);
    if (selectedMinYear !== "all") params.set("minYear", selectedMinYear);
    if (selectedMaxMileage !== "all") params.set("maxMileage", selectedMaxMileage);
    if (selectedFuel !== "all") params.set("fuel", selectedFuel);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (statusFilter !== "available") params.set("status", statusFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);

    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, "", newUrl);
  }, [
    selectedMake,
    selectedModel,
    selectedMaxPrice,
    selectedMinYear,
    selectedMaxMileage,
    selectedFuel,
    searchQuery,
    statusFilter,
    sortBy,
    pathname,
  ]);

  const counts = useMemo(
    () => ({
      available: cars.filter((c) => !c.is_sold).length,
      sold: cars.filter((c) => c.is_sold).length,
      all: cars.length,
      filtered: 0,
    }),
    [cars]
  );

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const matchStatus =
          statusFilter === "all" ||
          (statusFilter === "available" && !car.is_sold) ||
          (statusFilter === "sold" && car.is_sold);

        const matchMake = selectedMake === "all" || car.make?.toLowerCase() === selectedMake.toLowerCase();
        const matchModel = selectedModel === "all" || car.model?.toLowerCase().includes(selectedModel.toLowerCase());
        const matchMaxPrice = selectedMaxPrice === "all" || (car.price || 0) <= Number(selectedMaxPrice);
        const matchMinYear = selectedMinYear === "all" || (car.year || 0) >= Number(selectedMinYear);
        const matchMaxMileage = selectedMaxMileage === "all" || (car.mileage || 0) <= Number(selectedMaxMileage);
        const matchFuel = selectedFuel === "all" || car.fuel_type?.toLowerCase() === selectedFuel.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q || `${car.make} ${car.model} ${car.year ?? ""} ${car.vin ?? ""}`.toLowerCase().includes(q);

        return (
          matchStatus &&
          matchMake &&
          matchModel &&
          matchMaxPrice &&
          matchMinYear &&
          matchMaxMileage &&
          matchFuel &&
          matchSearch
        );
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      });
  }, [
    cars,
    statusFilter,
    selectedMake,
    selectedModel,
    selectedMaxPrice,
    selectedMinYear,
    selectedMaxMileage,
    selectedFuel,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedMake !== "all" ||
    selectedModel !== "all" ||
    selectedMaxPrice !== "all" ||
    selectedMinYear !== "all" ||
    selectedMaxMileage !== "all" ||
    selectedFuel !== "all" ||
    searchQuery.trim() !== "" ||
    statusFilter !== "available";

  const handleResetFilters = () => {
    setSelectedMake("all");
    setSelectedModel("all");
    setSelectedMaxPrice("all");
    setSelectedMinYear("all");
    setSelectedMaxMileage("all");
    setSelectedFuel("all");
    setSearchQuery("");
    setStatusFilter("available");
    setSortBy("newest");
  };

  const tradeInHref = getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain);
  const homeHref = getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <div>
        {/* Crisp Header */}
        <header className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 py-8 md:py-9">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1.5">
            <span
              className="text-[11px] font-bold uppercase tracking-wider block"
              style={{ color: primaryColor }}
            >
              Sprawdzona oferta komisowa
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-zinc-950">
              Samochody na sprzedaż — {tenant.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Przejrzyj zweryfikowane pojazdy z gwarancją autentyczności przebiegu, badaniem technicznym i możliwością
              zakupu w rozliczeniu.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
          <InventoryFilterBar
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMake={selectedMake}
            onMakeChange={(make) => {
              setSelectedMake(make);
              setSelectedModel("all");
            }}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            selectedMaxPrice={selectedMaxPrice}
            onMaxPriceChange={setSelectedMaxPrice}
            selectedMinYear={selectedMinYear}
            onMinYearChange={setSelectedMinYear}
            selectedMaxMileage={selectedMaxMileage}
            onMaxMileageChange={setSelectedMaxMileage}
            selectedFuel={selectedFuel}
            onFuelChange={setSelectedFuel}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            makes={makes}
            models={models}
            fuels={fuels}
            counts={{ ...counts, filtered: filteredCars.length }}
            primaryColor={primaryColor}
          />

          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  dealerSlug={tenant.slug}
                  customDomain={tenant.customDomain}
                  isCustomDomain={isCustomDomain}
                />
              ))}
            </div>
          ) : (
            <InventoryEmptyState
              onResetFilters={handleResetFilters}
              tradeInHref={tradeInHref}
              isTradeInEnabled={Boolean(tenant.businessRules?.tradeIn?.enabled)}
            />
          )}

          {/* Trade-In Banner */}
          {tenant.businessRules?.tradeIn?.enabled && (
            <div className="p-5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Zamiana lub skup
                </span>
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 font-heading">
                  Chcesz zostawić swoje dotychczasowe auto w rozliczeniu?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Dokonamy natychmiastowej bezpłatnej wyceny i obniżymy cenę wybranego pojazdu.
                </p>
              </div>
              <Link
                href={tradeInHref}
                className="px-4 py-2 text-white text-xs font-semibold rounded-md inline-flex items-center gap-2 hover:opacity-95 transition-all whitespace-nowrap shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Wyceń swoje auto</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function InventoryPage(props: InventoryPageProps) {
  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryPageContent {...props} />
    </Suspense>
  );
}
