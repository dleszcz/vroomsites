"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DealerTenant } from "@/types/landing";
import { ArrowRight, ArrowLeft, CheckCircle2, Upload, Phone, ShieldCheck, X, Clock, ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Popular car database for autocompletion
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

// Zod Schema for validation
const leadFormSchema = z.object({
  brand: z.string().min(2, "Podaj markę pojazdu (min. 2 znaki)"),
  model: z.string().optional(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  condition: z.enum(["sprawny", "uszkodzony", "powypadkowy", "bez_oc_przegladu", "zlomowanie"]),
  expectedPrice: z.string().optional(),
  customerPhone: z.string().min(9, "Podaj prawidłowy numer telefonu (min. 9 cyfr)"),
  city: z.string().min(2, "Podaj miejscowość / miasto"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface MultiStepLeadFormProps {
  tenant: DealerTenant;
  localCity?: string;
}

export function MultiStepLeadForm({ tenant, localCity }: MultiStepLeadFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Autocomplete state
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  // Photo uploads state (base64 data preview, max 4 photos)
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const totalSteps = 4;
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";
  const accentColor = tenant.branding?.colors?.accent || primaryColor;

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: "2015",
      mileage: "",
      condition: "sprawny",
      expectedPrice: "",
      customerPhone: "",
      city: localCity || "",
    },
  });

  const selectedBrand = watch("brand");
  const selectedModel = watch("model");

  // Close autocomplete dropdowns when clicking outside
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

  // Filtered makes based on user query
  const filteredMakes = ALL_MAKES.filter((m) =>
    m.toLowerCase().includes((selectedBrand || "").toLowerCase())
  );

  // Find exact or matched make key
  const matchedMakeKey = ALL_MAKES.find(
    (m) => m.toLowerCase() === (selectedBrand || "").trim().toLowerCase()
  );

  // Filtered models for matched make
  const availableModels = matchedMakeKey ? CAR_DATABASE[matchedMakeKey] || [] : [];
  const filteredModels = availableModels.filter((mod) =>
    mod.toLowerCase().includes((selectedModel || "").toLowerCase())
  );

  // Track form_start event on first input
  const triggerFormStart = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackEvent("form_start", { dealer_id: tenant.id, dealer_slug: tenant.slug });
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 4 - photoPreviews.length);

    for (const file of files) {
      try {
        const compressedBase64 = await compressImage(file);
        setPhotoPreviews((prev) => [...prev, compressedBase64].slice(0, 4));
      } catch (err) {
        console.error("Image compression error:", err);
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    triggerFormStart();
    let isStepValid = false;

    if (step === 1) {
      isStepValid = await trigger(["brand"]);
    } else if (step === 2) {
      isStepValid = true;
    } else if (step === 3) {
      isStepValid = await trigger(["customerPhone", "city"]);
    }

    if (isStepValid && step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    if (photoPreviews.length === 0) {
      setErrorMsg("Dodaj przynajmniej 1 zdjęcie samochodu (zdjęcia są wymagane).");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const conditionMap: Record<string, string> = {
        sprawny: "Sprawny / Używany",
        uszkodzony: "Uszkodzony mechanicznie",
        powypadkowy: "Powypadkowy",
        bez_oc_przegladu: "Bez OC / Przeglądu",
        zlomowanie: "Do złomowania / Kasacji",
      };
      const conditionLabel = conditionMap[data.condition] || data.condition;
      const vehicleDetailsStr = `${data.brand} ${data.model || ""} (${data.year || "brak roku"}), przebieg: ${data.mileage || "brak"} km, stan: ${conditionLabel}, cena: ${data.expectedPrice || "brak"} PLN`;

      const payload = {
        dealerId: tenant.id,
        dealerSlug: tenant.slug,
        source: "lead_form_v2",
        customerPhone: data.customerPhone,
        customerName: `Klient (${data.city})`,
        city: data.city,
        brand: data.brand,
        model: data.model || "",
        year: data.year || "",
        mileage: data.mileage || "",
        condition: data.condition,
        expectedPrice: data.expectedPrice || "",
        photosCount: photoPreviews.length,
        photos: photoPreviews,
        vehicleDetails: vehicleDetailsStr,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Wystąpił błąd podczas wysyłania zgłoszenia.");
      }

      setSubmitted(true);
      trackEvent("form_submission", { dealer_id: tenant.id, dealer_slug: tenant.slug });

      // Trigger Meta Pixel Lead event ONLY on success
      if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", "Lead", {
          content_name: `${data.brand} ${data.model}`,
          city: data.city,
        });
      }
    } catch (err: unknown) {
      console.error("Lead Submission Error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div
      id="lead-form"
      className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-lg shadow-sm p-6 sm:p-8 relative overflow-visible"
    >
      {/* SUCCESS SCREEN */}
      {submitted ? (
        <div className="text-center py-10 px-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border-2 border-emerald-500">
            <CheckCircle2 size={36} />
          </div>

          <h3 className="text-2xl font-extrabold text-zinc-950 mb-2 font-heading">
            Zgłoszenie zostało odebrane!
          </h3>

          <p className="text-sm md:text-base text-zinc-600 leading-relaxed max-w-md mx-auto mb-6">
            Nasz doradca analizuje podane dane. Skontaktujemy się telefonicznie w najkrótszym możliwym czasie z bezpłatną wyceną.
          </p>

          <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3.5 inline-flex items-center gap-2 text-zinc-700 text-xs md:text-sm font-semibold">
            <Clock size={16} style={{ color: primaryColor }} />
            <span>Godziny obsługi: Pn–Pt 8:00–20:00, Sob–Nd 10:00–18:00</span>
          </div>
        </div>
      ) : (
        <>
          {/* PROGRESS BAR */}
          <div className="mb-7">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Krok {step} z {totalSteps}
              </span>
              <span className="text-xs font-bold text-zinc-600">
                {progressPercent}% ukończone
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 border border-zinc-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  background: primaryColor,
                }}
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === totalSteps) {
                handleSubmit(onSubmit)(e);
              } else {
                nextStep();
              }
            }}
          >
            {/* STEP 1: DANE PODSTAWOWE */}
            {step === 1 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-1 font-heading">
                  1. Dane podstawowe pojazdu
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 mb-5 leading-relaxed">
                  Wybierz lub wpisz markę, model oraz rok produkcji samochodu.
                </p>

                <div className="grid gap-4">
                  {/* BRAND AUTOCOMPLETE */}
                  <div ref={brandRef} className="relative">
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Marka pojazdu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Wpisz lub wybierz markę (np. Volkswagen, Opel, BMW)"
                        {...register("brand", {
                          onChange: () => {
                            triggerFormStart();
                            setShowBrandDropdown(true);
                          },
                        })}
                        onFocus={() => setShowBrandDropdown(true)}
                        className={`w-full min-h-[46px] px-3.5 pr-10 rounded-md bg-zinc-50 border ${
                          errors.brand ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-zinc-400"
                        } text-zinc-950 placeholder:text-zinc-400 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-400 outline-none transition-colors`}
                      />
                      <ChevronDown
                        size={18}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                      />
                    </div>

                    {showBrandDropdown && filteredMakes.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white border border-zinc-200 rounded-md shadow-lg">
                        {filteredMakes.map((make) => (
                          <div
                            key={make}
                            onClick={() => {
                              setValue("brand", make, { shouldValidate: true });
                              setShowBrandDropdown(false);
                              triggerFormStart();
                            }}
                            className="px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-b-0 transition-colors"
                          >
                            {make}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* MODEL AUTOCOMPLETE */}
                    <div ref={modelRef} className="relative">
                      <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                        Model pojazdu
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={selectedBrand ? `Wpisz model ${selectedBrand}` : "np. Astra, Passat, 206"}
                          {...register("model", {
                            onChange: () => {
                              triggerFormStart();
                              setShowModelDropdown(true);
                            },
                          })}
                          onFocus={() => setShowModelDropdown(true)}
                          className="w-full min-h-[46px] px-3.5 pr-10 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-colors"
                        />
                        <ChevronDown
                          size={18}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                        />
                      </div>

                      {showModelDropdown && filteredModels.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white border border-zinc-200 rounded-md shadow-lg">
                          {filteredModels.map((mod) => (
                            <div
                              key={mod}
                              onClick={() => {
                                setValue("model", mod);
                                setShowModelDropdown(false);
                                triggerFormStart();
                              }}
                              className="px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-b-0 transition-colors"
                            >
                              {mod}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                        Rok produkcji
                      </label>
                      <select
                        {...register("year")}
                        className="w-full min-h-[46px] px-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-950 text-sm focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-colors"
                      >
                        {Array.from({ length: 32 }, (_, i) => 2026 - i).map((y) => (
                          <option key={y} value={String(y)}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: STAN I CENA */}
            {step === 2 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-1 font-heading">
                  2. Stan techniczny i oczekiwania
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 mb-5 leading-relaxed">
                  Skupujemy auta w każdym stanie: sprawne, uszkodzone, powypadkowe i do kasacji.
                </p>

                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                        Przebieg (km)
                      </label>
                      <input
                        type="text"
                        placeholder="np. 185 000"
                        {...register("mileage")}
                        className="w-full min-h-[46px] px-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                        Oczekiwana kwota (PLN)
                      </label>
                      <input
                        type="text"
                        placeholder="np. 8 500"
                        {...register("expectedPrice")}
                        className="w-full min-h-[46px] px-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Stan pojazdu
                    </label>
                    <select
                      {...register("condition")}
                      className="w-full min-h-[46px] px-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-950 text-sm focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-colors"
                    >
                      <option value="sprawny">Sprawny / Używany</option>
                      <option value="uszkodzony">Uszkodzony mechanicznie</option>
                      <option value="powypadkowy">Powypadkowy</option>
                      <option value="bez_oc_przegladu">Bez OC / Przeglądu</option>
                      <option value="zlomowanie">Do złomowania / Kasacji</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DANE KONTAKTOWE */}
            {step === 3 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-1 font-heading">
                  3. Dane kontaktowe i lokalizacja
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 mb-5 leading-relaxed">
                  Na ten numer oddzwonimy z natychmiastową, bezpłatną wyceną.
                </p>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Numer telefonu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="np. 530 826 501"
                      {...register("customerPhone")}
                      className={`w-full min-h-[46px] px-3.5 rounded-md bg-zinc-50 border ${
                        errors.customerPhone ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-zinc-400"
                      } text-zinc-950 placeholder:text-zinc-400 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-400 outline-none transition-colors`}
                    />
                    {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Miejscowość / Miasto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="np. Topólka, Radziejów, Włocławek"
                      {...register("city")}
                      className={`w-full min-h-[46px] px-3.5 rounded-md bg-zinc-50 border ${
                        errors.city ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-zinc-400"
                      } text-zinc-950 placeholder:text-zinc-400 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-400 outline-none transition-colors`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ZDJĘCIA (WYMAGANE) */}
            {step === 4 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-950 mb-1 font-heading">
                  4. Dodaj zdjęcia pojazdu <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 mb-5 leading-relaxed">
                  Dodaj przynajmniej 1 zdjęcie pojazdu (np. z zewnątrz lub wnętrze). Zdjęcia są niezbędne do przygotowania rzetelnej oferty odkupu. (Max 4 zdjęcia).
                </p>

                <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center bg-zinc-50/70 hover:bg-zinc-50 hover:border-zinc-400 transition-colors cursor-pointer mb-5">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <label htmlFor="photo-upload-input" className="cursor-pointer block">
                    <Upload size={32} className="mx-auto mb-2" style={{ color: primaryColor }} />
                    <div className="text-sm font-bold text-zinc-900">
                      Kliknij lub przeciągnij zdjęcia
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      PNG, JPG, WEBP do 4 plików
                    </div>
                  </label>
                </div>

                {/* Photo Previews */}
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2.5 mb-5">
                    {photoPreviews.map((src, i) => (
                      <div key={i} className="relative rounded-md overflow-hidden aspect-square border border-zinc-200 bg-zinc-100">
                        <img src={src} alt={`Zdjęcie ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-xs font-medium mt-4">
                {errorMsg}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 mt-7 pt-5 border-t border-zinc-100">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="h-11 px-5 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Cofnij</span>
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 h-11 px-5 rounded-md text-white font-bold text-sm shadow-xs transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    background: primaryColor,
                    color: "#ffffff",
                  }}
                >
                  <span style={{ color: "#ffffff" }}>Dalej</span>
                  <ArrowRight size={16} className="text-white" style={{ color: "#ffffff" }} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="flex-1 h-11 px-5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                  style={{ color: "#ffffff" }}
                >
                  <ShieldCheck size={18} className="text-white" style={{ color: "#ffffff" }} />
                  <span style={{ color: "#ffffff" }}>
                    {loading ? "Wysyłanie wyceny..." : "Zamów bezpłatną wycenę"}
                  </span>
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
