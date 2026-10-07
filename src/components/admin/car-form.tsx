"use client";

import React, { useState, useTransition } from "react";
import { createCar, updateCar, deleteCar } from "@/app/[dealerSlug]/admin/actions";
import { Car } from "@/types/database";

interface CarFormProps {
  tenantSlug: string;
  initialData?: Car | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CarForm({ tenantSlug, initialData, onSuccess, onCancel }: CarFormProps) {
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year?.toString() || "",
    price: initialData?.price?.toString() || "",
    mileage: initialData?.mileage?.toString() || "",
    fuel_type: initialData?.fuel_type || "",
    engine_capacity: initialData?.engine_capacity || "",
    transmission: initialData?.transmission || "",
    color: initialData?.color || "",
    description: initialData?.description || "",
    images: initialData?.images || ([] as string[])
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (initialData) {
          await updateCar(initialData.id, formData, tenantSlug);
        } else {
          await createCar(formData, tenantSlug);
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
          await deleteCar(initialData.id, tenantSlug);
          onSuccess();
        } catch (err: any) {
          alert(err.message || "Błąd podczas usuwania.");
        }
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{initialData ? "Edytuj auto" : "Dodaj nowe auto (Ręcznie)"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <label style={styles.label}>
            Marka
            <input style={styles.input} value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} required />
          </label>
          <label style={styles.label}>
            Model
            <input style={styles.input} value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            Rok produkcji
            <input style={styles.input} type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </label>
          <label style={styles.label}>
            Cena (PLN)
            <input style={styles.input} type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
          </label>
          <label style={styles.label}>
            Przebieg (km)
            <input style={styles.input} type="number" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            Paliwo
            <input style={styles.input} value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})} />
          </label>
          <label style={styles.label}>
            Poj. silnika
            <input style={styles.input} value={formData.engine_capacity} onChange={e => setFormData({...formData, engine_capacity: e.target.value})} />
          </label>
          <label style={styles.label}>
            Skrzynia
            <input style={styles.input} value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            Kolor
            <input style={styles.input} value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
          </label>
        </div>

        <label style={styles.label}>
          Opis
          <textarea style={{...styles.input, height: "120px"}} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </label>

        <label style={styles.label}>
          Zdjęcia (linki url po przecinku)
          <textarea 
            style={{...styles.input, height: "60px"}} 
            value={formData.images.join(", ")} 
            onChange={e => setFormData({...formData, images: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} 
          />
        </label>

        <div style={styles.actions}>
          {initialData && (
            <button type="button" onClick={handleDelete} disabled={isPending} style={{...styles.btnCancel, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", marginRight: "auto"}}>
              Usuń auto
            </button>
          )}
          <button type="button" onClick={onCancel} style={styles.btnCancel}>Anuluj</button>
          <button type="submit" disabled={isPending} style={styles.btnSubmit}>
            {isPending ? "Zapisywanie..." : initialData ? "Zapisz zmiany" : "Dodaj auto"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: "20px",
  },
  importSection: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
    minWidth: "150px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#f1f5f9",
    fontSize: "14px",
    width: "100%",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  btnSecondary: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnSubmit: {
    padding: "10px 24px",
    borderRadius: "8px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  },
  btnCancel: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    fontWeight: "600",
    cursor: "pointer",
  },
};
