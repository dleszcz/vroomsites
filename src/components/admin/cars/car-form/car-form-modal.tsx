"use client";

import { useEffect, useTransition } from "react";
import { X, Check, Loader2, Car as CarIcon, Wrench, Image as ImageIcon } from "lucide-react";
import { Car } from "@/types/database";
import { useCarForm } from "./use-car-form";
import { CarGeneralStep } from "./car-general-step";
import { CarSpecsStep } from "./car-specs-step";
import { CarPhotosStep } from "./car-photos-step";
import { createCar, updateCar } from "@/app/[dealerSlug]/admin/actions";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Car | null;
  tenantSlug: string;
}

export function CarFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  tenantSlug,
}: CarFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const form = useCarForm(initialData, isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.validate();
    if (!data) return;

    startTransition(async () => {
      try {
        const res = initialData?.id
          ? await updateCar(initialData.id, data, tenantSlug)
          : await createCar(data, tenantSlug);

        if (res?.error) {
          form.setGlobalError(res.error);
        } else {
          onSuccess();
          onClose();
        }
      } catch (err) {
        form.setGlobalError(err instanceof Error ? err.message : "Błąd zapisu pojazdu.");
      }
    });
  };

  const tabs = [
    { key: "general", label: "Podstawowe", icon: CarIcon, hasError: !!(form.formErrors.make || form.formErrors.model || form.formErrors.price || form.formErrors.vin) },
    { key: "specs", label: "Dane techniczne", icon: Wrench, hasError: !!(form.formErrors.fuel_type || form.formErrors.transmission) },
    { key: "photos", label: `Zdjęcia (${(form.values.images || []).length})`, icon: ImageIcon, hasError: !!form.formErrors.images },
  ] as const;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              {initialData ? `Edycja: ${initialData.make} ${initialData.model}` : "Dodaj nowy pojazd"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Wprowadź dane katalogowe, parametry i zdjęcia</p>
          </div>
          <button type="button" onClick={onClose} disabled={isPending} className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-2 gap-2 text-xs font-semibold">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = form.activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => form.setActiveTab(tab.key)}
                className={`pb-2.5 px-3 border-b-2 inline-flex items-center gap-1.5 transition-colors ${
                  isActive ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                {tab.label} {tab.hasError ? "•" : ""}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {form.globalError && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-200">
              {form.globalError}
            </div>
          )}

          {form.activeTab === "general" && (
            <CarGeneralStep
              values={form.values}
              errors={form.formErrors}
              onChange={form.handleChange}
              customMake={form.customMake}
              setCustomMake={form.setCustomMake}
              customModel={form.customModel}
              setCustomModel={form.setCustomModel}
            />
          )}

          {form.activeTab === "specs" && (
            <CarSpecsStep values={form.values} errors={form.formErrors} onChange={form.handleChange} />
          )}

          {form.activeTab === "photos" && (
            <CarPhotosStep
              images={form.values.images || []}
              tenantSlug={tenantSlug}
              onChange={(imgs) => form.handleChange("images", imgs)}
              error={form.formErrors.images}
            />
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors">
              Anuluj
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" strokeWidth={1.75} />
                  {initialData ? "Zapisz zmiany" : "Utwórz pojazd"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
