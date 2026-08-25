import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { MEDIA } from "@/lib/media";

export default function Hero({ lang }) {
  return (
    <section className="relative bg-slate-900">
      <Image
        src={MEDIA.hero}
        alt={L(lang, "Containerterminal med stablede 40 fods High Cube-containere i dagslys", "Container terminal with stacked 40ft High Cube containers in daylight")}
        className="absolute inset-0 w-full h-full opacity-70"
        focalPointY={0.55}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-36">
        <div className="max-w-2xl bg-white/95 backdrop-blur-sm p-8 md:p-12 border-l-4 border-orange-500">
          <p className="hjc-section-tag">{L(lang, "HJ Container ApS · Horsens, Danmark", "HJ Container ApS · Horsens, Denmark")}</p>
          <h1 className="mt-4 font-heading text-3xl md:text-5xl font-extrabold leading-[1.05] text-slate-900">
            {L(lang, "Køb nye og brugte containere i Danmark", "Buy new and used shipping containers in Denmark")}
          </h1>
          <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
            {L(lang,
              "Køb Standard-, High Cube- og Open Side-containere online, eller få en skræddersyet opbevarings-, kontor- eller ombygningsløsning.",
              "Buy Standard, High Cube and Open Side containers online, or request a tailored storage, office or converted container solution.")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to={path("shop", lang)} className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-4 transition-colors">
              {L(lang, "Se containere", "Browse containers")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to={path("quote", lang)} className="inline-flex items-center justify-center border border-slate-900 text-slate-900 font-semibold px-7 py-4 hover:bg-slate-50">
              {L(lang, "Få et tilbud", "Request a Quote")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
