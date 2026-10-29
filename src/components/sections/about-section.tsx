import React from "react";
import {
  MapPin,
  CarFront,
  Wrench,
  Banknote,
  ArrowLeftRight,
  Truck,
  FileCheck2,
  Phone,
  ArrowRight,
} from "lucide-react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";

interface Props {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function AboutSection({ tenant, config }: Props) {
  const carBuying = hasCarBuying(tenant);
  const rawTitle = config?.title;
  const title =
    !rawTitle || rawTitle.toLowerCase().includes("o nas")
      ? carBuying
        ? "Lokalny skup i sprzedaż aut z jasnymi zasadami"
        : "Sprawdzone samochody używane w uczciwych cenach"
      : rawTitle;
  const subtitle = config?.subtitle;
  const locationCity = tenant.location?.city || "Twojej okolicy";
  const locationText = tenant.location?.address
    ? `${tenant.location.address}, ${tenant.location.city}`
    : tenant.location?.city || "";

  const description =
    (config?.data?.description as string) ||
    tenant.businessDescription ||
    (carBuying
      ? `Jesteśmy lokalnym komisem i skupem aut${locationText ? ` z siedzibą: ${locationText}` : ""}. Działamy na rynku samochodów używanych bez gwiazdek i bez naciągania. Wiemy, że liczy się szybka, bezpieczna transakcja i gotówka do ręki, dlatego zapewniamy prosty proces, bezpłatny dojazd i minimum formalności.`
      : `Jesteśmy profesjonalnym salonem samochodów używanych${locationText ? ` z siedzibą: ${locationText}` : ""}. Oferujemy starannie wyselekcjonowane samochody osobowe i dostawcze z udokumentowaną historią, pełną fakturą i gwarancją legalności.`);

  // Only display image if tenant explicitly provided their own authentic photo
  const customImage = (config?.data?.imageUrl as string) || null;
  const hasLocation = Boolean(tenant.location?.address || tenant.location?.city);
  const primaryColor = tenant.branding.colors.primary || "var(--color-primary, #0d94e7)";

  const maxPriceLimit = tenant.businessRules?.purchasePriceLimit?.maxAmount || 10000;
  const formattedLimit = `${maxPriceLimit.toLocaleString("pl-PL")} zł`;

  const dealershipPillars = carBuying
    ? [
        {
          title: "Auta na każdą kieszeń",
          description:
            `Specjalizujemy się w przystępnych cenowo autach (do ${formattedLimit}) — idealnych na dojazdy do pracy, budżetowych i tanich w eksploatacji.`,
          icon: CarFront,
        },
        {
          title: "Skup w każdym stanie",
          description:
            "Odkupujemy pojazdy sprawne, do poprawek blacharskich, powypadkowe, a także bez ważnego przeglądu technicznego czy polisy OC.",
          icon: Wrench,
        },
        {
          title: "Gotówka od ręki",
          description:
            "Rzetelna wycena na miejscu i 100% ustalonej kwoty wypłacane natychmiast w gotówce przy podpisaniu jednoznacznej umowy kupna-sprzedaży.",
          icon: Banknote,
        },
        {
          title: "Auto w rozliczeniu",
          description:
            "Chcesz zmienić samochód? Zostaw swoje dotychczasowe auto w rozliczeniu i wyjedź od nas innym, dopłacając jedynie różnicę wartości.",
          icon: ArrowLeftRight,
        },
        {
          title: "Własna laweta & odbiór",
          description:
            `Przyjedziemy pod Twój dom na terenie ${locationCity} i okolicznych miejscowości. Zapewniamy bezpłatny odbiór pojazdu z Twojej posesji.`,
          icon: Truck,
        },
        {
          title: "Formalności w 15 minut",
          description:
            "Wszystkie dokumenty przygotowujemy sprawnie na miejscu. Otrzymujesz komplet papierów potrzebnych do natychmiastowego wyrejestrowania.",
          icon: FileCheck2,
        },
      ]
    : [
        {
          title: "Sprawdzony stan techniczny",
          description:
            "Każdy samochód osobowy i dostawczy przechodzi weryfikację podzespołów i układu jezdnego przed wystawieniem do sprzedaży.",
          icon: Wrench,
        },
        {
          title: "Szeroki wybór aut na placu",
          description:
            "W ofercie posiadamy zróżnicowane samochody osobowe, vany, furgony i pojazdy użytkowe gotowe do natychmiastowego odbioru.",
          icon: CarFront,
        },
        {
          title: "Transparentna historia i VIN",
          description:
            "Udostępniamy numer VIN, historię serwisową oraz umożliwiamy weryfikację na dowolnej stacji kontroli pojazdów lub w serwisie.",
          icon: FileCheck2,
        },
        {
          title: "Faktura i zwolnienie z PCC",
          description:
            "Wystawiamy pełną fakturę VAT-marża. Kupując u nas jesteś w 100% zwolniony z opłaty skarbowej 2% (PCC-2) w urzędzie skarbowym.",
          icon: Banknote,
        },
        {
          title: "Komplet dokumentów do rejestracji",
          description:
            "Kupując u nas otrzymujesz komplet niezbędnych dokumentów, dzięki czemu rejestracja pojazdu w wydziale komunikacji trwa chwilę.",
          icon: Truck,
        },
        {
          title: "Oględziny i jazda próbna",
          description:
            "Zapraszamy na spokojne oględziny auta, sprawdzenie powłoki lakierniczej oraz jazdę próbną na drodze bez presji.",
          icon: ArrowRight,
        },
      ];

  return (
    <section id="about" className="vd-section vd-section--bordered bg-white">
      <div className="vd-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Brand Story & Location */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span
                className="vd-eyebrow"
                style={{ color: primaryColor }}
              >
                O nas i naszych zasadach
              </span>
              <h2 className="vd-heading mb-4 text-zinc-950">{title}</h2>
              {subtitle && (
                <p
                  className="text-base font-semibold mb-4"
                  style={{ color: primaryColor }}
                >
                  {subtitle}
                </p>
              )}
              <p className="vd-copy text-zinc-700 leading-relaxed mb-6 font-normal">
                {description}
              </p>

              {customImage && (
                <div className="relative rounded-lg overflow-hidden border border-zinc-200 shadow-sm aspect-16/10 mb-6">
                  <img
                    src={customImage}
                    alt={tenant.businessName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {hasLocation && (
                <div className="flex items-center gap-3 text-sm font-semibold p-3.5 rounded-lg border bg-zinc-50 border-zinc-200 text-zinc-900 shadow-2xs">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--color-primary, #0d94e7) 12%, transparent)",
                      color: primaryColor,
                    }}
                  >
                    <MapPin className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Siedziba komisu
                    </span>
                    <span className="font-medium text-zinc-900">
                      {tenant.location?.address}
                      {tenant.location?.address && tenant.location?.city ? ", " : ""}
                      {tenant.location?.city}
                    </span>
                  </div>
                </div>
              )}

              {tenant.contact?.phone && (
                <a
                  href={`tel:${tenant.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm font-semibold p-3.5 rounded-lg border bg-zinc-50 border-zinc-200 text-zinc-900 shadow-2xs hover:border-zinc-300 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--color-primary, #0d94e7) 12%, transparent)",
                      color: primaryColor,
                    }}
                  >
                    <Phone className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Kontakt bezpośredni
                    </span>
                    <span className="font-mono tabular-nums font-bold text-zinc-900">
                      {tenant.contact.phone}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: 6 Dealership Pillars / DNA */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {dealershipPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors shadow-2xs flex flex-col justify-start"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center mb-3 shrink-0"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--color-primary, #0d94e7) 12%, transparent)",
                        color: primaryColor,
                      }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2.2} />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-zinc-950 mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
