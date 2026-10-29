"use client";

import { useId } from "react";
import { ALL_MAKES, CAR_DATABASE } from "@/lib/car-database";
import type { CarFormValues } from "../types";

interface CarGeneralStepProps {
  values: Partial<CarFormValues>;
  errors: Partial<Record<keyof CarFormValues, string>>;
  onChange: <K extends keyof CarFormValues>(field: K, value: CarFormValues[K]) => void;
  customMake: string;
  setCustomMake: (val: string) => void;
  customModel: string;
  setCustomModel: (val: string) => void;
}

export function CarGeneralStep({
  values, errors, onChange, customMake, setCustomMake, customModel, setCustomModel,
}: CarGeneralStepProps) {
  const isMakeInDb = values.make ? ALL_MAKES.includes(values.make) : true;
  const isCustomMake = !isMakeInDb || values.make === "__other__";
  const availableModels = values.make && values.make !== "__other__" ? CAR_DATABASE[values.make] || [] : [];
  const isModelInDb = values.model ? availableModels.includes(values.model) : true;
  const isCustomModel = !isModelInDb || values.model === "__other__";

  const makeId = useId();
  const modelId = useId();
  const yearId = useId();
  const priceId = useId();
  const mileageId = useId();
  const vinId = useId();

  return (
    <div className="space-y-5">
      {/* Marka i Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={makeId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Marka pojazdu <span className="text-emerald-400">*</span>
          </label>
          <select
            id={makeId}
            value={isCustomMake ? "__other__" : values.make || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "__other__") {
                onChange("make", customMake || "");
              } else {
                onChange("make", val);
                onChange("model", "");
              }
            }}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
          >
            <option value="">-- Wybierz markę --</option>
            {ALL_MAKES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
            <option value="__other__">Inna marka...</option>
          </select>
          {isCustomMake && (
            <input
              type="text"
              placeholder="Wpisz nazwę marki"
              value={customMake}
              onChange={(e) => {
                setCustomMake(e.target.value);
                onChange("make", e.target.value);
              }}
              className="mt-2 w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          )}
          {errors.make && <p className="text-xs text-red-400 mt-1">{errors.make}</p>}
        </div>

        <div>
          <label htmlFor={modelId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Model pojazdu <span className="text-emerald-400">*</span>
          </label>
          <select
            id={modelId}
            disabled={!values.make}
            value={isCustomModel ? "__other__" : values.model || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "__other__") {
                onChange("model", customModel || "");
              } else {
                onChange("model", val);
              }
            }}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:opacity-50 transition-all"
          >
            <option value="">-- Wybierz model --</option>
            {availableModels.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
            <option value="__other__">Inny model...</option>
          </select>
          {isCustomModel && values.make && (
            <input
              type="text"
              placeholder="Wpisz nazwę modelu"
              value={customModel}
              onChange={(e) => {
                setCustomModel(e.target.value);
                onChange("model", e.target.value);
              }}
              className="mt-2 w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          )}
          {errors.model && <p className="text-xs text-red-400 mt-1">{errors.model}</p>}
        </div>
      </div>

      {/* Rocznik, Cena, Przebieg */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor={yearId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Rok produkcji <span className="text-emerald-400">*</span>
          </label>
          <input
            id={yearId}
            type="number"
            min={1950}
            max={new Date().getFullYear() + 1}
            value={values.year || ""}
            onChange={(e) => onChange("year", Number(e.target.value))}
            placeholder="2018"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
          {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
        </div>

        <div>
          <label htmlFor={priceId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Cena (PLN) <span className="text-emerald-400">*</span>
          </label>
          <input
            id={priceId}
            type="number"
            min={1}
            step="100"
            value={values.price || ""}
            onChange={(e) => onChange("price", Number(e.target.value))}
            placeholder="35000"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
          {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor={mileageId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Przebieg (km) <span className="text-emerald-400">*</span>
          </label>
          <input
            id={mileageId}
            type="number"
            min={0}
            value={values.mileage ?? ""}
            onChange={(e) => onChange("mileage", Number(e.target.value))}
            placeholder="185000"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
          {errors.mileage && <p className="text-xs text-red-400 mt-1">{errors.mileage}</p>}
        </div>
      </div>

      {/* Numer VIN */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={vinId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Numer VIN (17 znaków)
          </label>
          <span className="text-xs text-slate-500 font-mono">
            {(values.vin || "").length}/17
          </span>
        </div>
        <input
          id={vinId}
          type="text"
          maxLength={17}
          value={values.vin || ""}
          onChange={(e) => onChange("vin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
          placeholder="WVWZZZ3CZWE123456"
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none tracking-wider"
        />
        <p className="text-xs text-slate-500 mt-1">
          Wymagany do automatycznej weryfikacji w CEPiK oraz publikacji na portalu Autoplac.pl.
        </p>
        {errors.vin && <p className="text-xs text-red-400 mt-1">{errors.vin}</p>}
      </div>
    </div>
  );
}
