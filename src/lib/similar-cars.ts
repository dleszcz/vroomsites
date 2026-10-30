import { Car } from "@/types/database";
import {
  detectVehicleSegment,
  getSegmentCompatibility,
  VehicleSegment,
} from "./automotive-segments";

/**
 * Minimalny próg punktowy, aby samochód został uznany za "podobny".
 * Jeśli żaden samochód nie osiągnie tego progu (np. w małej flocie mamy tylko vana i małe auto miejskie),
 * funkcja zwraca pustą tablicę, a sekcja w ogóle się nie wyświetla.
 */
export const MIN_SIMILARITY_SCORE = 30;

const AUTOMOTIVE_GROUPS: string[][] = [
  ["volkswagen", "vw", "audi", "skoda", "seat", "cupra", "porsche"],
  ["peugeot", "citroen", "opel", "fiat", "alfa romeo", "jeep", "ds", "lancia"],
  ["renault", "nissan", "dacia", "mitsubishi"],
  ["hyundai", "kia"],
  ["bmw", "mini"],
  ["toyota", "lexus"],
  ["ford"],
  ["mercedes-benz", "mercedes", "smart"],
  ["volvo"],
  ["mazda"],
  ["honda"],
  ["subaru"],
];

function areMakesInSameGroup(makeA: string, makeB: string): boolean {
  const a = makeA.trim().toLowerCase();
  const b = makeB.trim().toLowerCase();
  if (a === b) return true;

  return AUTOMOTIVE_GROUPS.some((group) => group.includes(a) && group.includes(b));
}

export interface SimilarityBreakdown {
  segment: number;
  price: number;
  year: number;
  make: number;
  fuel: number;
  transmission: number;
  total: number;
}

/**
 * Oblicza stopień podobieństwa w skali 0 - 100 pkt
 */
export function calculateCarSimilarity(
  target: Car,
  candidate: Car
): { score: number; breakdown: SimilarityBreakdown } {
  // 1. Segment i typ nadwozia (Waga: 35 pkt)
  const targetSegment: VehicleSegment = detectVehicleSegment(
    target.make,
    target.model,
    target.description
  );
  const candidateSegment: VehicleSegment = detectVehicleSegment(
    candidate.make,
    candidate.model,
    candidate.description
  );
  const segmentCompat = getSegmentCompatibility(targetSegment, candidateSegment);
  const segmentScore = Math.round(segmentCompat * 35);

  // 2. Przedział cenowy (Waga: 25 pkt)
  let priceScore = 0;
  if (
    typeof target.price === "number" &&
    typeof candidate.price === "number" &&
    target.price > 0 &&
    candidate.price > 0
  ) {
    const maxPrice = Math.max(target.price, candidate.price);
    const diffRatio = Math.abs(target.price - candidate.price) / maxPrice;
    // Różnica <= 10% daje ~20-25 pkt, różnica 25% daje ~12 pkt, różnica >= 50% daje 0 pkt
    priceScore = Math.max(0, Math.round(25 * (1 - diffRatio * 2)));
  }

  // 3. Rocznik pojazdu (Waga: 20 pkt)
  let yearScore = 0;
  if (
    typeof target.year === "number" &&
    typeof candidate.year === "number" &&
    target.year > 1980 &&
    candidate.year > 1980
  ) {
    const yearDiff = Math.abs(target.year - candidate.year);
    if (yearDiff === 0) yearScore = 20;
    else if (yearDiff === 1) yearScore = 18;
    else if (yearDiff === 2) yearScore = 15;
    else if (yearDiff === 3) yearScore = 12;
    else if (yearDiff === 4) yearScore = 8;
    else if (yearDiff === 5) yearScore = 4;
    else yearScore = 0;
  }

  // 4. Marka i koncern (Waga: 10 pkt)
  let makeScore = 0;
  const targetMake = (target.make || "").trim().toLowerCase();
  const candidateMake = (candidate.make || "").trim().toLowerCase();
  if (targetMake && candidateMake) {
    if (targetMake === candidateMake) {
      makeScore = 10;
    } else if (areMakesInSameGroup(targetMake, candidateMake)) {
      makeScore = 5;
    }
  }

  // 5. Paliwo (Waga: 5 pkt)
  let fuelScore = 0;
  if (target.fuel_type && candidate.fuel_type) {
    const tFuel = target.fuel_type.trim().toLowerCase();
    const cFuel = candidate.fuel_type.trim().toLowerCase();
    if (
      tFuel === cFuel ||
      (tFuel.includes("diesel") && cFuel.includes("diesel")) ||
      (tFuel.includes("benzy") && cFuel.includes("benzy")) ||
      (tFuel.includes("hybr") && cFuel.includes("hybr")) ||
      (tFuel.includes("elektr") && cFuel.includes("elektr"))
    ) {
      fuelScore = 5;
    }
  }

  // 6. Skrzynia biegów (Waga: 5 pkt)
  let transmissionScore = 0;
  if (target.transmission && candidate.transmission) {
    const tTrans = target.transmission.trim().toLowerCase();
    const cTrans = candidate.transmission.trim().toLowerCase();
    if (
      tTrans === cTrans ||
      (tTrans.includes("auto") && cTrans.includes("auto")) ||
      (tTrans.includes("manua") && cTrans.includes("manua"))
    ) {
      transmissionScore = 5;
    }
  }

  const total = segmentScore + priceScore + yearScore + makeScore + fuelScore + transmissionScore;

  return {
    score: total,
    breakdown: {
      segment: segmentScore,
      price: priceScore,
      year: yearScore,
      make: makeScore,
      fuel: fuelScore,
      transmission: transmissionScore,
      total,
    },
  };
}

/**
 * Zwraca listę najbardziej podobnych samochodów z oferty komisu.
 * Jeśli żadne auto nie przekroczy minimalnego progu (MIN_SIMILARITY_SCORE = 30),
 * zwraca pustą tablicę `[]`, co powoduje całkowite ukrycie sekcji w interfejsie.
 */
export function getSimilarCars(
  targetCar: Car,
  allCars: Car[],
  limit = 3,
  minScore = MIN_SIMILARITY_SCORE
): Car[] {
  if (!targetCar || !allCars || allCars.length === 0) {
    return [];
  }

  const scoredCars = allCars
    .filter((c) => {
      // Wykluczamy to samo auto oraz auta sprzedane
      if (!c || !c.id) return false;
      if (String(c.id) === String(targetCar.id)) return false;
      if (c.slug && targetCar.slug && c.slug === targetCar.slug) return false;
      if (c.is_sold) return false;
      return true;
    })
    .map((candidate) => {
      const { score, breakdown } = calculateCarSimilarity(targetCar, candidate);
      return { car: candidate, score, breakdown };
    })
    // Odrzucamy kandydatów, którzy nie osiągnęli minimalnego progu podobieństwa
    .filter((entry) => entry.score >= minScore)
    // Sortujemy malejąco według wyniku punktowego
    .sort((a, b) => b.score - a.score);

  return scoredCars.slice(0, limit).map((entry) => entry.car);
}
