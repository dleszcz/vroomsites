import { CheckCircle2, FileText } from "lucide-react";

interface SingleCarDescriptionProps {
  description?: string | null;
}

export function SingleCarDescription({ description }: SingleCarDescriptionProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
          <FileText className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Opis pojazdu i wyposażenie
          </h2>
          <p className="text-xs text-zinc-500">Szczegółowe informacje podane przez sprzedawcę</p>
        </div>
      </div>

      {description ? (
        <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line break-words">
          {description}
        </div>
      ) : (
        <p className="text-xs text-zinc-400 italic">Brak dodatkowego opisu tekstowego dla tego pojazdu.</p>
      )}

      {/* Trust guarantees bar */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} />
          <span>Sprawdzony stan techniczny</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} />
          <span>Pewny przebieg i historia</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} />
          <span>Prawnie bezpieczna transakcja</span>
        </div>
      </div>
    </div>
  );
}
