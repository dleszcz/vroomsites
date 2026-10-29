"use client";

import { Car } from "@/types/database";
import { CarsTableRow } from "./cars-table-row";

interface CarsTableProps {
  cars: Car[];
  siteUrl?: string;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onToggleSold: (carId: string, currentSold: boolean) => void;
  onToggleFeatured: (carId: string, currentFeatured: boolean) => void;
  togglingSoldId: string | null;
  togglingFeaturedId: string | null;
}

export function CarsTable({
  cars,
  siteUrl,
  onEdit,
  onDelete,
  onToggleSold,
  onToggleFeatured,
  togglingSoldId,
  togglingFeaturedId,
}: CarsTableProps) {
  return (
    <div className="space-y-3">
      {cars.map((car) => (
        <CarsTableRow
          key={car.id}
          car={car}
          siteUrl={siteUrl}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSold={onToggleSold}
          onToggleFeatured={onToggleFeatured}
          isSoldToggling={togglingSoldId === car.id}
          isFeaturedToggling={togglingFeaturedId === car.id}
        />
      ))}
    </div>
  );
}
