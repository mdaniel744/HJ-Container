// Local sample attribute vocabulary — stands in for the shared Supabase
// `attributes` / `attribute_values` tables when NEXT_PUBLIC_STORE_ID is
// unset. Mirrors the keys/values actually used in src/data/products.js.
// Only genuinely categorical attributes (few repeating values) get value
// rows — dimension/weight strings are free text with no predefined options,
// same as an operator would set up in the dashboard.
export const ATTRIBUTES = [
  { id: "attr-size", name_da: "Størrelse", name_en: "Size" },
  { id: "attr-condition", name_da: "Stand", name_en: "Condition" },
  { id: "attr-color", name_da: "Farve", name_en: "Colour" },
  { id: "attr-ext-dim", name_da: "Udvendige mål", name_en: "External dimensions" },
  { id: "attr-int-dim", name_da: "Indvendige mål", name_en: "Internal dimensions" },
  { id: "attr-tare", name_da: "Egenvægt (tara)", name_en: "Tare weight" },
  { id: "attr-payload", name_da: "Maks. nyttelast", name_en: "Maximum payload" },
  { id: "attr-volume", name_da: "Indvendigt rumfang", name_en: "Internal capacity" },
  { id: "attr-material", name_da: "Materiale", name_en: "Material" },
  { id: "attr-floor", name_da: "Gulv", name_en: "Floor" },
];

export const ATTRIBUTE_VALUES = [
  { id: "val-size-10", attribute_id: "attr-size", value_da: "10ft", value_en: "10ft" },
  { id: "val-size-20", attribute_id: "attr-size", value_da: "20ft", value_en: "20ft" },
  { id: "val-size-40", attribute_id: "attr-size", value_da: "40ft", value_en: "40ft" },
  { id: "val-cond-used", attribute_id: "attr-condition", value_da: "Brugt", value_en: "Used" },
  { id: "val-cond-new", attribute_id: "attr-condition", value_da: "Ny / One Trip", value_en: "New / One Trip" },
  { id: "val-color-green", attribute_id: "attr-color", value_da: "RAL 6005 (mørkegrøn)", value_en: "RAL 6005 (dark green)" },
  { id: "val-color-white", attribute_id: "attr-color", value_da: "RAL 9010 (hvid)", value_en: "RAL 9010 (white)" },
  { id: "val-color-grey", attribute_id: "attr-color", value_da: "RAL 7016 (antracitgrå)", value_en: "RAL 7016 (anthracite grey)" },
  { id: "val-material-corten", attribute_id: "attr-material", value_da: "Corten-stål", value_en: "Corten steel" },
  { id: "val-floor-plywood", attribute_id: "attr-floor", value_da: "Krydsfiner", value_en: "Plywood" },
];
