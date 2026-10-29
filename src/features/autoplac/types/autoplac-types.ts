import { z } from "zod";

export interface AutoplacVehicleNode {
  id: string;
  vin?: string | null;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: "PLN";
  mileage: number;
  fuelType: string;
  engineCapacity?: string | null;
  transmission: string;
  color?: string | null;
  description: string;
  photos: string[];
  firstRegistrationDate?: string | null;
}

export interface AutoplacFeedMetadata {
  generatedAt: string;
  dealerName: string;
  dealerCity: string;
  dealerPhone: string;
  vehiclesCount: number;
}

export const autoplacConfigSchema = z.object({
  feedToken: z.string().uuid("Nieprawidłowy token feedu"),
  isEnabled: z.boolean(),
  dealerName: z.string().min(1),
  dealerCity: z.string().default("Polska"),
  dealerPhone: z.string().default(""),
});

export type AutoplacConfig = z.infer<typeof autoplacConfigSchema>;
