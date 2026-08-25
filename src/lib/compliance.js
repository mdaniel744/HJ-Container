// Commercial values that must be approved by HJ Container before release.
// Keep these null until the business has supplied a documented value; the
// admin launch checklist treats every null value as a release blocker.
export const DENMARK_HANDLING_TIME_BUSINESS_DAYS = null;
export const DENMARK_TRANSIT_TIME_BUSINESS_DAYS = null;
export const CONSUMER_RETURN_TRANSPORT_MAX_DKK = null;
export const PAYMENT_DEADLINE_DAYS = null;

export const MERCHANT_TARGET_COUNTRY = "DK";
export const MERCHANT_SHIPPING_LABEL = "DK-CONTAINER";
export const MERCHANT_RETURN_POLICY_LABEL = "HJC-DK-RETUR";

const BLOCKER_DEFINITIONS = [
  {
    key: "handling_time",
    label: "Approve a realistic handling-time range in business days for Danish orders.",
  },
  {
    key: "transit_time",
    label: "Approve a realistic Danish transit-time range in business days.",
  },
  {
    key: "return_transport",
    label: "Approve a real or reasonable maximum DKK estimate for consumer return transport of a container.",
  },
  {
    key: "payment_deadline",
    label: "Approve the invoice/bank-transfer payment deadline in calendar days.",
  },
];

const positiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const configuredRange = (min, max, fallback) => {
  const fallbackMin = Array.isArray(fallback) ? positiveNumber(fallback[0]) : positiveNumber(fallback);
  const fallbackMax = Array.isArray(fallback) ? positiveNumber(fallback[1]) : fallbackMin;
  const resolvedMin = positiveNumber(min) || fallbackMin;
  const resolvedMax = positiveNumber(max) || fallbackMax;
  return resolvedMin && resolvedMax && resolvedMax >= resolvedMin ? [resolvedMin, resolvedMax] : null;
};

export function resolveCompliance(settings = {}) {
  return {
    handlingTime: configuredRange(
      settings.denmark_handling_min_business_days,
      settings.denmark_handling_max_business_days,
      DENMARK_HANDLING_TIME_BUSINESS_DAYS
    ),
    transitTime: configuredRange(
      settings.denmark_transit_min_business_days,
      settings.denmark_transit_max_business_days,
      DENMARK_TRANSIT_TIME_BUSINESS_DAYS
    ),
    returnTransportMaxDkk: positiveNumber(settings.consumer_return_transport_max_dkk) || positiveNumber(CONSUMER_RETURN_TRANSPORT_MAX_DKK),
    paymentDeadlineDays: positiveNumber(settings.payment_deadline_days) || positiveNumber(PAYMENT_DEADLINE_DAYS),
  };
}

export function getComplianceBlockers(settings = {}) {
  const values = resolveCompliance(settings);
  const missing = {
    handling_time: !values.handlingTime,
    transit_time: !values.transitTime,
    return_transport: !values.returnTransportMaxDkk,
    payment_deadline: !values.paymentDeadlineDays,
  };
  return BLOCKER_DEFINITIONS.filter((item) => missing[item.key]);
}

export const COMPLIANCE_BLOCKERS = getComplianceBlockers();

const rangeText = ([min, max], lang) => min === max
  ? `${min} ${lang === "en" ? "business days" : "hverdage"}`
  : `${min}–${max} ${lang === "en" ? "business days" : "hverdage"}`;

export function deliveryEstimateText(settings, lang) {
  const { handlingTime, transitTime } = resolveCompliance(settings);
  if (!handlingTime || !transitTime) {
    return lang === "en"
      ? "The specific delivery plan is confirmed in writing after order review"
      : "Den konkrete leveringsplan bekræftes skriftligt efter ordregennemgang";
  }
  return lang === "en"
    ? `Handling ${rangeText(handlingTime, lang)} + transit ${rangeText(transitTime, lang)}`
    : `Håndtering ${rangeText(handlingTime, lang)} + transport ${rangeText(transitTime, lang)}`;
}

export function paymentDeadlineText(settings, lang) {
  const { paymentDeadlineDays } = resolveCompliance(settings);
  if (!paymentDeadlineDays) return lang === "en" ? "The deadline is stated on the invoice" : "Fristen står på fakturaen";
  return lang === "en" ? `Payment deadline: ${paymentDeadlineDays} calendar days` : `Betalingsfrist: ${paymentDeadlineDays} kalenderdage`;
}
