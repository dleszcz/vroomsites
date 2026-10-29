"use client";

import { useState, useTransition } from "react";
import { Check, Copy, ExternalLink, Layers, Radio, DownloadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { SettingsTenantData } from "./types";
import { syncAutoplacAction } from "@/app/[dealerSlug]/admin/actions";

interface IntegrationsSettingsTabProps {
  tenant: SettingsTenantData;
  dealerSlug: string;
}

export function IntegrationsSettingsTab({ tenant, dealerSlug }: IntegrationsSettingsTabProps) {
  const [autoplacEnabled, setAutoplacEnabled] = useState<boolean>(
    Boolean(tenant.autoplac_enabled)
  );
  const [copied, setCopied] = useState(false);

  // One-Click Autoplac Import State
  const defaultAutoplacTarget = dealerSlug === "wadera" ? "wader" : dealerSlug;
  const [autoplacTarget, setAutoplacTarget] = useState(defaultAutoplacTarget);
  const [isPending, startTransition] = useTransition();
  const [syncStatus, setSyncStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
    count?: number;
  }>({ type: "idle", message: "" });

  const analytics = tenant.analytics || {};
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const feedUrl = `${origin}/api/integrations/autoplac/${dealerSlug}/feed.xml`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Błąd kopiowania do schowka:", err);
    }
  }

  function handleSyncAutoplac() {
    setSyncStatus({ type: "idle", message: "" });

    startTransition(async () => {
      try {
        const res = await syncAutoplacAction(dealerSlug, autoplacTarget.trim() || undefined);
        if (res.success) {
          setSyncStatus({
            type: "success",
            message: `Pomyślnie zaimportowano ${res.count ?? 0} pojazdów z Autoplac.pl do oferty salonu!`,
            count: res.count,
          });
        } else {
          setSyncStatus({
            type: "error",
            message: res.error || "Nie udało się pobrać floty z Autoplac.pl. Sprawdź identyfikator profilu.",
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd podczas synchronizacji.";
        setSyncStatus({ type: "error", message: msg });
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Autoplac Feature Toggle & Export Section */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
              <h3 className="text-base font-semibold text-slate-100">
                Eksport Ogłoszeń: Autoplac.pl
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  autoplacEnabled
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    autoplacEnabled ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
                {autoplacEnabled ? "Włączony" : "Wyłączony"}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatyczne generowanie ustandaryzowanego feedu XML dla portalu Autoplac.pl.
            </p>
          </div>

          <div className="flex items-center">
            {/* Accessible Toggle Switch */}
            <input
              type="hidden"
              name="autoplac_enabled"
              value={autoplacEnabled ? "true" : "false"}
            />
            <button
              type="button"
              role="switch"
              aria-checked={autoplacEnabled}
              onClick={() => setAutoplacEnabled((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                autoplacEnabled ? "bg-emerald-600" : "bg-slate-700"
              }`}
            >
              <span className="sr-only">Przełącz eksport Autoplac</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  autoplacEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dynamic Feed URL Details */}
        {autoplacEnabled ? (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-lg space-y-2">
              <label htmlFor="feed-url-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Twój oficjalny adres feedu XML
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  id="feed-url-input"
                  type="text"
                  readOnly
                  value={feedUrl}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-md px-3.5 py-2 text-xs font-mono text-emerald-300 focus:outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md text-xs font-medium transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Skopiowano</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiuj URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/50">
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Przekaż ten adres URL swojemu opiekunowi w Autoplac.pl lub wklej w ustawieniach integracji.
                Eksportowane są wyłącznie pojazdy ze statusem <strong>Dostępny</strong>.
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-slate-950/40 rounded-lg border border-slate-800/60 text-xs text-slate-400">
            Feed XML dla Autoplac.pl jest obecnie wyłączony. Po włączeniu pojawi się publiczny adres URL do synchronizacji oferty.
          </div>
        )}
      </section>

      {/* One-Click Fleet Import Section */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
              Import Floty z Autoplac.pl (One-Click Sync)
            </h3>
            <p className="text-sm text-slate-400">
              Pobierz aktualne ogłoszenia bezpośrednio ze swojego profilu dealera na Autoplac.pl i zasil bazę aut salonu.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-lg space-y-4">
          <div>
            <label htmlFor="autoplac-target-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Identyfikator dealera lub link do profilu na Autoplac.pl
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                id="autoplac-target-input"
                type="text"
                value={autoplacTarget}
                onChange={(e) => setAutoplacTarget(e.target.value)}
                placeholder="np. wader lub https://autoplac.pl/dealer/wader"
                disabled={isPending}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-md px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSyncAutoplac}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-md transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Pobieranie floty...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4 text-white" />
                    <span>Pobierz i zsynchronizuj flotę</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              System automatycznie przetworzy specyfikację techniczną, zdjęcia w wysokiej rozdzielczości oraz ceny i utworzy ogłoszenia w katalogu salonu.
            </p>
          </div>

          {/* Feedback status states */}
          {syncStatus.type === "success" && (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-md text-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-100">Synchronizacja powiodła się</p>
                <p className="text-xs text-emerald-300/90 mt-0.5">{syncStatus.message}</p>
              </div>
            </div>
          )}

          {syncStatus.type === "error" && (
            <div className="flex items-start gap-3 p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-md text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-rose-100">Błąd importu</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{syncStatus.message}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* External Webhooks & Analytics */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Arkusze Google i Analityka
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Konfiguracja automatycznych powiadomień oraz kodów śledzących ruch.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="google_sheets_webhook_url" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Google Sheets Webhook URL
            </label>
            <input
              id="google_sheets_webhook_url"
              name="google_sheets_webhook_url"
              type="url"
              defaultValue={tenant.google_sheets_webhook_url || ""}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Skrypt Google Apps Script automatycznie dodający napływające zapytania wycen do arkusza.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="pixel_id" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Meta Pixel ID
              </label>
              <input
                id="pixel_id"
                name="pixel_id"
                type="text"
                defaultValue={tenant.pixel_id || (analytics.pixelId as string) || ""}
                placeholder="Np. 123456789012345"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="google_analytics_id" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Google Analytics 4 (Measurement ID)
              </label>
              <input
                id="google_analytics_id"
                name="google_analytics_id"
                type="text"
                defaultValue={(analytics.googleAnalyticsId as string) || ""}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

