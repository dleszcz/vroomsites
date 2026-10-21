// Popular car database for car select and autocomplete dropdowns
export const CAR_DATABASE: Record<string, string[]> = {
  Volkswagen: ["Golf", "Passat", "Polo", "Tiguan", "Touran", "Touareg", "Arteon", "Caddy", "Transporter", "T-Roc", "T-Cross", "Sharan", "Up!"],
  Audi: ["A3", "A4", "A6", "A5", "Q5", "Q7", "A8", "Q3", "TT", "A1", "A7", "Q8"],
  BMW: ["Seria 3", "Seria 5", "Seria 1", "X5", "Seria 4", "X3", "Seria 7", "X1", "Seria 2", "X6"],
  "Mercedes-Benz": ["Klasa C", "Klasa E", "Klasa A", "Sprinter", "Klasa S", "GLA", "GLC", "GLE", "CLA", "Vito", "W124"],
  Ford: ["Focus", "Mondeo", "Fiesta", "Kuga", "Transit", "C-Max", "S-Max", "Ranger", "EcoSport", "Galaxy"],
  Opel: ["Astra", "Corsa", "Insignia", "Zafira", "Meriva", "Mokka", "Vectra", "Vivaro", "Combo", "Adam"],
  Toyota: ["Yaris", "Corolla", "Avensis", "RAV4", "Auris", "C-HR", "Aygo", "Camry", "Hilux", "Prius", "Land Cruiser"],
  Skoda: ["Octavia", "Fabia", "Superb", "Kodiaq", "Kamiq", "Karoq", "Rapid", "Citigo", "Scala"],
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
  Dacia: ["Duster", "Sandero", "Logan", "Dokker", "Lodgy", "Jogger"],
  "Alfa Romeo": ["Giulietta", "159", "Stelvio", "Giulia", "147", "MiTo"],
  Suzuki: ["Vitara", "Swift", "SX4 S-Cross", "Grand Vitara", "Jimny"],
  Mitsubishi: ["Outlander", "Lancer", "ASX", "Pajero", "Colt", "Eclipse Cross"],
  Jeep: ["Grand Cherokee", "Cherokee", "Wrangler", "Renegade", "Compass"],
  Lexus: ["IS", "RX", "NX", "GS", "UX", "ES"],
  Porsche: ["Cayenne", "Macan", "Panamera", "911"],
  Mini: ["Cooper", "Countryman", "Clubman"],
};

export const ALL_MAKES = Object.keys(CAR_DATABASE);

export const FUEL_TYPES = [
  "Benzyna",
  "Diesel",
  "Benzyna+LPG",
  "Hybryda",
  "Elektryczny"
];

export const TRANSMISSIONS = [
  "Manualna",
  "Automatyczna"
];

export const CAR_COLORS = [
  "Czarny",
  "Srebrny",
  "Biały",
  "Szary / Grafitowy",
  "Niebieski",
  "Czerwony",
  "Zielony",
  "Brązowy",
  "Złoty",
  "Żółty",
  "Inny"
];

export const POPULAR_YEARS = Array.from({ length: 37 }, (_, i) => String(2026 - i));
