"use client";

import { DealerTenant } from "@/types/landing";
import { Car } from "@/types/database";
import { getTenantUrl } from "@/lib/urls";
import { formatPrice } from "@/lib/utils";
import { Phone } from "lucide-react";
import {
  SingleCarHeader,
  SingleCarGallery,
  SingleCarSpecsGrid,
  SingleCarDescription,
  SingleCarCtaBox,
  SingleCarRelated,
} from "./public/single-car";

interface SingleCarPageProps {
  tenant: DealerTenant;
  car: Car;
  relatedCars?: Car[];
  isCustomDomain?: boolean;
}

export function SingleCarPage({
  tenant,
  car,
  relatedCars = [],
  isCustomDomain,
}: SingleCarPageProps) {
  const carName = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}`;
  const inventoryHref = getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain);
  const homeHref = getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain);
  const tradeInHref = getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain, isCustomDomain);

  const phone = tenant.contact.phone || "";
  const cleanPhone = phone.replace(/\s+/g, "");

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 pb-20 lg:pb-12">
      {/* Crisp Editorial Header */}
      <SingleCarHeader
        carName={carName}
        isSold={Boolean(car.is_sold)}
        isFeatured={Boolean(car.is_featured)}
        exportToAutoplac={Boolean(car.export_to_autoplac)}
        dealerName={tenant.businessName}
        inventoryHref={inventoryHref}
        homeHref={homeHref}
      />

      {/* Main Details Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          {/* Left Column: Gallery, Specs, Description */}
          <div className="space-y-6 min-w-0">
            <SingleCarGallery images={car.images || []} alt={carName} />
            <SingleCarSpecsGrid car={car} />
            <SingleCarDescription description={car.description} />
          </div>

          {/* Right Column: Sticky Purchasing and Contact Box (Desktop) */}
          <aside className="w-full">
            <SingleCarCtaBox car={car} tenant={tenant} tradeInHref={tradeInHref} />
          </aside>
        </div>

        {/* Related Vehicles Section */}
        {relatedCars.length > 0 && (
          <SingleCarRelated
            cars={relatedCars}
            dealerSlug={tenant.slug}
            customDomain={tenant.customDomain}
            isCustomDomain={isCustomDomain}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom CTA Bar (< 60px height, unobtrusive, thumb-friendly) */}
      {!car.is_sold && phone && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div className="min-w-0 pr-2">
            <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Cena brutto</span>
            <span className="text-base font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
              {car.price ? `${formatPrice(car.price)} PLN` : "Zapytaj o cenę"}
            </span>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md inline-flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Zadzwoń teraz</span>
          </a>
        </div>
      )}
    </div>
  );
}
