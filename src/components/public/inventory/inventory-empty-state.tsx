"use client";

import { SearchX, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface InventoryEmptyStateProps {
  onResetFilters: () => void;
  tradeInHref?: string;
  isTradeInEnabled?: boolean;
}

export function InventoryEmptyState({
  onResetFilters,
  tradeInHref,
  isTradeInEnabled,
}: InventoryEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 sm:p-12 text-center space-y-4 shadow-sm">
      <div className="inline-flex p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md">
        <SearchX className="w-6 h-6" strokeWidth={1.75} />
      </div>

      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Nie znaleziono samochodów
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Żaden pojazd w ofercie nie spełnia aktualnie wybranych kryteriów wyszukiwania lub filtrów.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-semibold rounded-md inline-flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 shadow-2xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
          Zresetuj wszystkie filtry
        </button>

        {isTradeInEnabled && tradeInHref && (
          <Link
            href={tradeInHref}
            className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Zleć odkup lub zamianę auta</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Link>
        )}
      </div>
    </div>
  );
}
