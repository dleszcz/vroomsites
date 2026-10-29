import { z } from "zod";
import { Car } from "@/types/database";

export const carFormSchema = z.object({
  make: z.string().min(1, "Wybierz lub wpisz markę pojazdu"),
  model: z.string().min(1, "Wybierz lub wpisz model pojazdu"),
  year: z.number().int().min(1950, "Rocznik nie może być wcześniejszy niż 1950").max(new Date().getFullYear() + 1, "Niepoprawny rocznik"),
  price: z.number().positive("Cena musi być większa od 0"),
  mileage: z.number().nonnegative("Przebieg nie może być ujemny"),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Numer VIN musi składać się z 17 znaków (bez I, O, Q)")
    .optional()
    .nullable()
    .or(z.literal("")),
  fuel_type: z.enum(["Benzyna", "Diesel", "Benzyna+LPG", "Hybryda", "Elektryczny"]),
  engine_capacity: z.string().optional().nullable(),
  transmission: z.enum(["Manualna", "Automatyczna"]),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  images: z.array(z.string().url()).default([]),
  export_to_autoplac: z.boolean().default(true),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export type FilterStatus = "all" | "available" | "featured" | "sold";

export interface CarsManagerContainerProps {
  initialCars: Car[];
  tenantSlug: string;
  tenantName: string;
  siteUrl?: string;
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
