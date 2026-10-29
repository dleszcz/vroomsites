"use client";

import { ShieldCheck, Search } from "lucide-react";
import type { SettingsTenantData } from "./types";
import { LocalSeoSettingsSection } from "./local-seo-settings-section";
import type { LocalPageConfig } from "@/types/landing";

interface SeoRulesSettingsTabProps {
  tenant: SettingsTenantData;
  dealerSlug: string;
}

export function SeoRulesSettingsTab({ tenant, dealerSlug }: SeoRulesSettingsTabProps) {
  const businessRules = (tenant.business_rules as Record<string, unknown>) || {};
  const seo = (tenant.seo as Record<string, unknown>) || {};
  const localSeo = (tenant.local_seo as Record<string, unknown>) || {};
  const initialPages = (localSeo.localPages || localSeo.local_pages || []) as LocalPageConfig[];
  const isSalesOnly =
    ((tenant.page_config?.features as Record<string, unknown> | undefined)?.carBuying === false);

  return (
    <div className="space-y-8">
      {/* Local SEO & Towns Management */}
      <LocalSeoSettingsSection
        initialPages={initialPages}
        dealerSlug={dealerSlug}
        isSalesOnly={isSalesOnly}
      />

      {/* Business Rules & Pricing */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Reguły Skupu i Widełki Cenowe
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Parametry kwalifikacji zapytań o odkup aut za gotówkę oraz hasło gwarancji.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min_purchase_price"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Minimalna wartość odkupu (PLN)
              </label>
              <input
                id="min_purchase_price"
                name="min_purchase_price"
                type="number"
                defaultValue={(businessRules.minPurchasePrice as number) || 500}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="max_purchase_price"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Maksymalna wartość odkupu (PLN)
              </label>
              <input
                id="max_purchase_price"
                name="max_purchase_price"
                type="number"
                defaultValue={(businessRules.maxPurchasePrice as number) || 150000}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="guarantee_text"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Komunikat gwarancji / czasu wyceny
            </label>
            <input
              id="guarantee_text"
              name="guarantee_text"
              type="text"
              defaultValue={(businessRules.guaranteeText as string) || "Bezpłatna wycena w 15 minut"}
              placeholder="Np. Gotówka do ręki w 15 minut od oględzin"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* SEO & Meta Tags */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Optymalizacja SEO (Google)
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Konfiguracja tytułów i opisów meta widocznych w wynikach wyszukiwania Google.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="meta_title"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Tytuł strony w Google (Meta Title)
            </label>
            <input
              id="meta_title"
              name="meta_title"
              type="text"
              defaultValue={(seo.metaTitle as string) || ""}
              placeholder="Skup Aut za Gotówkę Warszawa | Auto Salon"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="meta_description"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Opis strony w Google (Meta Description)
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              rows={3}
              defaultValue={(seo.metaDescription as string) || ""}
              placeholder="Skup aut używanych i powypadkowych za gotówkę. Szybka wycena online, dojazd do klienta..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all resize-y"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
