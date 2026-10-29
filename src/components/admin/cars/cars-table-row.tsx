"use client";

import Image from "next/image";
import { Car } from "@/types/database";
import { formatPrice, formatMileage } from "@/lib/utils";
import { Edit2, ExternalLink, Star, CheckCircle, Ban, Trash2, Car as CarIcon, Loader2 } from "lucide-react";

interface CarsTableRowProps {
  car: Car;
  siteUrl?: string;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onToggleSold: (carId: string, currentSold: boolean) => void;
  onToggleFeatured: (carId: string, currentFeatured: boolean) => void;
  isSoldToggling: boolean;
  isFeaturedToggling: boolean;
}

export function CarsTableRow({
  car,
  siteUrl,
  onEdit,
  onDelete,
  onToggleSold,
  onToggleFeatured,
  isSoldToggling,
  isFeaturedToggling,
}: CarsTableRowProps) {
  return (
    <div
      className={`p-4 bg-slate-900/60 border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        car.is_sold
          ? "border-slate-800/60 opacity-70 bg-slate-950/40"
          : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
      }`}
    >
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative w-24 h-16 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0 flex items-center justify-center">
          {car.images?.[0] ? (
            <Image src={car.images[0]} alt={`${car.make} ${car.model}`} fill className="object-cover" unoptimized />
          ) : (
            <CarIcon className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-100 truncate">
              {car.make} {car.model}
            </h4>

            {car.is_sold ? (
              <span className="px-2 py-0.5 bg-red-950/80 border border-red-500/30 text-red-400 text-[10px] font-semibold rounded-md">
                Sprzedany
              </span>
            ) : car.is_featured ? (
              <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-semibold rounded-md">
                Wyróżniony
              </span>
            ) : null}

            {car.export_to_autoplac && (
              <span className="px-1.5 py-0.5 bg-blue-950/60 border border-blue-500/20 text-blue-400 text-[10px] font-medium rounded">
                Autoplac
              </span>
            )}

            {car.vin && (
              <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                VIN: {car.vin}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            {car.year && <span>{car.year}</span>}
            {car.fuel_type && (
              <>
                <span className="text-slate-600">·</span>
                <span>{car.fuel_type}</span>
              </>
            )}
            {car.mileage !== undefined && car.mileage !== null && (
              <>
                <span className="text-slate-600">·</span>
                <span>{formatMileage(car.mileage)}</span>
              </>
            )}
            {car.engine_capacity && (
              <>
                <span className="text-slate-600">·</span>
                <span className="truncate max-w-[140px]">{car.engine_capacity}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Price & Quick Action Toolbar */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
        <div className="text-left md:text-right">
          <span className="text-base font-bold text-slate-100 font-mono">
            {car.price ? `${formatPrice(car.price)} PLN` : "—"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title={car.is_featured ? "Usuń wyróżnienie" : "Wyróżnij na stronie"}
            disabled={isFeaturedToggling || !!car.is_sold}
            onClick={() => onToggleFeatured(car.id, !!car.is_featured)}
            className={`p-2 rounded-xl text-xs transition-colors ${
              car.is_featured ? "text-amber-400 hover:bg-amber-950/50" : "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
            } disabled:opacity-40`}
          >
            {isFeaturedToggling ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} /> : <Star className="w-4 h-4" strokeWidth={1.75} />}
          </button>

          <button
            type="button"
            title={car.is_sold ? "Przywróć do oferty" : "Oznacz jako sprzedany"}
            disabled={isSoldToggling}
            onClick={() => onToggleSold(car.id, !!car.is_sold)}
            className={`p-2 rounded-xl text-xs transition-colors ${
              car.is_sold ? "text-emerald-400 hover:bg-emerald-950/50" : "text-slate-500 hover:text-red-400 hover:bg-slate-800"
            } disabled:opacity-40`}
          >
            {isSoldToggling ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} /> : car.is_sold ? <CheckCircle className="w-4 h-4" strokeWidth={1.75} /> : <Ban className="w-4 h-4" strokeWidth={1.75} />}
          </button>

          {siteUrl && (
            <a
              href={`${siteUrl}/${car.slug}`}
              target="_blank"
              rel="noreferrer"
              title="Zobacz na stronie komisu"
              className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            </a>
          )}

          <button
            type="button"
            title="Edytuj dane pojazdu"
            onClick={() => onEdit(car)}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Edit2 className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            title="Usuń z bazy"
            onClick={() => onDelete(car)}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
