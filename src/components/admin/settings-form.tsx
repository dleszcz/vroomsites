"use client";

import { useState, useTransition, useEffect } from "react";
import { updateTenant } from "@/app/[dealerSlug]/admin/actions";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface SettingsFormProps {
  targetSlug?: string;
  tenant: {
    business_name: string | null;
    business_description: string | null;
    custom_domain: string | null;
    notification_email: string | null;
    google_sheets_webhook_url: string | null;
    contact_phone: string | null;
    whatsapp_number: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    county: string | null;
    region: string | null;
    pixel_id: string | null;
    branding: Record<string, unknown> | null;
    analytics: Record<string, unknown> | null;
    opening_hours: Record<string, unknown> | null;
    business_rules: Record<string, unknown> | null;
    seo: Record<string, unknown> | null;
  };
}

const TABS = [
  { id: "general", label: "Identyfikacja", icon: "" },
  { id: "branding", label: "Kolory i Logo", icon: "" },
  { id: "contact", label: "Kontakt i Godziny", icon: "" },
  { id: "features", label: "Funkcje i SEO", icon: "" },
];

export function SettingsForm({ tenant, targetSlug }: SettingsFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(urlTab || "general");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const justSaved = searchParams.get("saved") === "true";

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Pre-fill fields safely
  const branding = tenant.branding || {};
  const analytics = tenant.analytics || {};
  const openingHours = tenant.opening_hours || {};
  const businessRules = tenant.business_rules || {};
  const seo = tenant.seo || {};

  const [primaryColor, setPrimaryColor] = useState(
    (branding.primaryColor as string) || (branding.colors as Record<string, string>)?.primary || "#1686E0"
  );
  const [accentColor, setAccentColor] = useState(
    (branding.accentColor as string) || (branding.colors as Record<string, string>)?.accent || "#1686E0"
  );

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateTenant(formData);
      } catch (e) {
        if (e instanceof Error && (e.message.includes("NEXT_REDIRECT") || e.message.includes("digest"))) {
          return;
        }
        setError(e instanceof Error ? e.message : "Wystąpił błąd zapisu");
      }
    });
  }

  return (
    <form action={handleSubmit} style={styles.form}>
      {targetSlug && <input type="hidden" name="target_slug" value={targetSlug} />}
      {justSaved && (
        <div style={styles.successBanner}>
          Wszystkie ustawienia komisu zostały pomyślnie zapisane!
        </div>
      )}

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Tabs Navigation */}
      <div style={styles.tabsBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.set("tab", tab.id);
              window.history.replaceState(null, '', `?${newParams.toString()}`);
            }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === tab.id ? styles.tabBtnActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: General */}
      {activeTab === "general" && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Identyfikacja Firmy</h3>
          <p style={styles.sectionDesc}>
            Podstawowe dane o Twoim komisie wyświetlane w nagłówku i stopce strony.
          </p>

          <div style={styles.fieldsColumn}>
            <div style={styles.field}>
              <label htmlFor="business_name" style={styles.label}>
                Nazwa firmy / komisu *
              </label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                defaultValue={tenant.business_name || ""}
                placeholder="Np. Auto Komis Janusz"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="business_description" style={styles.label}>
                Podtytuł / Opis działalności
              </label>
              <textarea
                id="business_description"
                name="business_description"
                rows={3}
                defaultValue={tenant.business_description || ""}
                placeholder="Np. Skup aut za gotówkę, używane samochody z gwarancją..."
                style={{ ...styles.input, resize: "vertical" }}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="custom_domain" style={styles.label}>
                Własna domena (Custom Domain)
              </label>
              <input
                id="custom_domain"
                name="custom_domain"
                type="text"
                defaultValue={tenant.custom_domain || ""}
                placeholder="autokomis-janusz.pl"
                style={styles.input}
              />
              <p style={styles.hint}>
                Domena podpięta w Vercel/DNS wskazująca bezpośrednio na Twoją wizytówkę.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Branding & Colors */}
      {activeTab === "branding" && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Wygląd, Kolory i Logo</h3>
          <p style={styles.sectionDesc}>
            Personalizacja szaty graficznej, logo oraz haseł reklamowych sekcji Hero.
          </p>

          <div style={styles.fieldsColumn}>
            <div style={styles.fieldsRow}>
              <div style={styles.field}>
                <label htmlFor="branding_primary_color" style={styles.label}>
                  Główny kolor strony (HEX)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      backgroundColor: primaryColor,
                      border: "1px solid rgba(255,255,255,0.2)",
                      flexShrink: 0,
                    }}
                    title={`Podgląd koloru: ${primaryColor}`}
                  />
                  <input
                    id="branding_primary_color"
                    name="branding_primary_color"
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="color"
                    value={primaryColor.startsWith("#") && primaryColor.length === 7 ? primaryColor : "#1686E0"}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: "40px", height: "40px", border: "none", cursor: "pointer", borderRadius: "8px", background: "transparent" }}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label htmlFor="branding_accent_color" style={styles.label}>
                  Kolor akcentujący (HEX)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      backgroundColor: accentColor,
                      border: "1px solid rgba(255,255,255,0.2)",
                      flexShrink: 0,
                    }}
                    title={`Podgląd koloru: ${accentColor}`}
                  />
                  <input
                    id="branding_accent_color"
                    name="branding_accent_color"
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="color"
                    value={accentColor.startsWith("#") && accentColor.length === 7 ? accentColor : "#1686E0"}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "40px", height: "40px", border: "none", cursor: "pointer", borderRadius: "8px", background: "transparent" }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.field}>
              <label htmlFor="branding_logo_url" style={styles.label}>
                Link do Logo (URL pliku PNG/SVG)
              </label>
              <input
                id="branding_logo_url"
                name="branding_logo_url"
                type="text"
                defaultValue={(branding.logoUrl as string) || ""}
                placeholder="https://twojadomena.pl/logo.png"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="branding_hero_title" style={styles.label}>
                Nagłówek sekcji głównej (Hero Title)
              </label>
              <input
                id="branding_hero_title"
                name="branding_hero_title"
                type="text"
                defaultValue={(branding.heroTitle as string) || ""}
                placeholder="Szybki Skup Aut za Gotówkę"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="branding_hero_subtitle" style={styles.label}>
                Podtytuł sekcji głównej (Hero Subtitle)
              </label>
              <input
                id="branding_hero_subtitle"
                name="branding_hero_subtitle"
                type="text"
                defaultValue={(branding.heroSubtitle as string) || ""}
                placeholder="Darmowa wycena w 15 minut, dojazd do klienta..."
                style={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Contact & Address & Hours */}
      {activeTab === "contact" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Dane Kontaktowe i Adres</h3>
            <p style={styles.sectionDesc}>
              Wprowadź aktualne numery telefonów oraz dokładny adres fizyczny komisu.
            </p>

            <div style={styles.fieldsColumn}>
              <div style={styles.fieldsRow}>
                <div style={styles.field}>
                  <label htmlFor="contact_phone" style={styles.label}>
                    Telefon główny
                  </label>
                  <input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    defaultValue={tenant.contact_phone || ""}
                    placeholder="+48 789 012 345"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="whatsapp_number" style={styles.label}>
                    Numer WhatsApp
                  </label>
                  <input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    type="tel"
                    defaultValue={tenant.whatsapp_number || ""}
                    placeholder="+48 789 012 345"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label htmlFor="notification_email" style={styles.label}>
                  E-mail do powiadomień o wycenach (Lead Email)
                </label>
                <input
                  id="notification_email"
                  name="notification_email"
                  type="email"
                  defaultValue={tenant.notification_email || ""}
                  placeholder="kontakt@autokomis-janusz.pl"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldsRow}>
                <div style={styles.field}>
                  <label htmlFor="address" style={styles.label}>
                    Adres (Ulica i numer)
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    defaultValue={tenant.address || ""}
                    placeholder="Topólka 14A"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="city" style={styles.label}>
                    Miejscowość
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    defaultValue={tenant.city || ""}
                    placeholder="Topólka"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.fieldsRow}>
                <div style={styles.field}>
                  <label htmlFor="postal_code" style={styles.label}>
                    Kod pocztowy
                  </label>
                  <input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    defaultValue={tenant.postal_code || ""}
                    placeholder="87-875"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="county" style={styles.label}>
                    Powiat
                  </label>
                  <input
                    id="county"
                    name="county"
                    type="text"
                    defaultValue={tenant.county || ""}
                    placeholder="radziejowski"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="region" style={styles.label}>
                    Województwo
                  </label>
                  <input
                    id="region"
                    name="region"
                    type="text"
                    defaultValue={tenant.region || ""}
                    placeholder="Kujawsko-Pomorskie"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Godziny Otwarcia Komisu</h3>
            <p style={styles.sectionDesc}>
              Godziny pracy widoczne w stopce oraz w sekcji kontaktowej.
            </p>

            <div style={styles.fieldsColumn}>
              <div style={styles.field}>
                <label htmlFor="hours_weekdays" style={styles.label}>
                  Poniedziałek – Piątek
                </label>
                <input
                  id="hours_weekdays"
                  name="hours_weekdays"
                  type="text"
                  defaultValue={(openingHours.weekdays as string) || "08:00 - 18:00"}
                  placeholder="08:00 - 18:00"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="hours_saturday" style={styles.label}>
                  Sobota
                </label>
                <input
                  id="hours_saturday"
                  name="hours_saturday"
                  type="text"
                  defaultValue={(openingHours.saturday as string) || "09:00 - 14:00"}
                  placeholder="09:00 - 14:00"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="hours_sunday" style={styles.label}>
                  Niedziela
                </label>
                <input
                  id="hours_sunday"
                  name="hours_sunday"
                  type="text"
                  defaultValue={(openingHours.sunday as string) || "Zamknięte (na telefon)"}
                  placeholder="Zamknięte / Na telefon"
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Features & SEO */}
      {activeTab === "features" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Zasady Skupu i Przedziały Cenowe</h3>
            <p style={styles.sectionDesc}>
              Parametry przyjmowania samochodów w skupie i komunikacja gwarancji wyceny.
            </p>

            <div style={styles.fieldsColumn}>
              <div style={styles.fieldsRow}>
                <div style={styles.field}>
                  <label htmlFor="min_purchase_price" style={styles.label}>
                    Minimalna wartość odkupu (PLN)
                  </label>
                  <input
                    id="min_purchase_price"
                    name="min_purchase_price"
                    type="number"
                    defaultValue={(businessRules.minPurchasePrice as number) || 500}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="max_purchase_price" style={styles.label}>
                    Maksymalna wartość odkupu (PLN)
                  </label>
                  <input
                    id="max_purchase_price"
                    name="max_purchase_price"
                    type="number"
                    defaultValue={(businessRules.maxPurchasePrice as number) || 150000}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label htmlFor="guarantee_text" style={styles.label}>
                  Komunikat czasowy wyceny (Gwarancja)
                </label>
                <input
                  id="guarantee_text"
                  name="guarantee_text"
                  type="text"
                  defaultValue={(businessRules.guaranteeText as string) || "Bezpłatna wycena w najkrótszym czasie"}
                  placeholder="Np. Wycena w najkrótszym czasie..."
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Integracje Zewnętrzne</h3>
            <p style={styles.sectionDesc}>
              Wprowadź link Webhooka Google Sheets oraz identyfikatory analityczne.
            </p>

            <div style={styles.fieldsColumn}>
              <div style={styles.field}>
                <label htmlFor="google_sheets_webhook_url" style={styles.label}>
                  Google Sheets Webhook URL
                </label>
                <input
                  id="google_sheets_webhook_url"
                  name="google_sheets_webhook_url"
                  type="url"
                  defaultValue={tenant.google_sheets_webhook_url || ""}
                  placeholder="https://script.google.com/macros/s/..."
                  style={styles.input}
                />
                <p style={styles.hint}>
                  Adres skryptu Google Apps Script automatycznie dodający wyceny do Arkusza Google.
                </p>
              </div>

              <div style={styles.fieldsRow}>
                <div style={styles.field}>
                  <label htmlFor="pixel_id" style={styles.label}>
                    Meta Pixel ID
                  </label>
                  <input
                    id="pixel_id"
                    name="pixel_id"
                    type="text"
                    defaultValue={tenant.pixel_id || (analytics.pixelId as string) || ""}
                    placeholder="123456789012345"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="google_analytics_id" style={styles.label}>
                    Google Analytics ID (GA4)
                  </label>
                  <input
                    id="google_analytics_id"
                    name="google_analytics_id"
                    type="text"
                    defaultValue={(analytics.googleAnalyticsId as string) || ""}
                    placeholder="G-XXXXXXXXXX"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>SEO i Tagi Meta (Google)</h3>
            <p style={styles.sectionDesc}>
              Optymalizacja pod kątem wyszukiwarki Google i udostępniania w social media.
            </p>

            <div style={styles.fieldsColumn}>
              <div style={styles.field}>
                <label htmlFor="meta_title" style={styles.label}>
                  Tytuł strony w Google (Meta Title)
                </label>
                <input
                  id="meta_title"
                  name="meta_title"
                  type="text"
                  defaultValue={(seo.metaTitle as string) || ""}
                  placeholder="Skup Aut Gotówka | Auto Komis Janusz"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="meta_description" style={styles.label}>
                  Opis strony w Google (Meta Description)
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  rows={3}
                  defaultValue={(seo.metaDescription as string) || ""}
                  placeholder="Skupujemy auta za gotówkę w miejscowości Topólka i okolicach. Najlepsze ceny, bezpłatny dojazd..."
                  style={{ ...styles.input, resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Submit Bar */}
      <div style={styles.submitBar}>
        <div style={styles.submitBarLeft}>
          Naciśnij <strong>Zapisz ustawienia</strong>, aby od razu zaktualizować stronę komisu.
        </div>
        <button type="submit" disabled={isPending} style={styles.submitBtn}>
          {isPending ? "Zapisuję..." : "Zapisz ustawienia"}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  successBanner: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "600",
  },
  errorBanner: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fca5a5",
    fontSize: "14px",
  },
  tabsBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    background: "rgba(30, 41, 59, 0.6)",
    padding: "8px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  tabBtn: {
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  tabBtnActive: {
    background: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
    fontWeight: "600",
  },
  section: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "16px",
    padding: "28px",
  },
  sectionTitle: {
    color: "#f1f5f9",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 4px",
  },
  sectionDesc: {
    color: "#64748b",
    fontSize: "13px",
    margin: "0 0 24px",
  },
  fieldsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
    minWidth: "220px",
  },
  label: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500",
  },
  input: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  hint: {
    color: "#475569",
    fontSize: "12px",
    margin: "2px 0 0",
  },
  submitBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(30, 41, 59, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "14px",
    padding: "16px 24px",
    gap: "16px",
    flexWrap: "wrap",
  },
  submitBarLeft: {
    color: "#94a3b8",
    fontSize: "13px",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 28px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
};
