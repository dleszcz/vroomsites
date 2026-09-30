import React from 'react';
import Link from 'next/link';
import { Car, ArrowLeft, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
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
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Powrót
            </Link>
          </div>
        </div>
      </header>

      {/* DOCUMENT SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-8 py-8 border-b border-slate-200 sm:px-12">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white border border-slate-200 shadow-sm mb-4">
                <FileText className="h-6 w-6 text-slate-900" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Polityka Prywatności</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">Ostatnia aktualizacja: Wrzesień 2026</p>
            </div>

            <div className="p-8 sm:p-12 prose prose-slate max-w-none">
              <p className="lead text-lg text-slate-600 mb-10 font-medium leading-relaxed">
                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu VroomDealer.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">1. Administrator Danych Osobowych</h2>
              <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                Administratorem danych osobowych zawartych w serwisie jest VroomDealer z siedzibą w Polsce. W razie pytań dotyczących przetwarzania danych prosimy o kontakt pod adresem e-mail: <strong className="text-slate-900">biuro@vroomdealer.pl</strong>.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">2. Cel Zbierania Danych</h2>
              <p className="text-slate-600 leading-relaxed mb-4 font-medium">
                Dane zbierane przez formularze na stronie służą wyłącznie do:
              </p>
              <ul className="list-none space-y-3 text-slate-600 mb-8 pl-0">
                <li className="flex items-start gap-3 font-medium">
                  <span className="text-slate-900 mt-1 font-bold">•</span>
                  <span>Przekazania informacji o pojeździe (marka, rocznik, miasto) oraz danych kontaktowych w celu dokonania darmowej wyceny.</span>
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <span className="text-slate-900 mt-1 font-bold">•</span>
                  <span>Przekazania zapytania do autoryzowanych partnerów VroomDealer w okolicy Użytkownika.</span>
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <span className="text-slate-900 mt-1 font-bold">•</span>
                  <span>Nawiązania kontaktu w celu sfinalizowania odkupu pojazdu.</span>
                </li>
              </ul>

              <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">3. Ochrona i Udostępnianie</h2>
              <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                Twoje dane (numer telefonu, miasto oraz szczegóły auta) udostępniamy jedynie <strong>certyfikowanym partnerom biznesowym</strong> (komisom) współpracującym z naszą platformą. Są to zweryfikowane firmy motoryzacyjne gwarantujące bezpieczeństwo transakcji. Zapewniamy najwyższe standardy bezpieczeństwa; nie udostępniamy danych podmiotom trzecim poza procesem wyceny.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">4. Prawa Użytkownika</h2>
              <p className="text-slate-600 leading-relaxed mb-4 font-medium">
                Zgodnie z przepisami RODO przysługuje Ci pełne prawo do:
              </p>
              <ul className="list-none space-y-3 text-slate-600 mb-8 pl-0 font-medium">
                <li className="flex items-start gap-3"><span className="text-slate-900 mt-1 font-bold">•</span>Dostępu do swoich danych oraz otrzymania ich kopii.</li>
                <li className="flex items-start gap-3"><span className="text-slate-900 mt-1 font-bold">•</span>Sprostowania lub całkowitego usunięcia (prawo do bycia zapomnianym).</li>
                <li className="flex items-start gap-3"><span className="text-slate-900 mt-1 font-bold">•</span>Cofnięcia zgody na przetwarzanie danych w dowolnym momencie.</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between items-center sm:px-12">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">VD-DOC-2026</span>
              <FileText className="h-5 w-5 text-slate-300" />
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
            <Link href="/" className="hover:text-white transition-colors">Strona Główna</Link>
            <Link href="/dla-komisow" className="hover:text-white transition-colors">Dla Komisów (B2B)</Link>
          </div>
          <div className="text-sm font-medium">
            &copy; {new Date().getFullYear()} VroomDealer. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </main>
  );
}
