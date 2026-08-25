// Transparent, rule-based delivery estimation.
// Returns { calculable: false, reason } when no reliable price can be produced.
const ZONES = [
  { name: "Midtjylland", prefixes: ["80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "74", "76"], fee: 2200 },
  { name: "Syddanmark", prefixes: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73"], fee: 2900 },
  { name: "Nordjylland", prefixes: ["90", "91", "92", "93", "94", "95", "96", "97", "98", "99"], fee: 3200 },
  { name: "Sjælland og Bornholm", prefixes: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49"], fee: 4200 },
];

const SIZE_FACTOR = { "10ft": 1, "20ft": 1.15, "40ft": 1.6 };
const MAX_BASE_DELIVERY_FEE = Math.max(...ZONES.map((zone) => zone.fee));
const CRANE_TRUCK_FEE = 1500;

export const UNLOADING_OPTIONS = [
  { value: "crane_truck", da: "Kranbil", en: "Crane truck", fee: CRANE_TRUCK_FEE },
  { value: "customer_crane", da: "Kran stillet af kunden", en: "Customer-provided crane", fee: 0 },
  { value: "customer_forklift", da: "Truck stillet af kunden", en: "Customer-provided forklift", fee: 0 },
  { value: "none", da: "Ingen aflæsning nødvendig", en: "No unloading required", fee: 0 },
  { value: "unsure", da: "Usikker", en: "Unsure", fee: null },
];

const DENMARK_NAMES = new Set(["dk", "danmark", "denmark"]);

export function estimateDelivery({ country, postcode, size, quantity, unloading, siteAccess }) {
  const normalizedCountry = String(country || "").trim().toLowerCase();
  if (!normalizedCountry) {
    return { calculable: false, reason: "country" };
  }
  if (!DENMARK_NAMES.has(normalizedCountry)) {
    return { calculable: false, reason: "outside_dk" };
  }
  const pc = (postcode || "").replace(/\D/g, "");
  if (pc.length !== 4) return { calculable: false, reason: "postcode" };
  const zone = ZONES.find((z) => z.prefixes.includes(pc.slice(0, 2)));
  if (!zone) return { calculable: false, reason: "zone" };
  if (unloading === "unsure" || !unloading) return { calculable: false, reason: "unloading" };
  if (siteAccess && siteAccess.truck_access === "no") return { calculable: false, reason: "access" };
  if (siteAccess && siteAccess.ground === "no") return { calculable: false, reason: "ground" };
  if (quantity > 2) return { calculable: false, reason: "quantity" };

  const opt = UNLOADING_OPTIONS.find((o) => o.value === unloading);
  const transport = Math.round(zone.fee * (SIZE_FACTOR[size] || 1) * quantity);
  const unloadingCost = (opt?.fee || 0) * quantity;
  return {
    calculable: true,
    zone: zone.name,
    delivery_cost: transport,
    unloading_cost: unloadingCost,
    total: transport + unloadingCost,
  };
}

export const DELIVERY_REASON = {
  country: { da: "Indtast dit leveringsland.", en: "Enter your delivery country." },
  outside_dk: { da: "HJ Container leverer kun til adresser i Danmark.", en: "HJ Container delivers only to addresses in Denmark." },
  postcode: { da: "Indtast et gyldigt dansk postnummer på 4 cifre.", en: "Enter a valid 4-digit Danish postcode." },
  zone: { da: "Vi har ingen fast fragtsats for dette postnummer endnu.", en: "We have no fixed shipping rate for this postcode yet." },
  unloading: { da: "Vælg en aflæsningsmetode, så fragten kan beregnes.", en: "Select an unloading method so shipping can be calculated." },
  access: { da: "Begrænset adgang for lastbil kræver manuel transportplanlægning.", en: "Restricted truck access requires manual transport planning." },
  ground: { da: "Underlaget skal vurderes manuelt før transport kan prissættes.", en: "The ground conditions must be assessed manually before pricing transport." },
  quantity: { da: "Ved tre eller flere containere planlægger vi transporten individuelt.", en: "For three or more containers we plan transport individually." },
};

// Google accepts a close overestimate when destination-specific pricing cannot
// be mirrored. This is the highest one-container checkout charge in Denmark,
// including crane-truck unloading, for the selected size.
export function maximumSingleContainerDeliveryCost(size) {
  return Math.round(MAX_BASE_DELIVERY_FEE * (SIZE_FACTOR[size] || 1) + CRANE_TRUCK_FEE);
}
