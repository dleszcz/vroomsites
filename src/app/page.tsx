import React from 'react';
import Link from 'next/link';
import { Car, ChevronRight, CheckCircle2, Star, Clock } from 'lucide-react';
import { GlobalB2CForm } from '@/components/global-b2c-form';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:bg-slate-800 transition-colors">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  VroomDealer
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="#jak-to-dziala" className="hover:text-slate-900 transition-colors">Jak to działa?</Link>
              <Link href="/dla-komisow" className="hover:text-slate-900 transition-colors">Dla Komisów</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-32 relative bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left: Copy */}
            <div className="lg:col-span-6 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-900" />
                Uczciwe wyceny rynkowe
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-[1.15]">
                Sprzedaj auto. <br />
                <span className="text-slate-700">Bezpiecznie i szybko.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-lg font-medium">
                Dzięki naszej sieci zweryfikowanych dealerów, otrzymasz rzetelną, gwarantowaną wycenę. Zero negocjacji na podjeździe, formalności załatwiane na miejscu, pieniądze na koncie tego samego dnia.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-full bg-slate-100 p-1 text-slate-900 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold">Wypłata od ręki</h3>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">Gotówka do ręki lub przelew natychmiastowy przy podpisaniu umowy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-full bg-slate-100 p-1 text-slate-900 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold">Brak ukrytych kosztów</h3>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">Nasza usługa wyceny jest w 100% darmowa dla sprzedającego.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Form */}
            <div className="lg:col-span-6 relative">
              <GlobalB2CForm />
            </div>

          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="jak-to-dziala" className="py-16 sm:py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">Jak to działa w praktyce?</h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">Trzy proste kroki dzielą Cię od bezpiecznej sprzedaży.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
                <span className="text-xl font-black text-slate-900">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Zgłoszenie Online</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Wypełnij nasz krótki formularz podając model auta, oczekiwaną kwotę i miejscowość. To zajmie mniej niż 3 minuty.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
                <span className="text-xl font-black text-slate-900">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Szybki Kontakt</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                W ciągu 24h nasz lokalny partner z Twojego regionu skontaktuje się, aby potwierdzić stan auta i przedstawić ostateczną ofertę.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-shadow border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 border border-slate-700">
                <span className="text-xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Podpisanie Umowy</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Wszystkie formalności załatwiamy u Ciebie na miejscu lub w partnerskim salonie. Pieniądze otrzymujesz od razu – w gotówce lub szybkim przelewem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-10 sm:py-12 text-slate-400 text-center sm:text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center justify-center gap-3">
            <Car className="h-6 w-6 text-slate-500" />
            <span className="text-xl font-bold tracking-tight text-slate-300">
              Vroom<span className="text-slate-500">Dealer</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm font-semibold">
            <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka Prywatności</Link>
            <Link href="/dla-komisow" className="hover:text-white transition-colors">Dla Komisów (B2B)</Link>
          </div>
          <div className="text-sm font-medium">
            &copy; {new Date().getFullYear()} VroomDealer.
          </div>
        </div>
      </footer>
    </main>
  );
}
