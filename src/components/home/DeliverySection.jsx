import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { MEDIA } from "@/lib/media";

export default function DeliverySection({ lang, deliveryPolicySlug }) {
  const factors = lang === "en"
    ? ["Delivery postcode", "Number of containers", "Container dimensions", "Vehicle access", "Unloading method", "Ground conditions"]
    : ["Leveringspostnummer", "Antal containere", "Containerens mål", "Adgang for lastbil", "Aflæsningsmetode", "Underlagets bæreevne"];

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 grid gap-12 lg:grid-cols-2 items-center">
      <div className="border border-slate-200 overflow-hidden">
        <Image src={MEDIA.crane} alt={L(lang, "Kranbil løfter en container på plads på et leveringssted", "Crane truck lifting a container into place at a delivery site")} className="w-full aspect-[16/10]" />
      </div>
      <div>
        <p className="hjc-section-tag">{L(lang, "Levering", "Delivery")}</p>
        <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Levering og aflæsning", "Delivery and unloading")}</h2>
        <p className="mt-4 text-slate-600 leading-relaxed">
          {L(lang,
            "Til direkte ordrer beregnes fragten ud fra leveringssted, antal, containerens mål og aflæsningsmetode. Hvis adgang eller underlag kræver særlig planlægning, giver vi i stedet et individuelt tilbud.",
            "For direct orders, shipping is calculated from the delivery location, quantity, container dimensions and unloading method. If access or ground conditions require special planning, we provide an individual quotation instead.")}
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {factors.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-700 border-b border-slate-100 py-2">
              <span className="w-1.5 h-1.5 bg-orange-500" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-4">
          {deliveryPolicySlug && (
            <Link to={path("policy", lang, deliveryPolicySlug)} className="text-sm font-semibold text-slate-900 underline underline-offset-4">
              {L(lang, "Læs hele leveringspolitikken", "Read the full delivery policy")}
            </Link>
          )}
          <Link to={path("guide", lang, lang === "en" ? "delivery-and-unloading" : "levering-og-aflaesning")} className="text-sm font-semibold text-slate-900 underline underline-offset-4">
            {L(lang, "Guide til levering og aflæsning", "Guide to delivery and unloading")}
          </Link>
        </div>
      </div>
    </section>
  );
}
