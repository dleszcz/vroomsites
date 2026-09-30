import React from 'react';
import Link from 'next/link';
import { Car, Briefcase, Zap, Shield, ArrowRight, UserCheck, Globe, Search, Megaphone, LineChart } from 'lucide-react';
import { B2BContactForm } from '@/components/b2b-contact-form';

export default function DlaKomisowPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
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
            <nav className="hidden md:flex items-center gap-6">
              <a href="#testy" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                Dołącz do testów
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-32 lg:pb-32 relative bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto">
            Pozyskuj więcej samochodów od <span className="text-slate-700">osób prywatnych.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            VroomDealer to ogólnopolska platforma, która pozyskuje i weryfikuje zgłoszenia od sprzedających, a następnie przekazuje je do autoryzowanych partnerów w regionie.
          </p>

          <a href="#testy" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-sm w-full sm:w-auto">
            Dołącz do testów <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* SPECS SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">System skupiony na wyniku biznesowym</h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">Dobrych samochodów nie brakuje. Trudniej je znaleźć. VroomDealer pomaga niezależnym komisom docierać do właścicieli aut.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lokalna strona komisu</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Strona zoptymalizowana pod Twój biznes, markę i lokalny rynek operacyjny.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <UserCheck className="h-7 w-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pozyskiwanie leadów</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Prosty formularz, dzięki któremu właściciel auta może zgłosić samochód bez dzwonienia.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <Search className="h-7 w-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lokalne SEO</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Docieramy bezpośrednio do osób szukających skupu aut w Twojej okolicy.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <Megaphone className="h-7 w-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kampanie reklamowe</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Docieramy do potencjalnych sprzedających w określonym obszarze geograficznym.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <LineChart className="h-7 w-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Analityka & Tracking</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Dokładnie wiesz, skąd przychodzą zgłoszenia i które kanały przynoszą kupione auta.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TESTY SECTION */}
      <section id="testy" className="py-20 sm:py-32 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Zamknięte testy z wybranymi komisami</h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              VroomDealer jest obecnie w fazie zamkniętych testów. Zgłoś swój komis, aby omówić możliwość dołączenia jako nasz partner w swoim regionie.
            </p>
          </div>
          
          <B2BContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-10 sm:py-12 text-slate-400 text-center sm:text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center justify-center gap-3">
            <Car className="h-6 w-6 text-slate-500" />
            <span className="text-xl font-bold tracking-tight text-slate-300">
              VroomDealer
            </span>
          </div>
          <div className="flex gap-6 text-sm font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Strona Główna</Link>
            <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka Prywatności</Link>
          </div>
          <div className="text-sm font-medium">
            &copy; {new Date().getFullYear()} VroomDealer B2B Partners.
          </div>
        </div>
      </footer>
    </main>
  );
}
