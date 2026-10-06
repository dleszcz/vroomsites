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
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        background: "rgba(10, 15, 29, 0.88)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
        padding: "28px",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* SUCCESS SCREEN */}
      {submitted ? (
        <div style={{ textAlign: "center", padding: "40px 10px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: "2px solid #10b981",
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h3 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>
            Zgłoszenie zostało odebrane!
          </h3>

          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 24px" }}>
            Nasz doradca analizuje podane dane. Skontaktujemy się telefonicznie w najkrótszym możliwym czasie z bezpłatną wyceną.
          </p>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              padding: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: primaryColor,
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <Clock size={18} />
            <span>Godziny obsługi: Pn–Pt 8:00–20:00, Sob–Nd 10:00–18:00</span>
          </div>
        </div>
      ) : (
        <>
          {/* PROGRESS BAR */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                KROK {step} Z {totalSteps}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
                {progressPercent}% UKOŃCZONE
              </span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: accentColor,
                  borderRadius: "999px",
                  transition: "width 0.4s ease",
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
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                  1. Dane Podstawowe Pojazdu
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                  Wybierz lub wpisz markę, model oraz rok produkcji samochodu.
                </p>

                <div style={{ display: "grid", gap: "16px" }}>
                  {/* BRAND AUTOCOMPLETE */}
                  <div ref={brandRef} style={{ position: "relative" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                      Marka pojazdu <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Wpisz lub wybierz markę (np. Volkswagen, Audi, BMW)"
                        {...register("brand", {
                          onChange: () => {
                            triggerFormStart();
                            setShowBrandDropdown(true);
                          },
                        })}
                        onFocus={() => setShowBrandDropdown(true)}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          padding: "0 40px 0 16px",
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: errors.brand ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                      <ChevronDown
                        size={18}
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "rgba(255,255,255,0.5)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>

                    {showBrandDropdown && filteredMakes.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 99,
                          marginTop: "4px",
                          maxHeight: "220px",
                          overflowY: "auto",
                          background: "#0d1322",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                        }}
                      >
                        {filteredMakes.map((make) => (
                          <div
                            key={make}
                            onClick={() => {
                              setValue("brand", make, { shouldValidate: true });
                              setShowBrandDropdown(false);
                              triggerFormStart();
                            }}
                            style={{
                              padding: "12px 16px",
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#ffffff",
                              cursor: "pointer",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {make}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.brand && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.brand.message}</p>}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
                    {/* MODEL AUTOCOMPLETE */}
                    <div ref={modelRef} style={{ position: "relative" }}>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                        Model pojazdu
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          placeholder={selectedBrand ? `Wpisz model ${selectedBrand}` : "np. Passat, A4, Golf"}
                          {...register("model", {
                            onChange: () => {
                              triggerFormStart();
                              setShowModelDropdown(true);
                            },
                          })}
                          onFocus={() => setShowModelDropdown(true)}
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            padding: "0 40px 0 16px",
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "#ffffff",
                            fontSize: "16px",
                            outline: "none",
                          }}
                        />
                        <ChevronDown
                          size={18}
                          style={{
                            position: "absolute",
                            right: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255,255,255,0.5)",
                            pointerEvents: "none",
                          }}
                        />
                      </div>

                      {showModelDropdown && filteredModels.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            zIndex: 99,
                            marginTop: "4px",
                            maxHeight: "220px",
                            overflowY: "auto",
                            background: "#0d1322",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                          }}
                        >
                          {filteredModels.map((mod) => (
                            <div
                              key={mod}
                              onClick={() => {
                                setValue("model", mod);
                                setShowModelDropdown(false);
                                triggerFormStart();
                              }}
                              style={{
                                padding: "12px 16px",
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#ffffff",
                                cursor: "pointer",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                transition: "background 0.15s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              {mod}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                        Rok produkcji
                      </label>
                      <select
                        {...register("year")}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          padding: "0 16px",
                          borderRadius: "12px",
                          background: "rgba(10, 15, 29, 0.9)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          fontSize: "16px",
                          outline: "none",
                        }}
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
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                  2. Stan Techniczny i Oczekiwania
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                  Skupujemy auta w każdym stanie: sprawne, uszkodzone, powypadkowe i do kasacji.
                </p>

                <div style={{ display: "grid", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                        Przebieg (km)
                      </label>
                      <input
                        type="text"
                        placeholder="np. 185000"
                        {...register("mileage")}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          padding: "0 16px",
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                        Oczekiwana kwota (PLN)
                      </label>
                      <input
                        type="text"
                        placeholder="np. 25000"
                        {...register("expectedPrice")}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          padding: "0 16px",
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                      Stan pojazdu
                    </label>
                    <select
                      {...register("condition")}
                      style={{
                        width: "100%",
                        minHeight: "52px",
                        padding: "0 16px",
                        borderRadius: "12px",
                        background: "rgba(10, 15, 29, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                      }}
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
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                  3. Dane Kontaktowe i Lokalizacja
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                  Na ten numer oddzwonimy z natychmiastową wyceną.
                </p>

                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                      Numer telefonu <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="np. 530 826 501"
                      {...register("customerPhone")}
                      style={{
                        width: "100%",
                        minHeight: "52px",
                        padding: "0 16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: errors.customerPhone ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                    {errors.customerPhone && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.customerPhone.message}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                      Miejscowość / Miasto <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="np. Topólka, Radziejów, Włocławek"
                      {...register("city")}
                      style={{
                        width: "100%",
                        minHeight: "52px",
                        padding: "0 16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: errors.city ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                    {errors.city && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.city.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ZDJĘCIA (OPCJONALNIE) */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                  4. Dodaj Zdjęcia Pojazdu (Opcjonalnie)
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                  Zdjęcia pomagają nam w dokładniejszej i szybszej wycenie. Max 4 zdjęcia.
                </p>

                <div
                  style={{
                    border: "2px dashed rgba(255, 255, 255, 0.25)",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.03)",
                    cursor: "pointer",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                    id="photo-upload-input"
                  />
                  <label htmlFor="photo-upload-input" style={{ cursor: "pointer", display: "block" }}>
                    <Upload size={32} style={{ color: primaryColor, marginBottom: "8px" }} />
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                      Kliknij lub przeciągnij zdjęcia
                    </div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
                      PNG, JPG, WEBP do 4 plików
                    </div>
                  </label>
                </div>

                {/* Photo Previews */}
                {photoPreviews.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
                    {photoPreviews.map((src, i) => (
                      <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "1" }}>
                        <img src={src} alt={`Zdjęcie ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            borderRadius: "50%",
                            color: "#fff",
                            width: "22px",
                            height: "22px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
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
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "12px", padding: "12px", color: "#fca5a5", fontSize: "14px", marginTop: "16px" }}>
                {errorMsg}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    minHeight: "52px",
                    padding: "0 20px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <ArrowLeft size={18} />
                  Cofnij
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    flex: 1,
                    minHeight: "52px",
                    borderRadius: "14px",
                    background: accentColor,
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "16px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: `0 8px 20px ${accentColor}55`,
                  }}
                >
                  <span>Dalej</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    minHeight: "54px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "17px",
                    border: "none",
                    cursor: loading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <ShieldCheck size={20} />
                  <span>{loading ? "Wysyłanie wyceny..." : "Zamów bezpłatną wycenę"}</span>
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
