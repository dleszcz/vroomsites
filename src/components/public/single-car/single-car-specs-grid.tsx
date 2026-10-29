import { Calendar, Gauge, Fuel, Cog, Palette, ShieldCheck, FileCheck } from "lucide-react";
import { Car } from "@/types/database";
import { formatMileage } from "@/lib/utils";

interface SingleCarSpecsGridProps {
  car: Car;
}

export function SingleCarSpecsGrid({ car }: SingleCarSpecsGridProps) {
  const specs = [
    { label: "Rok produkcji", value: car.year?.toString(), icon: Calendar },
    { label: "Przebieg", value: car.mileage ? formatMileage(car.mileage) : undefined, icon: Gauge },
    { label: "Rodzaj paliwa", value: car.fuel_type || undefined, icon: Fuel },
    { label: "Pojemność / Moc", value: car.engine_capacity || undefined, icon: Cog },
    { label: "Skrzynia biegów", value: car.transmission || undefined, icon: Cog },
    { label: "Kolor nadwozia", value: car.color || undefined, icon: Palette },
    { label: "Numer VIN", value: car.vin || undefined, icon: FileCheck, isMono: true },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
          <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Dane techniczne i specyfikacja
          </h2>
          <p className="text-xs text-zinc-500">Zweryfikowane parametry katalogowe pojazdu</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {specs.map((spec) => {
          const Icon = spec.icon;
          return (
            <div
              key={spec.label}
              className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-md space-y-1"
            >
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.75} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">{spec.label}</span>
              </div>
              <p className={`text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate ${spec.isMono ? "font-mono" : ""}`}>
                {spec.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
