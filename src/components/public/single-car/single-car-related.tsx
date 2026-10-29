import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Car } from "@/types/database";
import { CarCard } from "@/components/car-card";

interface SingleCarRelatedProps {
  cars: Car[];
  dealerSlug: string;
  customDomain?: string | null;
  isCustomDomain?: boolean;
}

export function SingleCarRelated({
  cars,
  dealerSlug,
  customDomain,
  isCustomDomain,
}: SingleCarRelatedProps) {
  if (cars.length === 0) return null;

  return (
    <section className="pt-10 border-t border-zinc-200 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--color-primary, #0d94e7)" }}
          >
            Pozostała oferta
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Podobne samochody w ofercie
          </h2>
        </div>

        <Link
          href={`/${dealerSlug}/samochody`}
          className="text-xs font-semibold hover:opacity-85 inline-flex items-center gap-1.5 transition-opacity self-start sm:self-auto"
          style={{ color: "var(--color-primary, #0d94e7)" }}
        >
          <span>Zobacz pełną ofertę komisu</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cars.slice(0, 3).map((car) => (
          <CarCard
            key={car.id}
            car={car}
            dealerSlug={dealerSlug}
            customDomain={customDomain}
            isCustomDomain={isCustomDomain}
          />
        ))}
      </div>
    </section>
  );
}
