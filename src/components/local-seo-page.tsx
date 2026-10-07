"use client";

import React, { useState } from "react";
import { DealerTenant, LocalPageConfig } from "@/types/landing";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocalSeoSchema } from "@/components/local-seo-schema";
import { CheckCircle2, ChevronDown, MapPin, Phone, ShieldCheck, Truck, Wallet } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";

import { getTenantUrl } from "@/lib/urls";

interface LocalSeoPageProps {
  tenant: DealerTenant;
  localPage: LocalPageConfig;
  baseUrl: string;
  isCustomDomain?: boolean;
}

function getCityInflection(city: string) {
  const map: Record<string, { locative: string; genitive: string }> = {
    "Topólka": { locative: "Topólce", genitive: "Topólki" },
    "Radziejów": { locative: "Radziejowie", genitive: "Radziejowa" },
    "Lubraniec": { locative: "Lubrańcu", genitive: "Lubrańca" },
    "Izbica Kujawska": { locative: "Izbicy Kujawskiej", genitive: "Izbicy Kujawskiej" },
    "Brześć Kujawski": { locative: "Brześciu Kujawskim", genitive: "Brześcia Kujawskiego" },
    "Piotrków Kujawski": { locative: "Piotrkowie Kujawskim", genitive: "Piotrkowa Kujawskiego" },
    "Osięciny": { locative: "Osięcinach", genitive: "Osięcin" },
    "Włocławek": { locative: "Włocławku", genitive: "Włocławka" },
    "Kruszwica": { locative: "Kruszwicy", genitive: "Kruszwicy" },
    "Inowrocław": { locative: "Inowrocławiu", genitive: "Inowrocławia" },
    "Konin": { locative: "Koninie", genitive: "Konina" },
    "Lipno": { locative: "Lipnie", genitive: "Lipna" },
    "Bytoń": { locative: "Bytoniu", genitive: "Bytonia" },
    "Choceń": { locative: "Choceniu", genitive: "Chocenia" },
    "Kowal": { locative: "Kowalu", genitive: "Kowala" },
    "Chodecz": { locative: "Chodczu", genitive: "Chodcza" },
    "Sompolno": { locative: "Sompolnie", genitive: "Sompolna" },
    "Babiak": { locative: "Babiaku", genitive: "Babiaka" },
  };

  const entry = map[city];
  return {
    locative: entry?.locative || city,
    genitive: entry?.genitive || city,
  };
}

export function LocalSeoPage({ tenant, localPage, baseUrl }: LocalSeoPageProps) {
  const cityInfo = getCityInflection(localPage.city);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phone = tenant.contact.phone || "";
  const cleanPhone = phone.replace(/\s/g, "");
  const heroImage = tenant.branding.media?.heroImageUrl || "/images/dcar-hero.jpg";
  const primaryColor = tenant.branding.colors.primary || "#1686E0";

  const canonicalUrl = `${baseUrl}/${localPage.slug}`;

  const breadcrumbs = [
    { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain) },
    { label: "Skup aut", href: getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain) },
    { label: localPage.city },
  ];

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
      const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
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
          dealerId: tenant.id,
          source: `local_seo_${localPage.slug}`,
          landingPath: `/${tenant.slug}/${localPage.slug}`,
          customerName,
          customerPhone,
          attribution,
          localSeoCity: localPage.city,
          vehicleDetails: { description: vehicleDetails },
        }),
      });


      if (res.ok) {
        setLeadFormSubmitted(true);
        trackEvent("lead_submitted", { localSeoCity: localPage.city });
      }
    } catch {
      // Ignore errors for UX
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

        {/* Local Hero */}
        <section className="vd-section vd-section--dark local-seo-hero" style={{ position: "relative", overflow: "hidden" }}>
          {heroImage && (
            <img
              src={heroImage}
              alt={`Skup aut w ${localPage.city} - ${tenant.businessName}`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.25,
                pointerEvents: "none",
              }}
            />
          )}
          <div className="vd-container" style={{ position: "relative", zIndex: 2, paddingBlock: "48px 64px" }}>

            <span className="vd-eyebrow" style={{ color: primaryColor }}>
              Szybka wycena & Bezpłatny odbior • {localPage.city}
            </span>
            <h1 className="vd-heading" style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", marginBottom: "16px" }}>
              {(localPage.seo?.h1 || `Skup aut w ${cityInfo.locative} - ${tenant.businessName}`).replace(/—|–/g, "-")}
            </h1>
            <p className="vd-copy" style={{ color: "rgba(255,255,255,0.85)", fontSize: "18px", maxWidth: "680px", marginBottom: "32px" }}>
              {(localPage.content?.intro ||
                `Oferujemy bezpieczny skup aut za gotówkę w ${cityInfo.locative} i okolicach. Bezpłatna wycena, szybki dojazd i umowa na miejscu.`).replace(/—|–/g, "-")}
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  onClick={handlePhoneClick}
                  className="vd-button vd-button--primary"
                  style={{ background: primaryColor }}
                >
                  <Phone size={16} /> Zadzwoń: {phone}
                </a>
              )}
              <a href="#local-lead-form" className="vd-button vd-button--outline-dark">
                Darmowa wycena online ➔
              </a>
            </div>
          </div>
        </section>

        {/* Service Description & Local Coverage */}
        <section className="vd-section">
          <div className="vd-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", alignItems: "center" }}>
              <div>
                <span className="vd-eyebrow">Obsługa {localPage.city} i okolic</span>
                <h2 className="vd-heading" style={{ marginBottom: "16px" }}>
                  Skupujemy samochody w {cityInfo.locative} za gotówkę
                </h2>
                <p className="vd-copy" style={{ marginBottom: "16px" }}>
                  {(localPage.content?.serviceDescription ||
                    `Zapewniamy profesjonalny skup pojazdów od mieszkańców ${cityInfo.locative}. Kupujemy auta osobowe, dostawcze oraz w każdym stanie technicznym.`).replace(/—|–/g, "-")}
                </p>
                {localPage.content?.locationNote && (
                  <div
                    style={{
                      marginTop: "24px",
                      padding: "16px 20px",
                      borderRadius: "14px",
                      background: `${primaryColor}0d`,
                      border: `1px solid ${primaryColor}30`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: `${primaryColor}1a`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: primaryColor, display: "block", marginBottom: "4px" }}>
                        Lokalna obsługa • {localPage.city}
                      </span>
                      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5, color: "var(--color-foreground)", fontWeight: 500 }}>
                        {localPage.content.locationNote.replace(/—|–/g, "-")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Value Cards Grid */}
              <div style={{ display: "grid", gap: "16px" }}>
                {tenant.businessRules?.purchasePriceLimit?.enabled && (
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      background: "#ffffff",
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      gap: "16px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: `${primaryColor}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Wallet size={22} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>
                        Skup aut do {tenant.businessRules.purchasePriceLimit.maxAmount.toLocaleString("pl-PL")} {tenant.businessRules.purchasePriceLimit.currency}
                      </h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)", lineHeight: 1.5 }}>
                        {(tenant.businessRules.purchasePriceLimit.description || `Skupujemy auta osobowe i budżetowe do ${tenant.businessRules.purchasePriceLimit.maxAmount.toLocaleString("pl-PL")} PLN. Szybka wycena!`).replace(/—|–/g, "-") }
                      </p>
                    </div>
                  </div>
                )}

                {tenant.businessRules?.tradeIn?.enabled && (
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      background: "#ffffff",
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      gap: "16px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: `${primaryColor}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={22} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>
                        {tenant.businessRules.tradeIn.title || "Auto w rozliczeniu"}
                      </h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)", lineHeight: 1.5 }}>
                        {tenant.businessRules.tradeIn.description || "Zostaw swoje obecne auto w rozliczeniu przy zakupie innego pojazdu."}
                      </p>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    background: "#ffffff",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    gap: "16px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${primaryColor}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Wallet size={22} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>Płatność gotówką od ręki</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)", lineHeight: 1.5 }}>
                      Pieniądze wypłacamy natychmiast przy podpisaniu umowy: gotówką lub przelewem ekspresowym.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    background: "#ffffff",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    gap: "16px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${primaryColor}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Truck size={22} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>Bezpłatny transport lawetą</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)", lineHeight: 1.5 }}>
                      Odbieramy uszkodzone i niesprawne samochody bezpośrednio spod domu w {cityInfo.locative}.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    background: "#ffffff",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    gap: "16px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${primaryColor}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={22} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>Formalności po naszej stronie</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)", lineHeight: 1.5 }}>
                      Przygotowujemy legalną umowę kupna-sprzedaży i przekazujemy komplet dokumentów do wyrejestrowania i OC.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="vd-section vd-section--soft">
          <div className="vd-container">
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
              <span className="vd-eyebrow">Prosty proces</span>
              <h2 className="vd-heading">Jak sprzedać auto z {cityInfo.genitive}?</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
              <div style={{ padding: "24px", borderRadius: "12px", background: "#fff", border: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: primaryColor, marginBottom: "12px" }}>01</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>Formularz lub telefon</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)" }}>
                  Zadzwoń lub wypełnij krótki formularz wyceny podając podstawowe dane o samochodzie.
                </p>
              </div>

              <div style={{ padding: "24px", borderRadius: "12px", background: "#fff", border: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: primaryColor, marginBottom: "12px" }}>02</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>Wycena w 15 minut</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)" }}>
                  Przedstawiamy uczciwą i rzetelną wycenę rynkową Twojego pojazdu.
                </p>
              </div>

              <div style={{ padding: "24px", borderRadius: "12px", background: "#fff", border: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: primaryColor, marginBottom: "12px" }}>03</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>Odbiór z {localPage.city}</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)" }}>
                  Przyjeżdżamy we wskazane miejsce w {localPage.city} i załatwiamy formalności na miejscu.
                </p>
              </div>

              <div style={{ padding: "24px", borderRadius: "12px", background: "#fff", border: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: primaryColor, marginBottom: "12px" }}>04</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>Wypłata gotówki</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-soft)" }}>
                  Otrzymujesz pieniądze od ręki i dokumenty potwierdzające sprzedaż.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Local FAQ */}
        {localPage.content?.faq && localPage.content.faq.length > 0 && (
          <section className="vd-section">
            <div className="vd-container" style={{ maxWidth: "800px" }}>
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <span className="vd-eyebrow">Pytania i odpowiedzi</span>
                <h2 className="vd-heading">Pytania dotyczące skupu aut w {localPage.city}</h2>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {localPage.content.faq.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        borderRadius: "10px",
                        border: "1px solid var(--color-border)",
                        overflow: "hidden",
                        background: "#fff",
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        style={{
                          width: "100%",
                          padding: "18px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: "15px",
                        }}
                      >
                        <span>{item.q.replace(/—|–/g, "-")}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            color: primaryColor,
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 20px 18px", color: "var(--color-text-soft)", fontSize: "14px", lineHeight: 1.6 }}>
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

        {/* Lead Form Section */}
        <section id="local-lead-form" className="vd-section vd-section--bordered vd-section--soft">
          <div className="vd-container" style={{ maxWidth: "640px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span className="vd-eyebrow">Darmowa wycena</span>
              <h2 className="vd-heading">Sprzedaj auto w {localPage.city}</h2>
              <p className="vd-copy" style={{ marginTop: "8px" }}>
                Wypełnij formularz — skontaktujemy się z Tobą w ciągu 15 minut z propozycją cenową.
              </p>
            </div>

            {leadFormSubmitted ? (
              <div
                style={{
                  padding: "32px",
                  borderRadius: "16px",
                  background: "#fff",
                  border: `2px solid ${primaryColor}`,
                  textAlign: "center",
                }}
              >
                <CheckCircle2 size={48} style={{ color: "#22c55e", margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>Dziękujemy za zgłoszenie!</h3>
                <p style={{ margin: 0, color: "var(--color-text-soft)" }}>
                  Nasz konsultant skontaktuje się z Tobą telefonicznie wkrótce.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleLeadSubmit}
                style={{
                  padding: "32px",
                  borderRadius: "16px",
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Imię i nazwisko / Nazwa
                  </label>
                  <input
                    type="text"
                    placeholder="np. Jan Kowalski"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Numer telefonu <span style={{ color: "#e11d48" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="np. 500 000 000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Informacje o samochodzie
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Marka, model, rok produkcji, opis stanu technicznego (np. Volkswagen Golf 2018 z ${localPage.city})`}
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "4px" }}>
                  <input
                    type="checkbox"
                    id="localRodoConsent"
                    required
                    defaultChecked
                    style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: primaryColor, cursor: "pointer" }}
                  />
                  <label htmlFor="localRodoConsent" style={{ fontSize: "12px", color: "var(--color-text-soft)", lineHeight: 1.5, cursor: "pointer" }}>
                    Wyrażam zgodę na kontakt w celu wyceny oraz akceptuję{" "}
                    <a href={`/${tenant.slug}/polityka-prywatnosci`} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, textDecoration: "underline" }}>
                      Politykę Prywatności
                    </a>{" "}
                    i{" "}
                    <a href={`/${tenant.slug}/regulamin`} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, textDecoration: "underline" }}>
                      Regulamin
                    </a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="vd-button vd-button--primary vd-button--block"
                  style={{ background: primaryColor, marginTop: "8px", minHeight: "48px" }}
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie do wyceny ➔"}
                </button>

                <p style={{ margin: 0, textAlign: "center", fontSize: "12px", color: "var(--color-text-faint)" }}>
                  Gwarantujemy bezpłatną wycenę bez żadnych zobowiązań.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Related Local Locations Internal Linking Section */}
        {(() => {
          const otherLocalPages = (tenant.localSeo?.localPages || []).filter(
            (lp) => lp.enabled && lp.indexable && lp.slug !== localPage.slug
          );
          if (otherLocalPages.length === 0) return null;

          return (
            <section className="vd-section" style={{ background: "var(--color-background)", borderTop: "1px solid var(--color-border)" }}>
              <div className="vd-container">
                <div style={{ maxWidth: "720px", margin: "0 auto 28px", textAlign: "center" }}>
                  <span className="vd-eyebrow" style={{ color: primaryColor }}>
                    Obsługiwane okolice
                  </span>
                  <h3 className="vd-heading vd-heading--small" style={{ marginBottom: "8px" }}>
                    Skup aut w sąsiednich miejscowościach
                  </h3>
                  <p className="vd-copy" style={{ fontSize: "14px" }}>
                    Sprawdź naszą ofertę skupu samochodów za gotówkę w okolicach {localPage.city}:
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    maxWidth: "800px",
                    margin: "0 auto",
                  }}
                >
                  <a
                    href={getTenantUrl(tenant.slug, "/", tenant.customDomain)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "var(--color-surface)",
                      color: "var(--color-foreground)",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    🏠 Strona główna {tenant.businessName}
                  </a>
                  {otherLocalPages.map((other) => (
                    <a
                      key={other.slug}
                      href={getTenantUrl(tenant.slug, `/${other.slug}`, tenant.customDomain)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "var(--color-surface)",
                        color: "var(--color-foreground)",
                        fontSize: "14px",
                        fontWeight: 600,
                        textDecoration: "none",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      📍 Skup aut {other.city}
                    </a>
                  ))}
                  <a
                    href={getTenantUrl(tenant.slug, "/#vehicles", tenant.customDomain)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "var(--color-surface)",
                      color: "var(--color-foreground)",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    🚗 Samochody na sprzedaż
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

