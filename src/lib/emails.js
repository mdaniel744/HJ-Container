import { base44 } from "@/api/base44Client";
import { COMPANY } from "@/lib/company";
import { formatDKK } from "@/lib/i18n";

const footer = (lang) => `
${COMPANY.name}
${COMPANY.street}, ${COMPANY.postcode} ${COMPANY.city}, ${lang === "en" ? COMPANY.country_en : COMPANY.country_da}
CVR ${COMPANY.cvr} · EUID ${COMPANY.euid}
${COMPANY.email}

${lang === "en"
    ? "Terms and Conditions, Shipping and Delivery, Returns and Refunds, Right of Withdrawal and Privacy Policy are available on our website."
    : "Handelsbetingelser, Levering og fragt, Returnering og tilbagebetaling, Fortrydelsesret og Privatlivspolitik findes på vores website."}
`;

/** Transactional templates. Returns {subject, body}. */
export const TEMPLATES = {
  order_received: (order, lang) => ({
    subject: lang === "en"
      ? `Order confirmation ${order.order_number} — HJ Container ApS`
      : `Ordrebekræftelse ${order.order_number} — HJ Container ApS`,
    body: `${lang === "en" ? "Thank you for your order" : "Tak for din ordre"}, ${order.full_name}.

${lang === "en" ? "Order number" : "Ordrenummer"}: ${order.order_number}

${order.items.map((i) => `${i.quantity} × ${i.title} (SKU ${i.sku}) — ${formatDKK(i.unit_price_incl_vat * i.quantity, lang)}`).join("\n")}

${lang === "en" ? "Subtotal excl. VAT" : "Subtotal ekskl. moms"}: ${formatDKK(order.subtotal_excl_vat, lang)}
${lang === "en" ? "VAT" : "Moms"}: ${formatDKK(order.vat_amount, lang)}
${lang === "en" ? "Delivery" : "Levering"}: ${formatDKK(order.delivery_cost, lang)}
${lang === "en" ? "Unloading" : "Aflæsning"}: ${formatDKK(order.unloading_cost, lang)}
${lang === "en" ? "Total incl. VAT" : "Total inkl. moms"}: ${formatDKK(order.total_incl_vat, lang)}

${lang === "en" ? "Delivery address" : "Leveringsadresse"}: ${order.delivery_address}, ${order.postcode} ${order.city}
${lang === "en" ? "Unloading method" : "Aflæsningsmetode"}: ${order.unloading_method || "-"}
${lang === "en" ? "Payment method" : "Betalingsmetode"}: ${order.payment_method === "invoice" ? (lang === "en" ? "Invoice" : "Faktura") : (lang === "en" ? "Bank transfer" : "Bankoverførsel")}

${lang === "en"
      ? "We will review the order and contact you with payment instructions and delivery planning."
      : "Vi gennemgår ordren og kontakter dig med betalingsoplysninger og leveringsplanlægning."}
${footer(lang)}`,
  }),
  quote_received: (quote, lang) => ({
    subject: lang === "en"
      ? `Quote request ${quote.request_number} received — HJ Container ApS`
      : `Tilbudsforespørgsel ${quote.request_number} modtaget — HJ Container ApS`,
    body: `${lang === "en" ? "Thank you for your request" : "Tak for din forespørgsel"}, ${quote.full_name}.

${lang === "en" ? "Request number" : "Forespørgselsnummer"}: ${quote.request_number}

${(quote.lines || []).map((l) => `${l.quantity} × ${l.title} — ${l.size}, ${l.condition}${l.color ? `, ${l.color}` : ""}`).join("\n")}

${lang === "en" ? "Delivery location" : "Leveringssted"}: ${quote.address || ""}, ${quote.postcode || ""} ${quote.city || ""}
${lang === "en" ? "Unloading" : "Aflæsning"}: ${quote.unloading_method || "-"}
${lang === "en" ? "Desired period" : "Ønsket periode"}: ${quote.delivery_period || "-"}

${lang === "en"
      ? "This request is non-binding and is not a completed purchase. We will return with a tailored offer."
      : "Forespørgslen er ikke bindende og er ikke et gennemført køb. Vi vender tilbage med et tilbud."}
${footer(lang)}`,
  }),
  contact_received: (msg, lang) => ({
    subject: lang === "en" ? "We have received your message — HJ Container ApS" : "Vi har modtaget din besked — HJ Container ApS",
    body: `${lang === "en" ? "Thank you for contacting us" : "Tak for din henvendelse"}, ${msg.name}.

${lang === "en" ? "Your message" : "Din besked"}:
${msg.message}

${lang === "en" ? "We will reply by email as soon as possible." : "Vi svarer pr. e-mail hurtigst muligt."}
${footer(lang)}`,
  }),
};

/**
 * Sends a transactional email. Delivery only succeeds for addresses
 * registered in the app; failures are logged and never block the flow.
 */
export async function sendTransactional(to, subject, body) {
  try {
    await base44.integrations.Core.SendEmail({ to, subject, body, from_name: COMPANY.name });
    return true;
  } catch (e) {
    console.warn("Transactional email not delivered:", e?.message);
    return false;
  }
}