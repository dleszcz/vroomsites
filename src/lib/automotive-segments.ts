/**
 * Słownik segmentów pojazdów oraz heurystyki klasyfikacji wielkości / typu nadwozia
 */

export type VehicleSegment =
  | "suv"
  | "estate"
  | "sedan"
  | "compact"
  | "city"
  | "minivan"
  | "coupe"
  | "van"
  | "other";

const ESTATE_KEYWORDS = [
  "kombi",
  "combi",
  "avant",
  "touring",
  "variant",
  "sw",
  "sportback",
  "estate",
  "station wagon",
  "sport tourer",
  "shooting brake",
];

const SUV_KEYWORDS = [
  "suv",
  "crossover",
  "4x4",
  "allroad",
  "cross",
  "tiguan",
  "rav4",
  "qashqai",
  "sportage",
  "tucson",
  "duster",
  "kuga",
  "x1",
  "x2",
  "x3",
  "x4",
  "x5",
  "x6",
  "x7",
  "q2",
  "q3",
  "q5",
  "q7",
  "q8",
  "glc",
  "gle",
  "gla",
  "glb",
  "glk",
  "cr-v",
  "hr-v",
  "cx-3",
  "cx-5",
  "cx-30",
  "cx-60",
  "captur",
  "kadjar",
  "koleos",
  "grandland",
  "crossland",
  "mokka",
  "frontera",
  "yeti",
  "karoq",
  "kodiaq",
  "kamiq",
  "ateca",
  "arona",
  "tarraco",
  "outlander",
  "asx",
  "vitara",
  "s-cross",
  "compass",
  "renegade",
  "cherokee",
  "t-roc",
  "t-cross",
  "taigo",
  "touareg",
  "stonic",
  "niro",
  "kona",
  "santa fe",
  "2008",
  "3008",
  "5008",
  "c3 aircross",
  "c5 aircross",
  "xc40",
  "xc60",
  "xc90",
  "forester",
  "xv",
  "outback",
];

const VAN_KEYWORDS = [
  "dostawczy",
  "blaszak",
  "transporter",
  "trafic",
  "vivaro",
  "transit",
  "custom",
  "boxer",
  "jumper",
  "ducato",
  "master",
  "crafter",
  "sprinter",
  "movano",
  "caddy",
  "berlingo",
  "partner",
  "combo",
  "kangoo",
  "doblo",
  "vito",
  "viano",
  "expert",
  "scudo",
];

const MINIVAN_KEYWORDS = [
  "minivan",
  "mpv",
  "touran",
  "zafira",
  "scenic",
  "grand scenic",
  "sharan",
  "altea",
  "altea xl",
  "c-max",
  "s-max",
  "galaxy",
  "carens",
  "picasso",
  "verso",
  "meriva",
  "b-max",
  "espace",
  "alhambra",
  "voyager",
  "carnival",
  "multipla",
  "ix20",
  "venga",
];

const CITY_KEYWORDS = [
  "yaris",
  "corsa",
  "polo",
  "fiesta",
  "clio",
  "fabia",
  "ibiza",
  "208",
  "207",
  "206",
  "c3",
  "micra",
  "swift",
  "i20",
  "rio",
  "panda",
  "500",
  "aygo",
  "up!",
  "up",
  "citigo",
  "mii",
  "i10",
  "picanto",
  "twingo",
  "adam",
  "ka",
  "punto",
  "grande punto",
  "colt",
  "space star",
  "ignis",
  "alto",
  "agila",
  "splash",
  "matiz",
  "spark",
];

const COMPACT_KEYWORDS = [
  "golf",
  "focus",
  "astra",
  "megane",
  "leon",
  "i30",
  "ceed",
  "c-eed",
  "c30",
  "v40",
  "corolla",
  "auris",
  "civic",
  "mazda 3",
  "308",
  "307",
  "c4",
  "octavia",
  "tipo",
  "scala",
  "seria 1",
  "116",
  "118",
  "120",
  "klasa a",
  "a-klasa",
  "a3",
  "bravo",
  "stilo",
  "giulietta",
  "impreza",
  "ct200h",
];

const SEDAN_KEYWORDS = [
  "sedan",
  "limuzyna",
  "saloon",
  "berlina",
  "passat",
  "mondeo",
  "insignia",
  "superb",
  "avensis",
  "mazda 6",
  "talisman",
  "laguna",
  "vectra",
  "seria 3",
  "seria 5",
  "seria 7",
  "318",
  "320",
  "325",
  "330",
  "520",
  "525",
  "530",
  "klasa c",
  "c-klasa",
  "klasa e",
  "e-klasa",
  "klasa s",
  "s-klasa",
  "a4",
  "a6",
  "a8",
  "accord",
  "camry",
  "optima",
  "sonata",
  "i40",
  "508",
  "407",
  "c5",
  "s60",
  "s80",
  "s90",
  "is200",
  "is250",
  "is300",
];

const COUPE_KEYWORDS = [
  "coupe",
  "cabrio",
  "cabriolet",
  "roadster",
  "spider",
  "spyder",
  "tt",
  "mustang",
  "mx-5",
  "seria 2",
  "seria 4",
  "seria 8",
  "slk",
  "slc",
  "sl",
  "z3",
  "z4",
  "gt86",
  "brz",
  "rcz",
  "350z",
  "370z",
];

/**
 * Automatycznie wykrywa segment i typ nadwozia na podstawie modelu, marki oraz opisu
 */
export function detectVehicleSegment(
  make: string | null | undefined,
  model: string | null | undefined,
  description?: string | null
): VehicleSegment {
  const combined = `${make || ""} ${model || ""} ${description || ""}`.toLowerCase();

  // 1. Sprawdzamy specyficzne słowa kluczowe kombi (często w Audi A4 Avant, BMW Touring)
  if (ESTATE_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "estate";
  }

  // 2. SUV-y i crossovery
  if (SUV_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "suv";
  }

  // 3. Vany dostawcze i busy
  if (VAN_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "van";
  }

  // 4. Minivany / MPV
  if (MINIVAN_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "minivan";
  }

  // 5. Coupe & Cabrio
  if (COUPE_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "coupe";
  }

  // 6. Małe auta miejskie (segment A i B)
  if (CITY_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "city";
  }

  // 7. Kompakty (segment C)
  if (COMPACT_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "compact";
  }

  // 8. Sedany i limuzyny (segment D i E)
  if (SEDAN_KEYWORDS.some((kw) => combined.includes(kw))) {
    return "sedan";
  }

  return "other";
}

/**
 * Zwraca stopień pokrewieństwa dwóch segmentów (1.0 = identyczny, 0.5 = bliski, 0 = całkowicie odmienny)
 */
export function getSegmentCompatibility(seg1: VehicleSegment, seg2: VehicleSegment): number {
  if (seg1 === seg2 && seg1 !== "other") {
    return 1.0;
  }

  // Pokrewne segmenty:
  // Sedan <-> Kombi (to samo podwozie i klasa auta)
  if ((seg1 === "sedan" && seg2 === "estate") || (seg1 === "estate" && seg2 === "sedan")) {
    return 0.6;
  }

  // Kombi <-> SUV (rodzinne i pakowne)
  if ((seg1 === "estate" && seg2 === "suv") || (seg1 === "suv" && seg2 === "estate")) {
    return 0.5;
  }

  // Sedan <-> SUV (auta wyższych segmentów D/E)
  if ((seg1 === "sedan" && seg2 === "suv") || (seg1 === "suv" && seg2 === "sedan")) {
    return 0.4;
  }

  // Kompakt <-> Miejskie (zwrotne hatchbacki)
  if ((seg1 === "compact" && seg2 === "city") || (seg1 === "city" && seg2 === "compact")) {
    return 0.5;
  }

  // Kompakt <-> SUV (np. Golf vs T-Roc, Focus vs Kuga)
  if ((seg1 === "compact" && seg2 === "suv") || (seg1 === "suv" && seg2 === "compact")) {
    return 0.4;
  }

  // Minivan <-> Kombi (rodzinne, 5-7 miejsc)
  if ((seg1 === "minivan" && seg2 === "estate") || (seg1 === "estate" && seg2 === "minivan")) {
    return 0.5;
  }

  // Minivan <-> Van (duża przestrzeń ładunkowa)
  if ((seg1 === "minivan" && seg2 === "van") || (seg1 === "van" && seg2 === "minivan")) {
    return 0.4;
  }

  return 0.0;
}
