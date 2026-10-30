"use client";

import { useState, useRef } from "react";
import { Palette, Sparkles, Image as ImageIcon, Upload, Loader2, Link as LinkIcon, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { SettingsTenantData } from "./types";
import { uploadBrandingImage } from "@/lib/image-upload";

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

  // Logo upload state
  const [logoUrl, setLogoUrl] = useState<string>(
    (branding.logoUrl as string) || (tenant.logo_url as string) || ""
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [showManualLogo, setShowManualLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Hero Image upload state
  const [heroImageUrl, setHeroImageUrl] = useState<string>(
    (branding.heroImageUrl as string) ||
    (media.heroImageUrl as string) ||
    "/images/default-hero.webp"
  );
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);
  const [showManualHero, setShowManualHero] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const tenantSlug = tenant.slug || "dealer";

  const handleLogoFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingLogo(true);
    setLogoUploadError(null);
    try {
      const url = await uploadBrandingImage(files[0], tenantSlug, "logo");
      setLogoUrl(url);
    } catch (err) {
      setLogoUploadError(err instanceof Error ? err.message : "Błąd wgrywania logo");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleHeroFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingHero(true);
    setHeroUploadError(null);
    try {
      const url = await uploadBrandingImage(files[0], tenantSlug, "hero");
      setHeroImageUrl(url);
    } catch (err) {
      setHeroUploadError(err instanceof Error ? err.message : "Błąd wgrywania banera");
    } finally {
      setIsUploadingHero(false);
      if (heroInputRef.current) heroInputRef.current.value = "";
    }
  };

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

      {/* Logo Upload Section */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Logo Salonu
          </label>
          <button
            type="button"
            onClick={() => setShowManualLogo(!showManualLogo)}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showManualLogo ? "Ukryj ręczny URL" : "Podaj link URL (opcjonalnie)"}</span>
            {showManualLogo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-md flex flex-col sm:flex-row items-center gap-4">
          {/* Logo Preview */}
          <div className="h-16 w-44 rounded-md border border-slate-800 bg-slate-900 p-2 flex items-center justify-center relative shrink-0 overflow-hidden">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo Salonu"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-xs text-slate-500 text-center font-medium">Brak logo</span>
            )}
          </div>

          {/* Upload Button & Info */}
          <div className="flex-1 space-y-1.5 w-full">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              disabled={isUploadingLogo}
              onChange={(e) => handleLogoFile(e.target.files)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isUploadingLogo}
                onClick={() => logoInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-md border border-slate-700 inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploadingLogo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Wgrywanie pliku...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Wgraj logo z dysku</span>
                  </>
                )}
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs rounded-md border border-slate-800 hover:border-rose-900 transition-all inline-flex items-center gap-1.5"
                  title="Usuń logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Usuń</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Formaty: SVG, PNG (z przezroczystością), WebP, JPG. Zalecany układ poziomy.
            </p>
            {logoUploadError && (
              <p className="text-xs text-rose-400">{logoUploadError}</p>
            )}
          </div>
        </div>

        {/* Hidden or Manual URL Input */}
        {showManualLogo ? (
          <div className="space-y-1 pt-1">
            <input
              id="branding_logo_url"
              name="branding_logo_url"
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://twojkomis.pl/logo.svg lub /images/twoje-logo.svg"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all font-mono"
            />
          </div>
        ) : (
          <input type="hidden" name="branding_logo_url" value={logoUrl} />
        )}
      </div>

      {/* Hero Image Upload Section */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            Zdjęcie Główne Banera Hero
          </label>
          <button
            type="button"
            onClick={() => setShowManualHero(!showManualHero)}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showManualHero ? "Ukryj ręczny URL" : "Podaj link URL (opcjonalnie)"}</span>
            {showManualHero ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <div className="sm:col-span-2 space-y-3">
            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploadingHero}
              onChange={(e) => handleHeroFile(e.target.files)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isUploadingHero}
                onClick={() => heroInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-md border border-slate-700 inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploadingHero ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Wgrywanie i kompresja...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Wgraj kadr banera z dysku</span>
                  </>
                )}
              </button>

              {heroImageUrl && (
                <button
                  type="button"
                  onClick={() => setHeroImageUrl("/images/default-hero.webp")}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200 text-xs rounded-md border border-slate-800 hover:border-slate-700 transition-all inline-flex items-center gap-1.5"
                  title="Przywróć domyślny kadr"
                >
                  <span>Domyślny kadr</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Fotografia placu komisowego lub salonu (proporcje 16:9 lub 16:10). Zdjęcie zostanie automatycznie zoptymalizowane do formatu WebP dla natychmiastowego ładowania strony.
            </p>

            {heroUploadError && (
              <p className="text-xs text-rose-400">{heroUploadError}</p>
            )}

            {showManualHero ? (
              <div className="space-y-1 pt-1">
                <input
                  id="branding_hero_image_url"
                  name="branding_hero_image_url"
                  type="text"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="/images/default-hero.webp lub URL zewnętrzny"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono transition-all"
                />
              </div>
            ) : (
              <input type="hidden" name="branding_hero_image_url" value={heroImageUrl} />
            )}
          </div>

          {/* Hero Preview Box */}
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
