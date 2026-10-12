import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types/database";
import { formatPrice, formatMileage } from "@/lib/utils";

import { getTenantUrl } from "@/lib/urls";

interface CarCardProps {
  car: Car;
  dealerSlug: string;
  customDomain?: string | null;
  isCustomDomain?: boolean;
}

export function CarCard({ car, dealerSlug, customDomain, isCustomDomain }: CarCardProps) {
  const mainImage = car.images?.[0];

  return (
    <Link
      href={getTenantUrl(dealerSlug, `/${car.slug}`, customDomain, isCustomDomain)}
      id={`car-card-${car.slug}`}
      className="car-card"
    >
      <div className="car-card__image-wrapper">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${car.make} ${car.model} ${car.year ?? ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
            style={{ objectFit: "cover" }}
            className="car-card__image"
          />
        ) : (
          <div className="car-card__no-image">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9m-6-6h15m-6 0V6" />
            </svg>
          </div>
        )}
        {car.is_sold && (
          <div className="car-card__sold-badge">Sprzedany</div>
        )}
        {car.is_featured && !car.is_sold && (
          <div className="car-card__featured-badge">Wyróżnione</div>
        )}
      </div>

      <div className="car-card__content">
        <h3 className="car-card__title">
          {car.make} {car.model}
        </h3>

        <div className="car-card__specs">
          {car.year && <span>{car.year}</span>}
          {car.fuel_type && (
            <>
              <span className="car-card__dot">·</span>
              <span>{car.fuel_type}</span>
            </>
          )}
          {car.mileage && (
            <>
              <span className="car-card__dot">·</span>
              <span>{formatMileage(car.mileage)}</span>
            </>
          )}
        </div>

        {car.price && (
          <div className="car-card__price">{formatPrice(car.price)} PLN</div>
        )}
      </div>
    </Link>
  );
}
