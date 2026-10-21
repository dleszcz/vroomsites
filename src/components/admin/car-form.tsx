"use client";

import React, { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { createCar, updateCar, deleteCar } from "@/app/[dealerSlug]/admin/actions";
import { Car } from "@/types/database";
import {
  CAR_DATABASE,
  ALL_MAKES,
  FUEL_TYPES,
  TRANSMISSIONS,
  CAR_COLORS,
  POPULAR_YEARS,
} from "@/lib/car-database";
import { uploadCarPhoto } from "@/lib/image-upload";
import { Upload, X, Star, Loader2, Link as LinkIcon, Trash2 } from "lucide-react";

interface CarFormProps {
  tenantSlug: string;
  initialData?: Car | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CarForm({ tenantSlug, initialData, onSuccess, onCancel }: CarFormProps) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  // Form State
  const initialMake = initialData?.make || "";
  const isInitialMakeInDb = ALL_MAKES.includes(initialMake);

  const [selectedMake, setSelectedMake] = useState<string>(
    initialMake ? (isInitialMakeInDb ? initialMake : "__other__") : ""
  );
  const [customMake, setCustomMake] = useState<string>(
    initialMake && !isInitialMakeInDb ? initialMake : ""
  );

  const availableModels = selectedMake && selectedMake !== "__other__" ? CAR_DATABASE[selectedMake] || [] : [];
  const initialModel = initialData?.model || "";
  const isInitialModelInDb = availableModels.includes(initialModel);

  const [selectedModel, setSelectedModel] = useState<string>(
    initialModel ? (isInitialModelInDb ? initialModel : "__other__") : ""
  );
  const [customModel, setCustomModel] = useState<string>(
    initialModel && !isInitialModelInDb ? initialModel : ""
  );

  const [formData, setFormData] = useState({
    year: initialData?.year?.toString() || "",
    price: initialData?.price?.toString() || "",
    mileage: initialData?.mileage?.toString() || "",
    fuel_type: initialData?.fuel_type || "Benzyna",
    engine_capacity: initialData?.engine_capacity || "",
    transmission: initialData?.transmission || "Manualna",
    color: initialData?.color || "Czarny",
    description: initialData?.description || "",
    images: initialData?.images || ([] as string[]),
  });

  const [manualUrls, setManualUrls] = useState<string>(
    initialData?.images?.join(", ") || ""
  );

  // Update brand selection
  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel("");
    setCustomModel("");
    if (make !== "__other__") {
      setCustomMake("");
    }
  };

  // Update model selection
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    if (model !== "__other__") {
      setCustomModel("");
    }
  };

  // Photo uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileList = Array.from(files);
    setUploadProgress({ current: 0, total: fileList.length });

    const newUrls: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      try {
        setUploadProgress({ current: i + 1, total: fileList.length });
        const uploadedUrl = await uploadCarPhoto(fileList[i], tenantSlug);
        newUrls.push(uploadedUrl);
      } catch (err: any) {
        console.error("Błąd wgrywania pliku:", err);
        alert(`Błąd podczas wgrywania pliku ${fileList[i].name}: ${err.message}`);
      }
    }

    if (newUrls.length > 0) {
      setFormData((prev) => {
        const updatedImages = [...prev.images, ...newUrls];
        setManualUrls(updatedImages.join(", "));
        return { ...prev, images: updatedImages };
      });
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== indexToRemove);
      setManualUrls(updatedImages.join(", "));
      return { ...prev, images: updatedImages };
    });
  };

  const makePhotoPrimary = (indexToPrimary: number) => {
    setFormData((prev) => {
      const selected = prev.images[indexToPrimary];
      const withoutSelected = prev.images.filter((_, i) => i !== indexToPrimary);
      const updatedImages = [selected, ...withoutSelected];
      setManualUrls(updatedImages.join(", "));
      return { ...prev, images: updatedImages };
    });
  };

  const handleManualUrlsChange = (val: string) => {
    setManualUrls(val);
    const parsed = val.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, images: parsed }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalMake = selectedMake === "__other__" ? customMake.trim() : selectedMake;
    const finalModel = selectedModel === "__other__" ? customModel.trim() : selectedModel;

    if (!finalMake) {
      alert("Wybierz lub wpisz markę pojazdu.");
      return;
    }
    if (!finalModel) {
      alert("Wybierz lub wpisz model pojazdu.");
      return;
    }
    if (!formData.price) {
      alert("Podaj cenę pojazdu.");
      return;
    }

    const payload = {
      ...formData,
      make: finalMake,
      model: finalModel,
    };

    startTransition(async () => {
      try {
        let res: { success: boolean; error?: string };
        if (initialData) {
          res = await updateCar(initialData.id, payload, tenantSlug);
        } else {
          res = await createCar(payload, tenantSlug);
        }

        if (res && !res.success) {
          alert(res.error || "Błąd podczas zapisywania.");
          return;
        }

        onSuccess();
      } catch (err: any) {
        alert(err.message || "Błąd podczas zapisywania.");
      }
    });
  };

  const handleDelete = () => {
    if (!initialData) return;
    if (confirm("Czy na pewno chcesz usunąć to auto? Ta akcja jest nieodwracalna.")) {
      startTransition(async () => {
        try {
          const res = await deleteCar(initialData.id, tenantSlug);
          if (res && !res.success) {
            alert(res.error || "Błąd podczas usuwania.");
            return;
          }
          onSuccess();
        } catch (err: any) {
          alert(err.message || "Błąd podczas usuwania.");
        }
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{initialData ? "Edytuj auto" : "Dodaj nowe auto"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Row 1: Marka & Model */}
        <div style={styles.row}>
          <label style={styles.label}>
            Marka *
            <select
              style={styles.select}
              value={selectedMake}
              onChange={handleMakeChange}
              required
            >
              <option value="">-- Wybierz markę --</option>
              {ALL_MAKES.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
              <option value="__other__">Inna (wpisz ręcznie)...</option>
            </select>
            {selectedMake === "__other__" && (
              <input
                style={{ ...styles.input, marginTop: "6px" }}
                placeholder="Wpisz markę (np. Chrysler, Dodge)"
                value={customMake}
                onChange={(e) => setCustomMake(e.target.value)}
                required
              />
            )}
          </label>

          <label style={styles.label}>
            Model *
            <select
              style={styles.select}
              value={selectedModel}
              onChange={handleModelChange}
              disabled={!selectedMake}
              required
            >
              <option value="">
                {!selectedMake ? "-- Najpierw wybierz markę --" : "-- Wybierz model --"}
              </option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
              <option value="__other__">Inny (wpisz ręcznie)...</option>
            </select>
            {(selectedModel === "__other__" || selectedMake === "__other__") && (
              <input
                style={{ ...styles.input, marginTop: "6px" }}
                placeholder="Wpisz model (np. Voyager)"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                required
              />
            )}
          </label>
        </div>

        {/* Row 2: Rok, Cena, Przebieg */}
        <div style={styles.row}>
          <label style={styles.label}>
            Rok produkcji
            <select
              style={styles.select}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            >
              <option value="">-- Wybierz rok --</option>
              {POPULAR_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Cena (PLN) *
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type="number"
                placeholder="np. 24500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <span style={styles.inputSuffix}>PLN</span>
            </div>
          </label>

          <label style={styles.label}>
            Przebieg (km)
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type="number"
                placeholder="np. 185000"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              />
              <span style={styles.inputSuffix}>km</span>
            </div>
          </label>
        </div>

        {/* Row 3: Paliwo, Pojemność, Skrzynia */}
        <div style={styles.row}>
          <label style={styles.label}>
            Paliwo
            <select
              style={styles.select}
              value={formData.fuel_type}
              onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
            >
              {FUEL_TYPES.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Poj. silnika
            <input
              style={styles.input}
              placeholder="np. 2.0 TDI lub 1.6"
              value={formData.engine_capacity}
              onChange={(e) => setFormData({ ...formData, engine_capacity: e.target.value })}
            />
          </label>

          <label style={styles.label}>
            Skrzynia biegów
            <select
              style={styles.select}
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
            >
              {TRANSMISSIONS.map((trans) => (
                <option key={trans} value={trans}>
                  {trans}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Row 4: Kolor */}
        <div style={styles.row}>
          <label style={{ ...styles.label, maxWidth: "300px" }}>
            Kolor nadwozia
            <select
              style={styles.select}
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            >
              {CAR_COLORS.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Opis */}
        <label style={styles.label}>
          Opis pojazdu
          <textarea
            style={{ ...styles.input, height: "110px", resize: "vertical" }}
            placeholder="Szczegóły stanu technicznego, wyposażenie (klimatyzacja, tempomat), stan opon, ważne opłaty..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </label>

        {/* Sekcja Uploadu Zdjęć */}
        <div style={styles.photoSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#f1f5f9" }}>
              Zdjęcia samochodu ({formData.images.length})
            </span>
            <button
              type="button"
              onClick={() => setShowManualUrlInput(!showManualUrlInput)}
              style={styles.btnTextToggle}
            >
              <LinkIcon style={{ width: "13px", height: "13px" }} />
              {showManualUrlInput ? "Ukryj wprowadzanie linków" : "Wklej linki URL ręcznie"}
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...styles.dropzone,
              ...(isUploading ? { opacity: 0.7, pointerEvents: "none" } : {}),
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {isUploading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Loader2 style={{ width: "28px", height: "28px", color: "#10b981", animation: "spin 1s linear infinite" }} />
                <span style={{ color: "#10b981", fontWeight: "600", fontSize: "14px" }}>
                  Wgrywanie zdjęć... ({uploadProgress?.current} z {uploadProgress?.total})
                </span>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Automatyczna kompresja i optymalizacja
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={styles.uploadIconBadge}>
                  <Upload style={{ width: "20px", height: "20px", color: "#10b981" }} />
                </div>
                <span style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "14px" }}>
                  Kliknij, aby dodać zdjęcia (lub przeciągnij pliki)
                </span>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Możesz wybrać kilka zdjęć naraz (JPG, PNG, WEBP). Pierwsze zdjęcie będzie zdjęciem głównym.
                </span>
              </div>
            )}
          </div>

          {/* Manual Link Input (Optional) */}
          {showManualUrlInput && (
            <div style={{ marginTop: "12px" }}>
              <label style={styles.label}>
                Linki do zdjęć (oddzielone przecinkami)
                <textarea
                  style={{ ...styles.input, height: "65px", fontSize: "12px" }}
                  placeholder="https://...jpg, https://...png"
                  value={manualUrls}
                  onChange={(e) => handleManualUrlsChange(e.target.value)}
                />
              </label>
            </div>
          )}

          {/* Gallery of Uploaded Photos */}
          {formData.images.length > 0 && (
            <div style={styles.galleryGrid}>
              {formData.images.map((url, idx) => (
                <div key={`${url}-${idx}`} style={styles.galleryItem}>
                  <div style={styles.imageWrapper}>
                    <img
                      src={url}
                      alt={`Zdjęcie ${idx + 1}`}
                      style={styles.galleryImg}
                    />
                  </div>

                  {idx === 0 ? (
                    <div style={styles.primaryBadge}>
                      <Star style={{ width: "11px", height: "11px", fill: "#f59e0b", color: "#f59e0b" }} />
                      Główne
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makePhotoPrimary(idx)}
                      style={styles.btnSetPrimary}
                      title="Ustaw jako zdjęcie główne"
                    >
                      Ustaw jako główne
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    style={styles.btnDeletePhoto}
                    title="Usuń zdjęcie"
                  >
                    <Trash2 style={{ width: "13px", height: "13px" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div style={styles.actions}>
          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending || isUploading}
              style={{
                ...styles.btnCancel,
                color: "#ef4444",
                borderColor: "rgba(239,68,68,0.3)",
                marginRight: "auto",
              }}
            >
              Usuń auto
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending || isUploading}
            style={styles.btnCancel}
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isPending || isUploading}
            style={styles.btnSubmit}
          >
            {isPending ? "Zapisywanie..." : initialData ? "Zapisz zmiany" : "Dodaj auto"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "rgba(30, 41, 59, 0.7)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "28px",
    backdropFilter: "blur(12px)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
    minWidth: "180px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
  },
  input: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.7)",
    color: "#f1f5f9",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  },
  select: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.8)",
    color: "#f1f5f9",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    cursor: "pointer",
  },
  inputSuffix: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    pointerEvents: "none",
  },
  photoSection: {
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    borderRadius: "12px",
    padding: "18px",
  },
  dropzone: {
    border: "2px dashed rgba(16, 185, 129, 0.35)",
    borderRadius: "12px",
    padding: "24px 16px",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(16, 185, 129, 0.04)",
    transition: "all 0.2s ease",
  },
  uploadIconBadge: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: "12px",
    marginTop: "16px",
  },
  galleryItem: {
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "#0f172a",
    aspectRatio: "4 / 3",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  galleryImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  primaryBadge: {
    position: "absolute",
    top: "6px",
    left: "6px",
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(245, 158, 11, 0.4)",
    color: "#f59e0b",
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  btnSetPrimary: {
    position: "absolute",
    bottom: "6px",
    left: "6px",
    right: "6px",
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    color: "#e2e8f0",
    fontSize: "10px",
    fontWeight: "600",
    padding: "3px 6px",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
  },
  btnDeletePhoto: {
    position: "absolute",
    top: "6px",
    right: "6px",
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    background: "rgba(239, 68, 68, 0.85)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnTextToggle: {
    background: "none",
    border: "none",
    color: "#38bdf8",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: 0,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(148, 163, 184, 0.15)",
  },
  btnSubmit: {
    padding: "11px 26px",
    borderRadius: "10px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
  },
  btnCancel: {
    padding: "11px 18px",
    borderRadius: "10px",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
};
