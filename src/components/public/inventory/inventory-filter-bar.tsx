"use client";

import { Search, X, RotateCcw, ChevronDown } from "lucide-react";

export type StatusFilter = "available" | "sold" | "all";
export type SortOption = "newest" | "price_asc" | "price_desc";

interface InventoryFilterBarProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMake: string;
  onMakeChange: (make: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  selectedMaxPrice: string;
  onMaxPriceChange: (price: string) => void;
  selectedMinYear: string;
  onMinYearChange: (year: string) => void;
  selectedMaxMileage: string;
  onMaxMileageChange: (mileage: string) => void;
  selectedFuel: string;
  onFuelChange: (fuel: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  makes: string[];
  models: string[];
  fuels: string[];
  counts: {
    available: number;
    sold: number;
    all: number;
    filtered: number;
  };
  primaryColor?: string;
}

export function InventoryFilterBar({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  selectedMake,
  onMakeChange,
  selectedModel,
  onModelChange,
  selectedMaxPrice,
  onMaxPriceChange,
  selectedMinYear,
  onMinYearChange,
  selectedMaxMileage,
  onMaxMileageChange,
  selectedFuel,
  onFuelChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  makes,
  models,
  fuels,
  counts,
  primaryColor,
}: InventoryFilterBarProps) {
  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "available", label: "Dostępne", count: counts.available },
    { key: "sold", label: "Sprzedane", count: counts.sold },
    { key: "all", label: "Wszystkie", count: counts.all },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3.5 shadow-sm">
      {/* Top row: Status Tabs & Quick Counters */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusChange(tab.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? "text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                style={
                  isActive
                    ? { backgroundColor: primaryColor || "var(--color-primary, #1686E0)" }
                    : undefined
                }
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Resetuj filtry</span>
          </button>
        )}
      </div>

      {/* Middle row: Vehicle Param Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* 1. Marka */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
            Marka
          </label>
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => onMakeChange(e.target.value)}
              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors cursor-pointer"
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
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
            Model
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={models.length === 0}
              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none disabled:opacity-60 transition-colors cursor-pointer"
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
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
            Cena do
          </label>
          <div className="relative">
            <select
              value={selectedMaxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors font-mono cursor-pointer"
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
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
            Rocznik od
          </label>
          <div className="relative">
            <select
              value={selectedMinYear}
              onChange={(e) => onMinYearChange(e.target.value)}
              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors font-mono cursor-pointer"
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
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
            Przebieg do
          </label>
          <div className="relative">
            <select
              value={selectedMaxMileage}
              onChange={(e) => onMaxMileageChange(e.target.value)}
              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors font-mono cursor-pointer"
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
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
            Rodzaj paliwa
          </label>
          <div className="relative">
            <select
              value={selectedFuel}
              onChange={(e) => onFuelChange(e.target.value)}
              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors cursor-pointer"
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

      {/* Bottom row: Text Search and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 items-center">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Szukaj frazy (np. silnik, wersja, VIN, cecha)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-9 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="sm:col-span-4 relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md pl-3 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-400 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Najnowsze ogłoszenia</option>
            <option value="price_asc">Cena: od najniższej</option>
            <option value="price_desc">Cena: od najwyższej</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
