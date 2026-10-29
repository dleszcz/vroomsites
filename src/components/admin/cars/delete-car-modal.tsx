"use client";

import { Car } from "@/types/database";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteCarModalProps {
  car: Car | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCarModal({
  car,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCarModalProps) {
  if (!isOpen || !car) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-950/60 border border-red-500/30 text-red-400 rounded-xl">
            <Trash2 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Usuń pojazd</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Czy na pewno chcesz usunąć <strong className="text-slate-200">{car.make} {car.model}</strong>? Tej operacji nie można cofnąć.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Anuluj
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />}
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
