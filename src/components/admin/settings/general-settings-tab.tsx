"use client";

import { Building2, Globe, Mail, FileText } from "lucide-react";
import type { SettingsTenantData } from "./types";

interface GeneralSettingsTabProps {
  tenant: SettingsTenantData;
  dealerSlug: string;
}

export function GeneralSettingsTab({ tenant, dealerSlug }: GeneralSettingsTabProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
          Identyfikacja Komisu
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Podstawowe dane o Twoim salonie lub komisie widoczne w nagłówku, stopce oraz ofercie.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="business_name"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
          >
            Nazwa firmy / komisu <span className="text-emerald-400">*</span>
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            required
            defaultValue={tenant.business_name || ""}
            placeholder="Np. Auto Salon Warszawa"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="business_description"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
          >
            Opis działalności / Podtytuł
          </label>
          <div className="relative">
            <textarea
              id="business_description"
              name="business_description"
              rows={3}
              defaultValue={tenant.business_description || ""}
              placeholder="Np. Samochody bezwypadkowe z udokumentowaną historią, skup za gotówkę oraz gwarancja techniczna..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all resize-y"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zwięzły opis prezentowany potencjalnym klientom w nagłówku i sekcji &quot;O nas&quot;.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <div>
            <label
              htmlFor="notification_email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Email do powiadomień
            </label>
            <div className="relative">
              <input
                id="notification_email"
                name="notification_email"
                type="email"
                defaultValue={tenant.notification_email || ""}
                placeholder="kontakt@twojkomis.pl"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Adres, na który trafiają zapytania z formularzy wyceny i kontaktu.
            </p>
          </div>

          <div>
            <label
              htmlFor="custom_domain"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Własna domena (Custom Domain)
            </label>
            <div className="relative">
              <input
                id="custom_domain"
                name="custom_domain"
                type="text"
                defaultValue={tenant.custom_domain || ""}
                placeholder="twoj-komis.pl"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Domyślny adres: <code className="text-emerald-400">/{dealerSlug}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
