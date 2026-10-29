"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Globe, Check, Eye, EyeOff } from "lucide-react";
import type { LocalPageConfig } from "@/types/landing";

interface LocalSeoSettingsSectionProps {
  initialPages: LocalPageConfig[];
  dealerSlug: string;
  isSalesOnly: boolean;
}

export function LocalSeoSettingsSection({
  initialPages,
  dealerSlug,
  isSalesOnly,
}: LocalSeoSettingsSectionProps) {
  const [pages, setPages] = useState<LocalPageConfig[]>(initialPages);
  const [newCity, setNewCity] = useState("");
  const [newMode, setNewMode] = useState<"buying" | "sales">(isSalesOnly ? "sales" : "buying");
  const [newSlug, setNewSlug] = useState("");

  const handleCityChange = (city: string) => {
    setNewCity(city);
    const cleanCitySlug = city
      .toLowerCase()
      .trim()
      .replace(/ą/g, "a")
      .replace(/ć/g, "c")
      .replace(/ę/g, "e")
      .replace(/ł/g, "l")
      .replace(/ń/g, "n")
      .replace(/ó/g, "o")
      .replace(/ś/g, "s")
      .replace(/ź/g, "z")
      .replace(/ż/g, "z")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const prefix = newMode === "sales" ? "samochody-uzywane" : "skup-aut";
    setNewSlug(cleanCitySlug ? `${prefix}-${cleanCitySlug}` : "");
  };

  const handleModeChange = (mode: "buying" | "sales") => {
    setNewMode(mode);
    if (newCity) {
      const cleanCitySlug = newSlug.replace(/^(samochody-uzywane|skup-aut)-?/, "");
      const prefix = mode === "sales" ? "samochody-uzywane" : "skup-aut";
      setNewSlug(`${prefix}-${cleanCitySlug}`);
    }
  };

  const handleAddCity = () => {
    if (!newCity.trim() || !newSlug.trim()) return;

    const exists = pages.some(
      (p) => p.slug === newSlug || p.city.toLowerCase() === newCity.trim().toLowerCase()
    );
    if (exists) return;

    const newPage: LocalPageConfig = {
      city: newCity.trim(),
      slug: newSlug.trim(),
      enabled: true,
      indexable: true,
      priority: pages.length + 1,
      mode: newMode,
      showInLocalAreaLinks: true,
      showInFooter: true,
      seo: {
        title:
          newMode === "sales"
            ? `Samochody używane ${newCity.trim()} | Sprawdzona oferta komisowa`
            : `Skup aut ${newCity.trim()} | Gotówka od ręki i darmowa laweta`,
        h1:
          newMode === "sales"
            ? `Sprawdzone samochody osobowe i dostawcze — ${newCity.trim()}`
            : `Skup aut w ${newCity.trim()} i okolicach za gotówkę`,
        metaDescription:
          newMode === "sales"
            ? `Kup sprawdzone auto używane z gwarancją i fakturą w okolicach ${newCity.trim()}. Zobacz aktualną ofertę na placu.`
            : `Ekspresowy skup aut za gotówkę w miejscowości ${newCity.trim()}. Bezpłatny dojazd lawetą i wycena w 15 minut.`,
      },
    };

    setPages([...pages, newPage]);
    setNewCity("");
    setNewSlug("");
  };

  const handleToggleEnable = (slug: string) => {
    setPages(
      pages.map((p) => (p.slug === slug ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleRemove = (slug: string) => {
    setPages(pages.filter((p) => p.slug !== slug));
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 sm:p-6 space-y-6">
      {/* Hidden input to pass data to Server Action */}
      <input type="hidden" name="local_pages_json" value={JSON.stringify(pages)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Miejscowości i Lokalne SEO
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Zarządzaj podstronami miejskimi generowanymi dla ościennych miejscowości w wynikach Google.
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md shrink-0 border border-slate-700/60">
          Aktywne podstrony: {pages.filter((p) => p.enabled).length} / {pages.length}
        </div>
      </div>

      {/* Towns Grid / List */}
      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.slug}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-md hover:border-slate-700/80 transition-colors"
          >
            <div className="min-w-0 flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  page.enabled ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200 truncate">
                    {page.city}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      page.mode === "sales"
                        ? "bg-blue-950/80 text-blue-300 border border-blue-800/60"
                        : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                    }`}
                  >
                    {page.mode === "sales" ? "Sprzedaż aut" : "Skup aut"}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono truncate mt-0.5">
                  /{dealerSlug}/{page.slug}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleToggleEnable(page.slug)}
                className={`p-2 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  page.enabled
                    ? "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
                title={page.enabled ? "Wyłącz tę podstronę" : "Włącz tę podstronę"}
              >
                {page.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{page.enabled ? "Aktywna" : "Ukryta"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRemove(page.slug)}
                className="p-2 rounded-md bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/80 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                title="Usuń tę miejscowość"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div className="p-6 text-center bg-slate-950/40 border border-slate-800/60 rounded-md">
            <Globe className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              Brak skonfigurowanych miejscowości. Dodaj pierwsze miasto poniżej.
            </p>
          </div>
        )}
      </div>

      {/* Add New Town Form */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-md space-y-4">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Dodaj nową miejscowość do pozycjonowania
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Miejscowość
            </label>
            <input
              type="text"
              placeholder="np. Strzelno"
              value={newCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Profil strony
            </label>
            <select
              value={newMode}
              onChange={(e) => handleModeChange(e.target.value as "buying" | "sales")}
              className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="sales">Sprzedaż aut (Komis)</option>
              <option value="buying">Skup aut za gotówkę</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Generowany URL (Slug)
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="samochody-uzywane-miasto"
              className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleAddCity}
            disabled={!newCity.trim() || !newSlug.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Dodaj do listy miejscowości</span>
          </button>
        </div>
      </div>
    </section>
  );
}
