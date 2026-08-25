export const CONTAINER_TYPES = [
  {
    key: "standard",
    stocked: true,
    mode: "variable",
    label: { da: "Standardcontainere", en: "Standard Containers" },
    description: {
      da: "Den alsidige løsning til lager, byggeplads og sikker opbevaring.",
      en: "The versatile choice for warehousing, construction sites and secure storage.",
    },
  },
  {
    key: "high_cube",
    stocked: true,
    mode: "variable",
    label: { da: "High Cube-containere", en: "High Cube Containers" },
    description: {
      da: "Ekstra indvendig højde til høje emner, paller og bedre arbejdsplads.",
      en: "Extra internal height for tall cargo, pallets and improved working space.",
    },
  },
  {
    key: "open_side",
    stocked: true,
    mode: "variable",
    label: { da: "Open Side-containere", en: "Open Side Containers" },
    description: {
      da: "Fuld sideåbning giver hurtig adgang til hele containerens længde.",
      en: "Full side opening provides fast access along the entire container length.",
    },
  },
  {
    key: "storage",
    stocked: true,
    mode: "standalone",
    label: { da: "Opbevaringscontainere", en: "Storage Containers" },
    description: {
      da: "Sikre, tørre opbevaringsløsninger til virksomhed, byggeplads eller hjem.",
      en: "Secure, dry storage solutions for businesses, construction sites or homes.",
    },
  },
  {
    key: "office",
    stocked: true,
    mode: "standalone",
    label: { da: "Kontorcontainere", en: "Office Containers" },
    description: {
      da: "Fleksible, indrettede arbejdsrum til byggepladser og midlertidige behov.",
      en: "Flexible, fitted workspaces for construction sites and temporary needs.",
    },
  },
  {
    key: "conversions",
    stocked: false,
    mode: "service",
    label: { da: "Containerombygninger", en: "Container Conversions" },
    description: {
      da: "Skræddersyede døre, vinduer, indretning og finish til dit projekt.",
      en: "Tailored doors, windows, interiors and finishes for your project.",
    },
  },
  {
    key: "insulated",
    stocked: true,
    mode: "standalone",
    label: { da: "Isolerede containere", en: "Insulated Containers" },
    description: {
      da: "Bedre temperaturstyring og beskyttelse mod kondens og kulde.",
      en: "Improved temperature control and protection from condensation and cold.",
    },
  },
  {
    key: "tunnel",
    stocked: true,
    mode: "standalone",
    label: { da: "Tunnelcontainere", en: "Tunnel Containers" },
    description: {
      da: "Døre i begge ender giver effektiv gennemgang og fleksibel adgang.",
      en: "Doors at both ends provide efficient through-access and flexible loading.",
    },
  },
];

export const SPECIALTY_CONTAINER_TYPES = CONTAINER_TYPES.filter((type) => type.mode === "service");

export function specialtyQuoteKey(key) {
  return `specialty:${key}`;
}

export function containerTypeFromQuoteKey(productKey) {
  if (!productKey?.startsWith("specialty:")) return null;
  const key = productKey.slice("specialty:".length);
  return SPECIALTY_CONTAINER_TYPES.find((type) => type.key === key) || null;
}
