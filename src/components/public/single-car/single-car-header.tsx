import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface SingleCarHeaderProps {
  carName: string;
  isSold: boolean;
  isFeatured: boolean;
  exportToAutoplac?: boolean;
  dealerName?: string;
  inventoryHref: string;
  homeHref?: string;
}

export function SingleCarHeader({
  carName,
  isSold,
  isFeatured,
  exportToAutoplac,
  inventoryHref,
}: SingleCarHeaderProps) {
  return (
    <header className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Return to inventory link */}
        <div>
          <Link
            href={inventoryHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Powrót do oferty
          </Link>
        </div>

        {/* Title & Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {isSold ? (
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md shadow-sm">
                Sprzedany
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md shadow-sm inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                Dostępny od ręki
              </span>
            )}

            {isFeatured && !isSold && (
              <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md shadow-sm">
                Wyróżniony
              </span>
            )}

            {exportToAutoplac && (
              <span className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-700 text-[10px] font-semibold rounded-md shadow-2xs">
                Autoplac.pl
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950 font-heading leading-tight">
            {carName}
          </h1>
        </div>
      </div>
    </header>
  );
}
