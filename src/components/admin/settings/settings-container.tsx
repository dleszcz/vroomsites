"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Building2, Palette, Phone, Layers, Search, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateTenant } from "@/app/[dealerSlug]/admin/actions";
import type { SettingsContainerProps, SettingsTabId } from "./types";
import { GeneralSettingsTab } from "./general-settings-tab";
import { BrandingSettingsTab } from "./branding-settings-tab";
import { ContactSettingsTab } from "./contact-settings-tab";
import { IntegrationsSettingsTab } from "./integrations-settings-tab";
import { SeoRulesSettingsTab } from "./seo-rules-settings-tab";

interface TabItem {
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const TABS: TabItem[] = [
  { id: "general", label: "Identyfikacja", icon: Building2 },
  { id: "branding", label: "Kolory i Logo", icon: Palette },
  { id: "contact", label: "Kontakt i Godziny", icon: Phone },
  { id: "integrations", label: "Integracje i Autoplac", icon: Layers },
  { id: "seo", label: "SEO i Reguły", icon: Search },
];

export function SettingsContainer({ tenant, targetSlug, dealerSlug }: SettingsContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = searchParams.get("tab") as SettingsTabId | null;
  const [activeTab, setActiveTab] = useState<SettingsTabId>(urlTab || "general");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const justSaved = searchParams.get("saved") === "true";

  useEffect(() => {
    if (urlTab && TABS.some((t) => t.id === urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  function handleTabChange(tabId: SettingsTabId) {
    setActiveTab(tabId);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", tabId);
    newParams.delete("saved");
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateTenant(formData);
      } catch (e) {
        if (e instanceof Error && (e.message.includes("NEXT_REDIRECT") || e.message.includes("digest"))) {
          return;
        }
        setError(e instanceof Error ? e.message : "Wystąpił nieoczekiwany błąd podczas zapisu.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {targetSlug && <input type="hidden" name="target_slug" value={targetSlug} />}

      {/* Success Notification */}
      {justSaved && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={1.75} />
          <span>Wszystkie ustawienia komisu zostały pomyślnie zapisane i zaktualizowane.</span>
        </div>
      )}

      {/* Error Notification with Retry */}
      {error && (
        <div className="flex items-start justify-between gap-3 p-4 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" strokeWidth={1.75} />
            <span>{error}</span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="text-xs font-semibold underline hover:text-white shrink-0 ml-4"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-1.5 p-1.5 bg-slate-900/60 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-slate-800 text-slate-100 shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} strokeWidth={1.75} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="pt-2">
        {activeTab === "general" && <GeneralSettingsTab tenant={tenant} dealerSlug={dealerSlug} />}
        {activeTab === "branding" && <BrandingSettingsTab tenant={tenant} />}
        {activeTab === "contact" && <ContactSettingsTab tenant={tenant} />}
        {activeTab === "integrations" && <IntegrationsSettingsTab tenant={tenant} dealerSlug={dealerSlug} />}
        {activeTab === "seo" && <SeoRulesSettingsTab tenant={tenant} dealerSlug={dealerSlug} />}
      </div>

      {/* Sticky Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl shadow-xl">
        <p className="text-xs text-slate-400">
          Zapisanie formularza natychmiast aktualizuje ofertę i wizytówkę komisu.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-70 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Zapisywanie...</span>
            </>
          ) : (
            <span>Zapisz ustawienia</span>
          )}
        </button>
      </div>
    </form>
  );
}
