"use client";

import { useState, useEffect } from "react";
import { Car } from "@/types/database";
import { carFormSchema, type CarFormValues } from "../types";

export type TabType = "general" | "specs" | "photos";

const DEFAULT_VALUES: Partial<CarFormValues> = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: undefined,
  mileage: undefined,
  vin: "",
  fuel_type: "Benzyna",
  engine_capacity: "",
  transmission: "Manualna",
  color: "Czarny",
  description: "",
  images: [],
  export_to_autoplac: true,
};

export function useCarForm(initialData?: Car | null, isOpen?: boolean) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [customMake, setCustomMake] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CarFormValues, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [values, setValues] = useState<Partial<CarFormValues>>(DEFAULT_VALUES);

  useEffect(() => {
    if (initialData) {
      setValues({
        make: initialData.make || "",
        model: initialData.model || "",
        year: initialData.year || new Date().getFullYear(),
        price: initialData.price || 0,
        mileage: initialData.mileage || 0,
        vin: initialData.vin || "",
        fuel_type: (initialData.fuel_type as CarFormValues["fuel_type"]) || "Benzyna",
        engine_capacity: initialData.engine_capacity || "",
        transmission: (initialData.transmission as CarFormValues["transmission"]) || "Manualna",
        color: initialData.color || "Czarny",
        description: initialData.description || "",
        images: initialData.images || [],
        export_to_autoplac: initialData.export_to_autoplac ?? true,
      });
    } else {
      setValues(DEFAULT_VALUES);
    }
    setActiveTab("general");
    setFormErrors({});
    setGlobalError(null);
  }, [initialData, isOpen]);

  const handleChange = <K extends keyof CarFormValues>(field: K, val: CarFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    setGlobalError(null);
    setFormErrors({});
    const result = carFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CarFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CarFormValues;
        if (path) fieldErrors[path] = issue.message;
      });
      setFormErrors(fieldErrors);
      setGlobalError("Wypełnij poprawnie wszystkie wymagane pola formularza.");
      if (fieldErrors.make || fieldErrors.model || fieldErrors.year || fieldErrors.price || fieldErrors.mileage || fieldErrors.vin) {
        setActiveTab("general");
      } else if (fieldErrors.fuel_type || fieldErrors.transmission) {
        setActiveTab("specs");
      }
      return null;
    }
    return result.data;
  };

  return {
    values,
    activeTab,
    setActiveTab,
    customMake,
    setCustomMake,
    customModel,
    setCustomModel,
    formErrors,
    globalError,
    setGlobalError,
    handleChange,
    validate,
  };
}
