import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types/database";
import { formatPrice, formatMileage } from "@/lib/utils";
import { getTenantUrl } from "@/lib/urls";
import { Car as CarIcon, ArrowUpRight } from "lucide-react";

interface CarCardProps {
  car: Car;
  dealerSlug: string;
  customDomain?: string | null;
  isCustomDomain?: boolean;
}

export function CarCard({ car, dealerSlug, customDomain, isCustomDomain }: CarCardProps) {
  const mainImage = car.images?.[0];
  const href = getTenantUrl(dealerSlug, `/${car.slug}`, customDomain, isCustomDomain);

  return (
    <Link
      href={href}
      id={`car-card-${car.slug}`}
      className={`group flex flex-col bg-white dark:bg-zinc-900 border rounded-lg overflow-hidden transition-all duration-150 ${
        car.is_sold
          ? "border-zinc-200 dark:border-zinc-800 opacity-60"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow"
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${car.make} ${car.model} ${car.year ?? ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-1.5">
            <CarIcon className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-[11px] font-medium">Zdjęcia w przygotowaniu</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {car.is_sold ? (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md shadow-sm">
              Sprzedany
            </span>
          ) : car.is_featured ? (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md shadow-sm">
              Wyróżniony
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-base text-zinc-950 dark:text-zinc-50 transition-colors line-clamp-1 group-hover:text-[var(--color-primary,#0d94e7)]">
              {car.make} {car.model}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" strokeWidth={2} />
          </div>

          {/* Specs */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {car.year && <span>{car.year}</span>}
            {car.fuel_type && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>{car.fuel_type}</span>
              </>
            )}
            {car.mileage !== undefined && car.mileage !== null && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>{formatMileage(car.mileage)}</span>
              </>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-baseline justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cena brutto</span>
          <span className="text-lg font-bold font-mono tabular-nums text-zinc-950 dark:text-zinc-50">
            {car.price ? `${formatPrice(car.price)} PLN` : "Zapytaj o cenę"}
          </span>
        </div>
      </div>
    </Link>
  );
}
