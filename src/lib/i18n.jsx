import { useLocation } from "react-router-dom";

export function useLang() {
  const { pathname } = useLocation();
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "da";
}

// Pick a localized value from an object with _da / _en suffixed fields
export function pick(obj, field, lang) {
  if (!obj) return "";
  return obj[`${field}_${lang}`] || obj[`${field}_da`] || "";
}

export function L(lang, da, en) {
  return lang === "en" ? en : da;
}

export function formatDKK(value, lang = "da", withCurrency = true) {
  if (value === undefined || value === null || value === "") return "";
  const n = new Intl.NumberFormat(lang === "en" ? "en-DK" : "da-DK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return withCurrency ? `${n} DKK` : n;
}

export function formatDate(value, lang = "da") {
  if (!value) return "";
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export const AVAILABILITY_LABEL = {
  in_stock: { da: "På lager", en: "In stock" },
  out_of_stock: { da: "Ikke på lager", en: "Out of stock" },
  on_request: { da: "På forespørgsel", en: "On request" },
  backorder: { da: "Restordre", en: "Backorder" },
};

export const CONDITION_LABEL = {
  new: { da: "Ny / One Trip", en: "New / One Trip" },
  used: { da: "Brugt", en: "Used" },
};