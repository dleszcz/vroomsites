"use client";

import { Phone, Clock, MapPin } from "lucide-react";
import type { SettingsTenantData } from "./types";

interface ContactSettingsTabProps {
  tenant: SettingsTenantData;
}

export function ContactSettingsTab({ tenant }: ContactSettingsTabProps) {
  const openingHours = (tenant.opening_hours as Record<string, unknown>) || {};

  return (
    <div className="space-y-8">
      {/* Contact Numbers & Channels */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Numery Telefonów i Szybki Kontakt
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Główne kanały kontaktu wyświetlane na wizytówce i przy ogłoszeniach samochodów.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact_phone"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Główny telefon kontaktowy <span className="text-emerald-400">*</span>
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              required
              defaultValue={tenant.contact_phone || ""}
              placeholder="+48 500 000 000"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp_number"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Numer WhatsApp (bez spacji)
            </label>
            <input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              defaultValue={tenant.whatsapp_number || ""}
              placeholder="48500000000"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Address Details */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Lokalizacja i Adres Komisu
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Dane teleadresowe dla nawigacji GPS oraz stopki strony.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="address"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Ulica i numer lokalu
              </label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={tenant.address || ""}
                placeholder="Np. ul. Modlińska 120"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Miejscowość <span className="text-emerald-400">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                defaultValue={tenant.city || ""}
                placeholder="Warszawa"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="postal_code"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Kod pocztowy
              </label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                defaultValue={tenant.postal_code || ""}
                placeholder="03-120"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="county"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Powiat
              </label>
              <input
                id="county"
                name="county"
                type="text"
                defaultValue={tenant.county || ""}
                placeholder="warszawski"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Województwo
              </label>
              <input
                id="region"
                name="region"
                type="text"
                defaultValue={tenant.region || ""}
                placeholder="Mazowieckie"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            Godziny Otwarcia
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Informacje o dostępności placu i dyżurach telefonicznych.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="hours_weekdays"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Poniedziałek – Piątek
            </label>
            <input
              id="hours_weekdays"
              name="hours_weekdays"
              type="text"
              defaultValue={(openingHours.weekdays as string) || "08:00 - 18:00"}
              placeholder="08:00 - 18:00"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="hours_saturday"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Sobota
            </label>
            <input
              id="hours_saturday"
              name="hours_saturday"
              type="text"
              defaultValue={(openingHours.saturday as string) || "09:00 - 14:00"}
              placeholder="09:00 - 14:00"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="hours_sunday"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Niedziela
            </label>
            <input
              id="hours_sunday"
              name="hours_sunday"
              type="text"
              defaultValue={(openingHours.sunday as string) || "Zamknięte (na telefon)"}
              placeholder="Zamknięte / Na telefon"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
