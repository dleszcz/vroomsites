import Link from "next/link";
import { Phone, MessageCircle, RefreshCw, MapPin, Clock, ArrowRight } from "lucide-react";
import { DealerTenant } from "@/types/landing";
import { Car } from "@/types/database";
import { formatPrice } from "@/lib/utils";

interface SingleCarCtaBoxProps {
  car: Car;
  tenant: DealerTenant;
  tradeInHref: string;
}

export function SingleCarCtaBox({ car, tenant, tradeInHref }: SingleCarCtaBoxProps) {
  const phone = tenant.contact.phone || "";
  const cleanPhone = phone.replace(/\s+/g, "");
  const whatsapp = tenant.contact.whatsapp;
  const cleanWhatsapp = whatsapp?.replace(/\D/g, "");
  const carName = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}`;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-5 shadow-sm sticky top-6">
      {/* Price Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Cena brutto
        </span>
        {car.price && !car.is_sold ? (
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tabular-nums text-zinc-900">
                {formatPrice(car.price)}
              </span>
              <span className="text-base font-bold text-zinc-500">PLN</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Faktura VAT / VAT marża • Kupujący zwolniony z opłaty PCC 2%
            </p>
          </div>
        ) : (
          <div className="text-xl font-bold text-red-600">Pojazd Sprzedany</div>
        )}
      </div>

      <hr className="border-zinc-100" />

      {/* Primary CTAs */}
      {!car.is_sold && (
        <div className="space-y-2">
          {phone && (
            <a
              href={`tel:${cleanPhone}`}
              className="w-full h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
              style={{ color: "#ffffff" }}
            >
              <Phone className="w-4 h-4 text-white" strokeWidth={1.75} style={{ color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>Zadzwoń: {phone}</span>
            </a>
          )}

          {cleanWhatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Dzień%20dobry,%20pytam%20o%20samochód%20${encodeURIComponent(carName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-md inline-flex items-center justify-center gap-2 transition-colors border border-zinc-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
              <span>Napisz na WhatsApp</span>
            </a>
          )}
        </div>
      )}

      {/* Trade-In Prompt */}
      {tenant.businessRules?.tradeIn?.enabled && (
        <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-md space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
            <span>Zostaw auto w rozliczeniu</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Obniż cenę tego pojazdu oddając swój stary samochód w rozliczeniu.
          </p>
          <Link
            href={tradeInHref}
            className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1 pt-0.5"
          >
            <span>Darmowa wycena online</span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.75} />
          </Link>
        </div>
      )}

      {/* Dealer Location and Hours */}
      <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
        <div className="font-semibold text-zinc-900">{tenant.businessName}</div>
        {(tenant.location?.address || tenant.location?.city) && (
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>{tenant.location.address}{tenant.location.address && tenant.location.city ? ", " : ""}{tenant.location.city}</span>
          </div>
        )}
        <div className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>Pn–Pt: 08:00–18:00, Sob: 09:00–15:00</span>
        </div>
      </div>
    </div>
  );
}
