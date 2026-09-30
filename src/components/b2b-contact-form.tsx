"use client";

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function B2BContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const inputClasses = "w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-slate-900 outline-none text-slate-900 placeholder-slate-400 font-semibold transition-colors";
  const labelClasses = "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest";

  if (isSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-slate-900" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Zgłoszenie przyjęte!</h3>
        <p className="text-slate-600 font-medium mb-6">
          Dziękujemy za chęć dołączenia do zamkniętych testów VroomDealer. Skontaktujemy się z Tobą wkrótce w celu omówienia szczegółów.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm font-bold text-slate-900 hover:text-slate-800 uppercase tracking-widest"
        >
          Wyślij kolejne zgłoszenie
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative text-left">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Dołącz do testów</h3>
        <p className="text-sm font-medium text-slate-500">Zostaw kontakt, a odezwiemy się, aby porozmawiać o uruchomieniu regionu dla Ciebie.</p>
      </div>
      <div className="space-y-5">
        <div>
          <label className={labelClasses}>Imię i nazwisko</label>
          <input required type="text" className={inputClasses} placeholder="Jan Kowalski" />
        </div>
        <div>
          <label className={labelClasses}>Nazwa komisu</label>
          <input required type="text" className={inputClasses} placeholder="Auto Komis Premium" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClasses}>E-mail</label>
            <input required type="email" className={inputClasses} placeholder="jan@komis.pl" />
          </div>
          <div>
            <label className={labelClasses}>Telefon</label>
            <input required type="tel" className={inputClasses} placeholder="500 600 700" />
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50">
            {isSubmitting ? "Wysyłanie..." : <>Zgłoś chęć udziału <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>
    </form>
  );
}
