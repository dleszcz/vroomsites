import React from "react";
import { ArrowRight } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { getCars } from "@/lib/data";
import { CarCard } from "@/components/car-card";
import { getTenantUrl } from "@/lib/urls";

interface Props { tenant: DealerTenant; config?: SectionConfig; isCustomDomain?: boolean; }

export async function VehiclesSection({ tenant, isCustomDomain }: Props) {
  const allCars = (await getCars(tenant.id)).filter(car => !car.is_sold);
  if (!allCars.length) return null;

  const displayLimit = 5;
  const carsToDisplay = allCars.slice(0, displayLimit);
  const hasMore = allCars.length > displayLimit;
  const catalogUrl = getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain);

  return (
    <section id="vehicles" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div className="vehicles__header">
          <div>
            <span className="vd-eyebrow">Aktualna oferta</span>
            <h2 className="vd-heading">Samochody na sprzedaż</h2>
          </div>
          {hasMore && (
            <a className="vehicles__all" href={catalogUrl}>
              <span>Zobacz wszystkie ({allCars.length})</span>
              <ArrowRight size={14} />
            </a>
          )}
        </div>
        <div className="vehicles__grid">
          {carsToDisplay.map(car => (
            <CarCard
              key={car.id}
              car={car}
              dealerSlug={tenant.slug}
              customDomain={tenant.customDomain}
              isCustomDomain={isCustomDomain}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
