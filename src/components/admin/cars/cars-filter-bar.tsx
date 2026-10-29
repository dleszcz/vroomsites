"use client";

import { Search, X, Plus } from "lucide-react";
import type { FilterStatus } from "./types";

interface CarsFilterBarProps {
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    available: number;
    featured: number;
    sold: number;
  };
  onAddCar: () => void;
}

export function CarsFilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
  onAddCar,
}: CarsFilterBarProps) {
  const tabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: "all", label: "Wszystkie", count: counts.all },
    { key: "available", label: "Dostępne", count: counts.available },
    { key: "featured", label: "Wyróżnione", count: counts.featured },
    { key: "sold", label: "Sprzedane", count: counts.sold },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? "bg-emerald-900/60 text-emerald-300" : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & CTA */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Szukaj marki, modelu, VIN..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onAddCar}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} />
          Dodaj pojazd
        </button>
      </div>
    </div>
  );
}
