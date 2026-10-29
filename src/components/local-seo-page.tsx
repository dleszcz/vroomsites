"use client";

import React, { useState } from "react";
import { DealerTenant, LocalPageConfig, hasCarBuying } from "@/types/landing";
import { Car } from "@/types/database";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocalSeoSchema } from "@/components/local-seo-schema";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  Wrench,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { CarCard } from "@/components/car-card";
import { getTenantUrl } from "@/lib/urls";

interface LocalSeoPageProps {
  tenant: DealerTenant;
  localPage: LocalPageConfig;
  baseUrl: string;
  isCustomDomain?: boolean;
  cars?: Car[];
}

function getCityInflection(city: string) {
  const map: Record<string, { locative: string; genitive: string }> = {
    Topólka: { locative: "Topólce", genitive: "Topólki" },
    Radziejów: { locative: "Radziejowie", genitive: "Radziejowa" },
    Lubraniec: { locative: "Lubrańcu", genitive: "Lubrańca" },
    "Izbica Kujawska": { locative: "Izbicy Kujawskiej", genitive: "Izbicy Kujawskiej" },
    "Brześć Kujawski": { locative: "Brześciu Kujawskim", genitive: "Brześcia Kujawskiego" },
    "Piotrków Kujawski": { locative: "Piotrkowie Kujawskim", genitive: "Piotrkowa Kujawskiego" },
    Osięciny: { locative: "Osięcinach", genitive: "Osięcin" },
    Włocławek: { locative: "Włocławku", genitive: "Włocławka" },
    Kruszwica: { locative: "Kruszwicy", genitive: "Kruszwicy" },
    Inowrocław: { locative: "Inowrocławiu", genitive: "Inowrocławia" },
    "Aleksandrów Kujawski": { locative: "Aleksandrowie Kujawskim", genitive: "Aleksandrowa Kujawskiego" },
    Gniewkowo: { locative: "Gniewkowie", genitive: "Gniewkowa" },
    Strzelno: { locative: "Strzelnie", genitive: "Strzelna" },
    "Dąbrowa Biskupia": { locative: "Dąbrowie Biskupiej", genitive: "Dąbrowy Biskupiej" },
    Konin: { locative: "Koninie", genitive: "Konina" },
    Lipno: { locative: "Lipnie", genitive: "Lipna" },
    Bytoń: { locative: "Bytoniu", genitive: "Bytonia" },
    Choceń: { locative: "Choceniu", genitive: "Chocenia" },
    Kowal: { locative: "Kowalu", genitive: "Kowala" },
    Chodecz: { locative: "Chodczu", genitive: "Chodcza" },
    Sompolno: { locative: "Sompolnie", genitive: "Sompolna" },
    Babiak: { locative: "Babiaku", genitive: "Babiaka" },
  };

  const entry = map[city];
  return {
    locative: entry?.locative || city,
    genitive: entry?.genitive || city,
  };
}

export function LocalSeoPage({ tenant, localPage, baseUrl, isCustomDomain, cars = [] }: LocalSeoPageProps) {
  const cityInfo = getCityInflection(localPage.city);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const carBuying = hasCarBuying(tenant);
  const isSalesOnly = !carBuying || localPage.mode === "sales";

  const phone = tenant.contact.phone || "";
  const cleanPhone = phone.replace(/\s/g, "");
  const heroImage =
    localPage.media?.heroImage ||
    tenant.branding.media?.heroImageUrl ||
    "/images/default-hero.webp";
  const primaryColor = tenant.branding.colors.primary || "#1686E0";

  const canonicalUrl = `${baseUrl}/${localPage.slug}`;

  const breadcrumbs = [
    { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain) },
    {
      label: isSalesOnly ? "Samochody na sprzedaż" : "Skup aut",
      href: getTenantUrl(tenant.slug, isSalesOnly ? "/samochody" : "/skup-aut", tenant.customDomain, isCustomDomain),
    },
    { label: localPage.city },
  ];

  const availableCars = cars.filter((c) => !c.is_sold);
  const displayedCars = availableCars.slice(0, 6);

  const handlePhoneClick = () => {
    trackEvent("cta_click", {
      type: "phone",
      value: phone,
      localSeoCity: localPage.city,
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone) return;

    setIsSubmitting(true);
    trackEvent("lead_form_started", { localSeoCity: localPage.city });

    try {
      const searchParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : new URLSearchParams();
      const attribution = {
        utm_source: searchParams.get("utm_source") || null,
        utm_medium: searchParams.get("utm_medium") || null,
        utm_campaign: searchParams.get("utm_campaign") || null,
        utm_content: searchParams.get("utm_content") || null,
        gclid: searchParams.get("gclid") || null,
        fbclid: searchParams.get("fbclid") || null,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant.id,
          name: customerName,
          phone: customerPhone,
          vehicleDetails: isSalesOnly
            ? `[Zapytanie o zakup w ${localPage.city}]: ${vehicleDetails || "Brak szczegółów"}`
            : vehicleDetails,
          source: `local-seo-${localPage.slug}`,
          attribution,
        }),
      });

      if (res.ok) {
        setLeadFormSubmitted(true);
        trackEvent("lead_submitted", { localSeoCity: localPage.city });
      }
    } catch {
      // Graceful error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LocalSeoSchema tenant={tenant} localPage={localPage} canonicalUrl={canonicalUrl} />

      <div className="local-seo-page">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Local Hero Section */}
        <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-800">
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={
                isSalesOnly
                  ? `Samochody używane w ${cityInfo.locative} - ${tenant.businessName}`
                  : `Skup aut w ${localPage.city} - ${tenant.businessName}`
              }
              className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
            />
          )}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-3xl mb-4 font-heading leading-tight">
              {isSalesOnly
                ? (
                    localPage.seo?.h1 ||
                    `Sprawdzone samochody osobowe i dostawcze w ${cityInfo.locative}`
                  ).replace(/—|–/g, "-")
                : (
                    localPage.seo?.h1 ||
                    `Skup aut w ${cityInfo.locative} - ${tenant.businessName}`
                  ).replace(/—|–/g, "-")}
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mb-8 leading-relaxed">
              {isSalesOnly
                ? (
                    localPage.content?.intro ||
                    `Szukasz pewnego auta z gwarancją i udokumentowaną historią w ${cityInfo.locative}? Poznaj wyselekcjonowaną ofertę samochodów osobowych i dostawczych w ${tenant.businessName}. Zapewniamy pełną transparentność, weryfikację techniczną i pomoc we wszystkich formalnościach.`
                  ).replace(/—|–/g, "-")
                : (
                    localPage.content?.intro ||
                    `Oferujemy bezpieczny skup aut za gotówkę w ${cityInfo.locative} i okolicach. Bezpłatna wycena, szybki dojazd i umowa na miejscu.`
                  ).replace(/—|–/g, "-")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  onClick={handlePhoneClick}
                  className="vd-button vd-button--primary inline-flex items-center gap-2 text-white font-semibold shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Phone size={16} />
                  <span>Zadzwoń: {phone}</span>
                </a>
              )}

              {isSalesOnly ? (
                <a
                  href={getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain)}
                  className="vd-button vd-button--outline-dark inline-flex items-center gap-2 text-white border-zinc-700 hover:bg-zinc-900"
                >
                  <span>Zobacz pełną ofertę ({availableCars.length})</span>
                  <ArrowRight size={15} />
                </a>
              ) : (
                <a
                  href="#local-lead-form"
                  className="vd-button vd-button--outline-dark inline-flex items-center gap-2 text-white border-zinc-700 hover:bg-zinc-900"
                >
                  <span>Darmowa wycena online</span>
                  <ArrowRight size={15} />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Sales-Specific Section: Samochody na placu dla danej lokalizacji */}
        {isSalesOnly && displayedCars.length > 0 && (
          <section className="py-12 sm:py-16 bg-zinc-50 border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-heading">
                    Dostępne samochody od ręki — {localPage.city}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 mt-1">
                    Wybrane pojazdy z naszego placu gotowe do natychmiastowego odbioru lub dostawy do {cityInfo.genitive}.
                  </p>
                </div>
                <a
                  href={getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  style={{ color: primaryColor }}
                >
                  <span>Wszystkie ogłoszenia ({availableCars.length})</span>
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCars.map((car) => (
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
        )}

        {/* Service Description & Local Coverage */}
        <section className="py-12 sm:py-16 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-heading mb-4">
                  {isSalesOnly
                    ? `Pewne auta z gwarancją dla mieszkańców ${cityInfo.genitive}`
                    : `Skupujemy samochody w ${cityInfo.locative} za gotówkę`}
                </h2>
                <p className="text-base text-zinc-600 leading-relaxed mb-6">
                  {isSalesOnly
                    ? (
                        localPage.content?.serviceDescription ||
                        `Salon ${tenant.businessName} dostarcza mieszkańcom ${cityInfo.genitive} i okolic sprawdzone samochody osobowe, vany oraz pojazdy dostawcze. Każdy egzemplarz przed wystawieniem przechodzi skrupulatną kontrolę mechaniczną, weryfikację grubości powłoki lakierniczej oraz badanie komputerowe.`
                      ).replace(/—|–/g, "-")
                    : (
                        localPage.content?.serviceDescription ||
                        `Zapewniamy profesjonalny skup pojazdów od mieszkańców ${cityInfo.locative}. Kupujemy auta osobowe, dostawcze oraz w każdym stanie technicznym.`
                      ).replace(/—|–/g, "-")}
                </p>

                {localPage.content?.locationNote && (
                  <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <MapPin size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-wider block mb-1"
                        style={{ color: primaryColor }}
                      >
                        Lokalna obsługa • {localPage.city}
                      </span>
                      <p className="text-sm text-zinc-800 font-medium m-0 leading-normal">
                        {localPage.content.locationNote.replace(/—|–/g, "-")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Value Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isSalesOnly ? (
                  <>
                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <ShieldCheck size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">
                        Sprawdzony Stan & VIN
                      </h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Udostępniamy numer VIN, historię serwisową i umożliwiamy sprawdzenie na dowolnej stacji kontroli pojazdów.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <FileCheck2 size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">
                        Komplet Dokumentów
                      </h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Wystawiamy fakturę (zwolnienie z 2% podatku PCC). Samochody są gotowe do natychmiastowej rejestracji.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Wrench size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">
                        Stacja diagnostyczna & Jazda próbna
                      </h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Umożliwiamy pełną weryfikację pojazdu na wybranej przez Ciebie stacji kontroli oraz spokojną jazdę próbną.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Truck size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">
                        Dostawa pod dom
                      </h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Dowieziemy zakupiony pojazd naszą autolawetą bezpośrednio pod Twój adres w {cityInfo.locative}.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Wallet size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">Płatność gotówką od ręki</h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Pieniądze wypłacamy natychmiast przy podpisaniu umowy: gotówką lub przelewem ekspresowym.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Truck size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">Bezpłatny odbiór lawetą</h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Odbieramy uszkodzone i niesprawne samochody bezpośrednio spod domu w {cityInfo.locative}.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <ShieldCheck size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">Formalności na miejscu</h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Przygotowujemy legalną umowę kupna-sprzedaży i komplet dokumentów do wyrejestrowania i ubezpieczyciela.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs space-y-2">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Sparkles size={20} style={{ color: primaryColor }} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">Wycena w 15 minut</h3>
                      <p className="text-sm text-zinc-600 leading-normal">
                        Rzetelna kalkulacja wartości rynkowej Twojego pojazdu bez zbędnego zbijania ceny.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 sm:py-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-heading">
                {isSalesOnly
                  ? `Jak wygląda zakup auta dla klientów z ${cityInfo.genitive}?`
                  : `Jak sprzedać auto z ${cityInfo.genitive}?`}
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-2">
                {isSalesOnly
                  ? "Prosty, przejrzysty i w 100% bezpieczny proces w zaledwie czterech krokach."
                  : "Bezproblemowy odkup pojazdu w czterech prostych krokach z dojazdem."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isSalesOnly ? (
                <>
                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      01
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Wybór i weryfikacja</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Przeglądasz aktualną ofertę na stronie i kontaktujesz się w sprawie interesującego modelu.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      02
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Oględziny & Jazda</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Zapraszamy na jazdę próbną oraz sprawdzenie samochodu na wybranej stacji diagnostycznej.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      03
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Płatność i faktura</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Wybierasz dogodną formę: tradycyjny przelew bankowy lub gotówka. Otrzymujesz komplet dokumentów i fakturę VAT-marża.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      04
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Odbiór lub dostawa</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Odbierasz kluczyki z kompletem dokumentów lub zamawiasz bezpieczny dowóz pod dom w {cityInfo.locative}.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      01
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Formularz lub telefon</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Zadzwoń lub wypełnij krótki formularz wyceny podając podstawowe dane o samochodzie.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      02
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Wycena w 15 minut</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Przedstawiamy uczciwą i rzetelną wycenę rynkową Twojego pojazdu.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      03
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Odbiór z {localPage.city}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Przyjeżdżamy we wskazane miejsce w {localPage.city} i załatwiamy formalności na miejscu.
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-2xl font-black mb-3 font-mono" style={{ color: primaryColor }}>
                      04
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">Wypłata gotówki</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Otrzymujesz pieniądze od ręki i dokumenty potwierdzające sprzedaż.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Local FAQ Section */}
        {localPage.content?.faq && localPage.content.faq.length > 0 && (
          <section className="py-12 sm:py-16 bg-white border-b border-zinc-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-heading">
                  {isSalesOnly
                    ? `Pytania o zakup samochodu w okolicach ${cityInfo.genitive}`
                    : `Pytania dotyczące skupu aut w ${localPage.city}`}
                </h2>
              </div>

              <div className="space-y-3">
                {localPage.content.faq.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="rounded-lg border border-zinc-200 overflow-hidden bg-white">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 flex justify-between items-center text-left font-bold text-sm sm:text-base text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <span>{item.q.replace(/—|–/g, "-")}</span>
                        <ChevronDown
                          size={18}
                          className="shrink-0 transition-transform duration-200"
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            color: primaryColor,
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                          {item.a.replace(/—|–/g, "-")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Lead Form / Inquiry Section */}
        <section id="local-lead-form" className="py-12 sm:py-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight font-heading">
                {isSalesOnly
                  ? `Szukasz samochodu w ${cityInfo.locative}?`
                  : `Sprzedaj auto w ${localPage.city}`}
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-2">
                {isSalesOnly
                  ? "Zostaw numer telefonu lub napisz, jakiego pojazdu szukasz. Skontaktujemy się z dopasowaną propozycją."
                  : "Wypełnij formularz — skontaktujemy się z Tobą w ciągu 15 minut z propozycją cenową."}
              </p>
            </div>

            {leadFormSubmitted ? (
              <div
                className="p-8 rounded-lg bg-white border-2 text-center"
                style={{ borderColor: primaryColor }}
              >
                <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-zinc-950 font-heading mb-2">Dziękujemy za kontakt!</h3>
                <p className="text-sm text-zinc-600 m-0">
                  Nasz doradca skontaktuje się z Tobą telefonicznie w najbliższym czasie.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleLeadSubmit}
                className="p-6 sm:p-8 rounded-lg bg-white border border-zinc-200 shadow-sm space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Imię / Nazwisko
                  </label>
                  <input
                    type="text"
                    placeholder="np. Jan Kowalski"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-zinc-200 text-sm text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Numer telefonu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="np. 500 000 000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-zinc-200 text-sm text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    {isSalesOnly
                      ? "Jakiego auta poszukujesz? (marka, budżet, rocznik)"
                      : "Informacje o samochodzie"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      isSalesOnly
                        ? `np. Szukam SUV-a lub kombi do 45 tys. zł z okolic ${cityInfo.genitive}`
                        : `Marka, model, rok produkcji, stan techniczny (np. Golf 2018 z ${localPage.city})`
                    }
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-zinc-200 text-sm text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-y"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="localRodoConsent"
                    required
                    defaultChecked
                    className="mt-0.5 rounded border-zinc-300 cursor-pointer"
                    style={{ accentColor: primaryColor }}
                  />
                  <label htmlFor="localRodoConsent" className="text-xs text-zinc-500 leading-normal cursor-pointer">
                    Wyrażam zgodę na kontakt w sprawie oferty oraz akceptuję{" "}
                    <a
                      href={`/${tenant.slug}/polityka-prywatnosci`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-zinc-950"
                    >
                      Politykę Prywatności
                    </a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-md font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{isSubmitting ? "Wysyłanie..." : isSalesOnly ? "Zapytaj o samochód" : "Wyślij zgłoszenie do wyceny"}</span>
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Related Local Locations Internal Linking */}
        {(() => {
          const otherLocalPages = (tenant.localSeo?.localPages || []).filter(
            (lp) => lp.enabled && lp.indexable && lp.slug !== localPage.slug
          );
          if (otherLocalPages.length === 0) return null;

          return (
            <section className="py-10 bg-white border-b border-zinc-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                  {isSalesOnly
                    ? `Sprawdzone samochody w innych miejscowościach okolic ${cityInfo.genitive}`
                    : `Skup aut w sąsiednich miejscowościach`}
                </h3>

                <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                  <a
                    href={getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <Home size={13} className="text-zinc-400" />
                    <span>Strona główna</span>
                  </a>

                  {otherLocalPages.map((other) => (
                    <a
                      key={other.slug}
                      href={getTenantUrl(tenant.slug, `/${other.slug}`, tenant.customDomain, isCustomDomain)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                      <MapPin size={13} className="text-zinc-400" />
                      <span>{isSalesOnly ? `Auta ${other.city}` : `Skup aut ${other.city}`}</span>
                    </a>
                  ))}

                  <a
                    href={getTenantUrl(tenant.slug, "/samochody", tenant.customDomain, isCustomDomain)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <CarFront size={13} className="text-zinc-400" />
                    <span>Pełna oferta aut</span>
                  </a>
                </div>
              </div>
            </section>
          );
        })()}

        <StickyMobileCta tenant={tenant} />
      </div>
    </>
  );
}
