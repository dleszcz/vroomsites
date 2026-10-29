"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Car } from "@/types/database";
import { toggleCarSoldStatus, toggleCarFeaturedStatus, deleteCar } from "@/app/[dealerSlug]/admin/actions";
import { CarsFilterBar } from "./cars-filter-bar";
import { CarsTable } from "./cars-table";
import { CarsEmptyState } from "./cars-empty-state";
import { CarFormModal } from "./car-form/car-form-modal";
import { DeleteCarModal } from "./delete-car-modal";
import type { FilterStatus, CarsManagerContainerProps } from "./types";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function CarsManagerContainer({
  initialCars,
  tenantSlug,
  tenantName,
  siteUrl,
}: CarsManagerContainerProps) {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingSoldId, setTogglingSoldId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [, startTransition] = useTransition();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const counts = {
    all: cars.length,
    available: cars.filter((c) => !c.is_sold).length,
    featured: cars.filter((c) => c.is_featured && !c.is_sold).length,
    sold: cars.filter((c) => c.is_sold).length,
  };

  const handleToggleSold = (carId: string, currentSold: boolean) => {
    setTogglingSoldId(carId);
    setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, is_sold: !currentSold } : c)));

    startTransition(async () => {
      const res = await toggleCarSoldStatus(carId, !currentSold, tenantSlug);
      if (!res?.success) {
        setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, is_sold: currentSold } : c)));
        showToast(res?.error || "Błąd zmiany statusu sprzedaży", "error");
      } else {
        showToast(currentSold ? "Przywrócono pojazd do oferty" : "Oznaczono jako sprzedany");
      }
      setTogglingSoldId(null);
    });
  };

  const handleToggleFeatured = (carId: string, currentFeatured: boolean) => {
    setTogglingFeaturedId(carId);
    setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, is_featured: !currentFeatured } : c)));

    startTransition(async () => {
      const res = await toggleCarFeaturedStatus(carId, !currentFeatured, tenantSlug);
      if (!res?.success) {
        setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, is_featured: currentFeatured } : c)));
        showToast(res?.error || "Błąd zmiany wyróżnienia", "error");
      } else {
        showToast(currentFeatured ? "Usunięto wyróżnienie pojazdu" : "Wyróżniono pojazd na stronie");
      }
      setTogglingFeaturedId(null);
    });
  };

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return;
    setIsDeleting(true);
    const res = await deleteCar(carToDelete.id, tenantSlug);
    setIsDeleting(false);

    if (res?.success) {
      setCars((prev) => prev.filter((c) => c.id !== carToDelete.id));
      setCarToDelete(null);
      showToast("Pojazd został trwale usunięty z bazy.");
      router.refresh();
    } else {
      showToast(res?.error || "Nie udało się usunąć pojazdu", "error");
    }
  };

  const filteredCars = cars.filter((car) => {
    if (filter === "available" && car.is_sold) return false;
    if (filter === "featured" && (!car.is_featured || car.is_sold)) return false;
    if (filter === "sold" && !car.is_sold) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return car.make.toLowerCase().includes(q) || car.model.toLowerCase().includes(q) || (car.vin?.toLowerCase().includes(q) ?? false);
    }
    return true;
  }).sort((a, b) => (a.is_sold === b.is_sold ? 0 : a.is_sold ? 1 : -1));

  return (
    <div className="space-y-4">
      {toast && (
        <div
          role="status"
          className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <CarsFilterBar
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
        onAddCar={() => { setEditingCar(null); setIsFormOpen(true); }}
      />

      {cars.length === 0 ? (
        <CarsEmptyState isFiltered={false} onAddCar={() => { setEditingCar(null); setIsFormOpen(true); }} />
      ) : filteredCars.length === 0 ? (
        <CarsEmptyState
          isFiltered={true}
          onResetFilters={() => { setFilter("all"); setSearchQuery(""); }}
          onAddCar={() => { setEditingCar(null); setIsFormOpen(true); }}
        />
      ) : (
        <CarsTable
          cars={filteredCars}
          siteUrl={siteUrl}
          onEdit={(car) => { setEditingCar(car); setIsFormOpen(true); }}
          onDelete={(car) => setCarToDelete(car)}
          onToggleSold={handleToggleSold}
          onToggleFeatured={handleToggleFeatured}
          togglingSoldId={togglingSoldId}
          togglingFeaturedId={togglingFeaturedId}
        />
      )}

      <CarFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => { router.refresh(); showToast(editingCar ? "Zaktualizowano dane pojazdu" : "Dodano nowy pojazd"); }}
        initialData={editingCar}
        tenantSlug={tenantSlug}
      />

      <DeleteCarModal
        car={carToDelete}
        isOpen={!!carToDelete}
        isDeleting={isDeleting}
        onClose={() => setCarToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
