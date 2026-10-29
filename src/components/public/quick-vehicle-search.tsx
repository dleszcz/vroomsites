"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, RotateCcw, ArrowRight, ChevronDown } from "lucide-react";
import { DealerTenant } from "@/types/landing";
import { Car } from "@/types/database";
import { getTenantUrl } from "@/lib/urls";

interface QuickVehicleSearchProps {
  tenant: DealerTenant;
  cars: Car[];
  isCustomDomain?: boolean;
}

export function QuickVehicleSearch({ tenant, cars, isCustomDomain }: QuickVehicleSearchProps) {
  const router = useRouter();

  // State
  const [selectedMake, setSelectedMake] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>("all");
  const [selectedMinYear, setSelectedMinYear] = useState<string>("all");
  const [selectedMaxMileage, setSelectedMaxMileage] = useState<string>("all");
  const [selectedFuel, setSelectedFuel] = useState<string>("all");

  const primaryColor = tenant.branding?.colors?.primary || "#0d94e7";

  // Dynamic Options derived ONLY from available cars pool
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

  // Dynamic Matching Count
  const matchingCars = useMemo(() => {
    return cars.filter((car) => {
      if (selectedMake !== "all" && car.make?.toLowerCase() !== selectedMake.toLowerCase()) return false;
      if (selectedModel !== "all" && !car.model?.toLowerCase().includes(selectedModel.toLowerCase())) return false;
      if (selectedMaxPrice !== "all" && (car.price || 0) > Number(selectedMaxPrice)) return false;
      if (selectedMinYear !== "all" && (car.year || 0) < Number(selectedMinYear)) return false;
      if (selectedMaxMileage !== "all" && (car.mileage || 0) > Number(selectedMaxMileage)) return false;
      if (selectedFuel !== "all" && car.fuel_type?.toLowerCase() !== selectedFuel.toLowerCase()) return false;
      return true;
    });
  }, [cars, selectedMake, selectedModel, selectedMaxPrice, selectedMinYear, selectedMaxMileage, selectedFuel]);

  const hasActiveFilters =
    selectedMake !== "all" ||
    selectedModel !== "all" ||
    selectedMaxPrice !== "all" ||
    selectedMinYear !== "all" ||
    selectedMaxMileage !== "all" ||
    selectedFuel !== "all";

  const handleReset = () => {
    setSelectedMake("all");
    setSelectedModel("all");
    setSelectedMaxPrice("all");
    setSelectedMinYear("all");
    setSelectedMaxMileage("all");
    setSelectedFuel("all");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMake !== "all") params.set("make", selectedMake);
    if (selectedModel !== "all") params.set("model", selectedModel);
    if (selectedMaxPrice !== "all") params.set("maxPrice", selectedMaxPrice);
    if (selectedMinYear !== "all") params.set("minYear", selectedMinYear);
    if (selectedMaxMileage !== "all") params.set("maxMileage", selectedMaxMileage);
    if (selectedFuel !== "all") params.set("fuel", selectedFuel);

    const queryString = params.toString();
    const targetUrl = getTenantUrl(
      tenant.slug,
      queryString ? `/samochody?${queryString}` : "/samochody",
      tenant.customDomain,
      isCustomDomain
    );
    router.push(targetUrl);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 shadow-sm text-zinc-900 dark:text-zinc-100">
      {/* Search Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Search className="w-3.5 h-3.5" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-heading">
              Wyszukaj samochód na placu
            </h3>
            <p className="text-[11px] text-zinc-500">
              Dostępnych aut do natychmiastowego zakupu: {cars.length}
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Wyczyść filtry</span>
          </button>
        )}
      </div>

      {/* Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
        {/* 1. Marka */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
            Marka
          </label>
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel("all");
              }}
              className="w-full h-10 appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">Wszystkie marki ({makes.length})</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          </div>
        </div>

        {/* 2. Model */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
            Model
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={models.length === 0}
              className="w-full h-10 appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none disabled:opacity-60 transition-colors cursor-pointer"
            >
              <option value="all">Wszystkie modele</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          </div>
        </div>

        {/* 3. Cena do */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
            Cena do
          </label>
          <div className="relative">
            <select
              value={selectedMaxPrice}
              onChange={(e) => setSelectedMaxPrice(e.target.value)}
              className="w-full h-10 appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors font-mono cursor-pointer"
            >
              <option value="all">Dowolna cena</option>
              <option value="5000">do 5 000 zł</option>
              <option value="10000">do 10 000 zł</option>
              <option value="15000">do 15 000 zł</option>
              <option value="25000">do 25 000 zł</option>
              <option value="50000">do 50 000 zł</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          </div>
        </div>

        {/* 4. Rocznik od */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
            Rocznik od
          </label>
          <div className="relative">
            <select
              value={selectedMinYear}
              onChange={(e) => setSelectedMinYear(e.target.value)}
              className="w-full h-10 appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors font-mono cursor-pointer"
            >
              <option value="all">Dowolny rocznik</option>
              <option value="2000">od 2000</option>
              <option value="2005">od 2005</option>
              <option value="2008">od 2008</option>
              <option value="2010">od 2010</option>
              <option value="2015">od 2015</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          </div>
        </div>

        {/* 5. Przebieg do */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
            Przebieg do
          </label>
          <div className="relative">
            <select
              value={selectedMaxMileage}
              onChange={(e) => setSelectedMaxMileage(e.target.value)}
              className="w-full h-10 appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors font-mono cursor-pointer"
            >
              <option value="all">Dowolny przebieg</option>
              <option value="150000">do 150 000 km</option>
              <option value="200000">do 200 000 km</option>
              <option value="250000">do 250 000 km</option>
              <option value="300000">do 300 000 km</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          </div>
        </div>

        {/* 6. Paliwo */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">
            Rodzaj paliwa
          </label>
          <div className="relative">
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full h-10 appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">Wszystkie ({fuels.length})</option>
              {fuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-xs text-zinc-500 order-2 sm:order-1">
          {matchingCars.length > 0 ? (
            <>
              Znaleziono: <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{matchingCars.length}</strong> {matchingCars.length === 1 ? "samochód spełniający kryteria" : "samochodów spełniających kryteria"}
            </>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Brak aut o podanych kryteriach — zmień filtry
            </span>
          )}
        </span>

        <button
          type="button"
          onClick={handleSearch}
          className="w-full sm:w-auto h-10 px-6 rounded-md font-bold text-xs inline-flex items-center justify-center gap-2 text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer order-1 sm:order-2"
          style={{ backgroundColor: primaryColor }}
        >
          <span>Pokaż ogłoszenia ({matchingCars.length})</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
