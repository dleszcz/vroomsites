"use client";

import { Car, SearchX, Plus, RefreshCw } from "lucide-react";

interface CarsEmptyStateProps {
  isFiltered: boolean;
  onResetFilters?: () => void;
  onAddCar: () => void;
}

export function CarsEmptyState({ isFiltered, onResetFilters, onAddCar }: CarsEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="p-3 bg-slate-800/80 rounded-full text-slate-400 mb-3">
          <SearchX className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Brak wyników wyszukiwania
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Żaden pojazd we flocie nie odpowiada wybranym filtrom lub wprowadzonej frazie.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
            Wyczyść filtry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
      <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-emerald-400 mb-4">
        <Car className="w-8 h-8" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1">
        Twoja flota pojazdów jest pusta
      </h3>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
        Dodaj swój pierwszy samochód, aby natychmiast zaprezentować go na stronie komisu
        oraz wyeksportować do platformy ogłoszeniowej Autoplac.pl.
      </p>
      <button
        type="button"
        onClick={onAddCar}
        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-sm transition-all"
      >
        <Plus className="w-4 h-4" strokeWidth={1.75} />
        Dodaj pierwszy samochód
      </button>
    </div>
  );
}
