"use client";

import { useId } from "react";
import { FUEL_TYPES, TRANSMISSIONS, CAR_COLORS } from "@/lib/car-database";
import type { CarFormValues } from "../types";

interface CarSpecsStepProps {
  values: Partial<CarFormValues>;
  errors: Partial<Record<keyof CarFormValues, string>>;
  onChange: <K extends keyof CarFormValues>(field: K, value: CarFormValues[K]) => void;
}

export function CarSpecsStep({ values, errors, onChange }: CarSpecsStepProps) {
  const fuelId = useId();
  const transmissionId = useId();
  const engineId = useId();
  const colorId = useId();
  const descriptionId = useId();
  const autoplacId = useId();

  return (
    <div className="space-y-5">
      {/* Paliwo i Skrzynia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fuelId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Rodzaj paliwa <span className="text-emerald-400">*</span>
          </label>
          <select
            id={fuelId}
            value={values.fuel_type || "Benzyna"}
            onChange={(e) => onChange("fuel_type", e.target.value as CarFormValues["fuel_type"])}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
          >
            {FUEL_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.fuel_type && <p className="text-xs text-red-400 mt-1">{errors.fuel_type}</p>}
        </div>

        <div>
          <label htmlFor={transmissionId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Skrzynia biegów <span className="text-emerald-400">*</span>
          </label>
          <select
            id={transmissionId}
            value={values.transmission || "Manualna"}
            onChange={(e) => onChange("transmission", e.target.value as CarFormValues["transmission"])}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
          >
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.transmission && <p className="text-xs text-red-400 mt-1">{errors.transmission}</p>}
        </div>
      </div>

      {/* Pojemność i Kolor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={engineId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Pojemność / Moc silnika
          </label>
          <input
            id={engineId}
            type="text"
            placeholder="np. 2.0 TDI (150 KM) lub 1968 cm³"
            value={values.engine_capacity || ""}
            onChange={(e) => onChange("engine_capacity", e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor={colorId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Kolor nadwozia
          </label>
          <select
            id={colorId}
            value={values.color || "Czarny"}
            onChange={(e) => onChange("color", e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none transition-all"
          >
            {CAR_COLORS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Eksport do Autoplac */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <label htmlFor={autoplacId} className="text-sm font-medium text-slate-200 cursor-pointer">
            Eksportuj do Autoplac.pl
          </label>
          <p className="text-xs text-slate-400">
            Pojazd zostanie automatycznie dołączony do publicznego feedu XML dla portalu ogłoszeniowego.
          </p>
        </div>
        <input
          id={autoplacId}
          type="checkbox"
          checked={values.export_to_autoplac ?? true}
          onChange={(e) => onChange("export_to_autoplac", e.target.checked)}
          className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
        />
      </div>

      {/* Opis marketingowy */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={descriptionId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Opis pojazdu
          </label>
          <span className="text-xs text-slate-500">
            {(values.description || "").length} znaków
          </span>
        </div>
        <textarea
          id={descriptionId}
          rows={5}
          placeholder="Wprowadź szczegółowy opis pojazdu, stan techniczny, historię serwisową, wyposażenie..."
          value={values.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none resize-y transition-all"
        />
      </div>
    </div>
  );
}
