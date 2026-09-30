"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle2, ChevronDown, Search, Car, Calendar, DollarSign, MapPin, Phone, ArrowRight } from "lucide-react";

const CAR_DATABASE: Record<string, string[]> = {
  Volkswagen: ["Golf", "Passat", "Polo", "Tiguan", "Touran", "Touareg", "Arteon", "Caddy", "Transporter", "T-Roc", "T-Cross", "Sharan", "Up!"],
  Audi: ["A3", "A4", "A6", "A5", "Q5", "Q7", "A8", "Q3", "TT", "A1", "A7", "Q8"],
  BMW: ["Seria 3", "Seria 5", "Seria 1", "X5", "Seria 4", "X3", "Seria 7", "X1", "Seria 2", "X6"],
  "Mercedes-Benz": ["Klasa C", "Klasa E", "Klasa A", "Sprinter", "Klasa S", "GLA", "GLC", "GLE", "CLA", "Vito", "W124"],
  Ford: ["Focus", "Mondeo", "Fiesta", "Kuga", "Transit", "C-Max", "S-Max", "Ranger", "EcoSport", "Galaxy"],
  Opel: ["Astra", "Corsa", "Insignia", "Zafira", "Meriva", "Mokka", "Vectra", "Vivaro", "Combo", "Adam"],
  Toyota: ["Yaris", "Corolla", "Avensis", "RAV4", "Auris", "C-HR", "Aygo", "Camry", "Hilux", "Prius"],
  Skoda: ["Octavia", "Fabia", "Superb", "Kodiaq", "Kamiq", "Karoq", "Rapid", "Citigo"],
  Renault: ["Megane", "Clio", "Laguna", "Scenic", "Captur", "Master", "Kadjar", "Trafic", "Koleos", "Talisman"],
  Peugeot: ["208", "308", "508", "3008", "207", "2008", "5008", "Partner", "Boxer"],
  Citroen: ["C4", "C3", "Berlingo", "C5", "C3 Aircross", "C4 Picasso", "Jumper", "C1"],
  Hyundai: ["Tucson", "i30", "i20", "Santa Fe", "Kona", "ix35", "i10", "Elantra"],
  Kia: ["Ceed", "Sportage", "Rio", "Stonic", "Optima", "Sorento", "Picanto", "Proceed"],
  Nissan: ["Qashqai", "Juke", "X-Trail", "Micra", "Note", "Navara", "Primera"],
  Fiat: ["Tipo", "500", "Punto", "Panda", "Ducato", "Bravo", "Doblo", "Freemont"],
  Seat: ["Leon", "Ibiza", "Ateca", "Arona", "Toledo", "Altea", "Alhambra"],
  Volvo: ["XC60", "V60", "V40", "XC90", "S60", "S80", "XC40", "V70", "S40"],
  Mazda: ["6", "3", "CX-5", "CX-3", "2", "MX-5", "CX-30"],
  Honda: ["Civic", "CR-V", "Accord", "Jazz", "HR-V"],
  Dacia: ["Duster", "Sandero", "Logan", "Dokker", "Lodgy"],
  "Alfa Romeo": ["Giulietta", "159", "Stelvio", "Giulia", "147", "MiTo"],
  Suzuki: ["Vitara", "Swift", "SX4 S-Cross", "Grand Vitara", "Jimny"],
  Mitsubishi: ["Outlander", "Lancer", "ASX", "Pajero", "Colt"],
  Jeep: ["Grand Cherokee", "Cherokee", "Wrangler", "Renegade", "Compass"],
};

const ALL_MAKES = Object.keys(CAR_DATABASE);

export function GlobalB2CForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    expectedPrice: "",
    zipCode: "",
    phone: "",
    consent: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setShowBrandDropdown(false);
      }
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMakes = ALL_MAKES.filter((m) =>
    m.toLowerCase().includes((formData.brand || "").toLowerCase())
  );

  const matchedMakeKey = ALL_MAKES.find(
    (m) => m.toLowerCase() === (formData.brand || "").trim().toLowerCase()
  );

  const availableModels = matchedMakeKey ? CAR_DATABASE[matchedMakeKey] || [] : [];
  const filteredModels = availableModels.filter((mod) =>
    mod.toLowerCase().includes((formData.model || "").toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.brand)) {
      toast.error("Wybierz markę pojazdu");
      return;
    }
    if (step === 1 && !ALL_MAKES.some(m => m.toLowerCase() === formData.brand.toLowerCase())) {
      toast.error("Wybierz poprawną markę z listy");
      return;
    }
    if (step === 2 && (!formData.zipCode || !formData.expectedPrice)) {
      toast.error("Wypełnij wymagane pola");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 9) {
      toast.error("Podaj prawidłowy numer telefonu");
      return;
    }
    if (!formData.consent) {
      toast.error("Wymagana jest zgoda na przetwarzanie danych");
      return;
    }
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[500px] mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-center shadow-xl animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-slate-900" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Zgłoszenie przyjęte</h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8 font-medium">
          Dziękujemy za zgłoszenie. Certyfikowany dealer VroomDealer z Twojego regionu wkrótce skontaktuje się w celu weryfikacji i przedstawienia ostatecznej oferty odkupu.
        </p>
        <button 
          onClick={() => {
            setStep(1);
            setFormData({ brand: '', model: '', year: '', expectedPrice: '', zipCode: '', phone: '', consent: false });
            setIsSuccess(false);
          }}
          className="text-sm font-bold text-slate-900 hover:text-slate-800 transition-colors uppercase tracking-widest"
        >
          Powrót
        </button>
      </div>
    );
  }

  const inputClasses = "w-full pl-11 pr-4 py-3 sm:py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-slate-900 outline-none text-slate-900 placeholder-slate-400 font-semibold transition-colors";
  const labelClasses = "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest";

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Decorative header in form */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Darmowa Wycena Pojazdu</h2>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">Wypełnij dane, aby otrzymać niezobowiązującą, oficjalną ofertę wykupu za gotówkę.</p>
      </div>
      
      {/* Progress */}
      <div className="mb-10 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-slate-900' : 'bg-slate-100'}`} />
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (step === totalSteps) handleSubmit(e); else handleNext(); }}>
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div ref={brandRef} className="relative">
              <label className={labelClasses}>Marka <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="brand"
                  placeholder="Wyszukaj markę"
                  value={formData.brand}
                  onChange={(e) => {
                    handleChange(e);
                    setShowBrandDropdown(true);
                  }}
                  onFocus={() => setShowBrandDropdown(true)}
                  autoComplete="off"
                  className={inputClasses}
                />
              </div>

              {showBrandDropdown && filteredMakes.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-2">
                  {filteredMakes.map((make) => (
                    <div
                      key={make}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, brand: make, model: "" }));
                        setShowBrandDropdown(false);
                      }}
                      className="px-5 py-3 text-sm text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      {make}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div ref={modelRef} className="relative">
                <label className={labelClasses}>Model <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Car className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="model"
                    placeholder="Wybierz"
                    value={formData.model}
                    onChange={(e) => {
                      handleChange(e);
                      setShowModelDropdown(true);
                    }}
                    onFocus={() => setShowModelDropdown(true)}
                    autoComplete="off"
                    disabled={!formData.brand}
                    className={`${inputClasses} disabled:bg-slate-100 disabled:text-slate-400 cursor-text`}
                  />
                </div>

                {showModelDropdown && filteredModels.length > 0 && formData.brand && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-2">
                    {filteredModels.map((mod) => (
                      <div
                        key={mod}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, model: mod }));
                          setShowModelDropdown(false);
                        }}
                        className="px-5 py-3 text-sm text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
                      >
                        {mod}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClasses}>Rocznik <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className={`${inputClasses} appearance-none pr-10 ${!formData.year ? 'text-slate-400' : 'text-slate-900'}`}
                  >
                    <option value="" disabled>Wybierz</option>
                    {Array.from({ length: 32 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y} value={String(y)} className="text-slate-900">{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <label className={labelClasses}>Oczekiwana Kwota (PLN) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="expectedPrice"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  placeholder="np. 45000"
                  required
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Miejscowość / Kod Pocztowy <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Skąd odbieramy auto?"
                  required
                  className={inputClasses}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Służy do przypisania formularza do najbliższego autoryzowanego partnera (dealera).
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <label className={labelClasses}>Numer Telefonu <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="np. 500 600 700"
                  required
                  className={inputClasses}
                />
              </div>
            </div>
            
            <div className="flex items-start gap-3 mt-4">
              <input 
                type="checkbox"
                id="consent"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed font-medium cursor-pointer">
                Zgadzam się na przetwarzanie moich danych osobowych (w tym nr telefonu) przez VroomDealer oraz przekazanie ich lokalnemu partnerowi w celu przedstawienia oferty odkupu pojazdu, zgodnie z <a href="/polityka-prywatnosci" target="_blank" className="text-slate-900 hover:underline font-bold">Polityką Prywatności</a> (wymagane RODO).
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 flex-col sm:flex-row">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3.5 sm:py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors w-full sm:w-auto text-center"
            >
              Wstecz
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 sm:py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 w-full"
          >
            {step < totalSteps ? (
              <>Dalej <ArrowRight className="h-4 w-4" /></>
            ) : isSubmitting ? (
              "Wysyłanie..."
            ) : (
              "Wyślij do wyceny"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
