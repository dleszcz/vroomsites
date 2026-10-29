"use client";

import { useState } from "react";
import { Palette, Sparkles, Image as ImageIcon } from "lucide-react";
import type { SettingsTenantData } from "./types";

interface BrandingSettingsTabProps {
  tenant: SettingsTenantData;
}

export function BrandingSettingsTab({ tenant }: BrandingSettingsTabProps) {
  const branding = (tenant.branding as Record<string, unknown>) || {};
  const media = (branding.media as Record<string, unknown>) || {};

  const [primaryColor, setPrimaryColor] = useState<string>(
    (branding.primaryColor as string) ||
    ((branding.colors as Record<string, string>)?.primary) ||
    "#10b981"
  );
  const [accentColor, setAccentColor] = useState<string>(
    (branding.accentColor as string) ||
    ((branding.colors as Record<string, string>)?.accent) ||
    "#f59e0b"
  );
  const [heroImageUrl, setHeroImageUrl] = useState<string>(
    (branding.heroImageUrl as string) ||
    (media.heroImageUrl as string) ||
    "/images/default-hero.webp"
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 sm:p-8 space-y-8">
      <div>
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
          Kolorystyka i Identyfikacja Wizualna
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Dopasuj barwy akcentów, logo, kadr banera Hero oraz nagłówki strony głównej do brandu Twojego salonu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Color */}
        <div className="space-y-2">
          <label
            htmlFor="branding_primary_color"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            Kolor wiodący (Primary HEX)
          </label>
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-md px-3 py-2">
            <input
              type="color"
              aria-label="Wybierz kolor wiodący"
              value={primaryColor.startsWith("#") && primaryColor.length === 7 ? primaryColor : "#10b981"}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent shrink-0"
            />
            <input
              id="branding_primary_color"
              name="branding_primary_color"
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#10b981"
              className="w-full bg-transparent text-sm text-slate-100 font-mono focus:outline-none"
            />
            <div
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
          <p className="text-xs text-slate-500">
            Kolor przycisków głównych, akcentów nawigacji i wyróżnień.
          </p>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <label
            htmlFor="branding_accent_color"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            Kolor akcentujący (Accent HEX)
          </label>
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-md px-3 py-2">
            <input
              type="color"
              aria-label="Wybierz kolor akcentujący"
              value={accentColor.startsWith("#") && accentColor.length === 7 ? accentColor : "#f59e0b"}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent shrink-0"
            />
            <input
              id="branding_accent_color"
              name="branding_accent_color"
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#f59e0b"
              className="w-full bg-transparent text-sm text-slate-100 font-mono focus:outline-none"
            />
            <div
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: accentColor }}
            />
          </div>
          <p className="text-xs text-slate-500">
            Kolor etykiet promocyjnych, badge&apos;y oraz akcentów cenowych.
          </p>
        </div>
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <label
          htmlFor="branding_logo_url"
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
        >
          Adres URL Logo (PNG / SVG)
        </label>
        <div className="relative">
          <input
            id="branding_logo_url"
            name="branding_logo_url"
            type="text"
            defaultValue={(branding.logoUrl as string) || ""}
            placeholder="https://twojkomis.pl/logo.svg lub /images/twoje-logo.svg"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
        <p className="text-xs text-slate-500">
          Zalecany format SVG lub PNG o proporcjach horyzontalnych (wysokość ok. 40-50px).
        </p>
      </div>

      {/* Hero Image URL */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label
            htmlFor="branding_hero_image_url"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            Zdjęcie Główne Banera Hero
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <div className="sm:col-span-2 space-y-2">
            <input
              id="branding_hero_image_url"
              name="branding_hero_image_url"
              type="text"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="/images/default-hero.webp lub URL zewnętrzny"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono text-xs transition-all"
            />
            <p className="text-xs text-slate-500">
              Fotografia motoryzacyjna o proporcjach 16:9 lub 16:10. Możesz podać ścieżkę wewnętrzną (np. <code>/images/default-hero.webp</code>) lub bezpośredni link do CDN/Unsplash.
            </p>
          </div>
          <div className="relative aspect-video rounded-md overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            {heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImageUrl}
                alt="Podgląd Hero"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-xs text-slate-500">Brak zdjęcia</span>
            )}
          </div>
        </div>
      </div>

      {/* Hero Headers */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Komunikaty Sekcji Głównej (Hero)
        </h4>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="branding_hero_title"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Główny nagłówek banera
            </label>
            <input
              id="branding_hero_title"
              name="branding_hero_title"
              type="text"
              defaultValue={(branding.heroTitle as string) || ""}
              placeholder="Sprawdzone samochody z gwarancją i pewną historią"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="branding_hero_subtitle"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Podtytuł / Hasło uzupełniające
            </label>
            <input
              id="branding_hero_subtitle"
              name="branding_hero_subtitle"
              type="text"
              defaultValue={(branding.heroSubtitle as string) || ""}
              placeholder="Szybki odkup za gotówkę, korzystny kredyt lub leasing bez zaświadczeń"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
