import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Box,
  BriefcaseBusiness,
  DoorOpen,
  MoveVertical,
  ThermometerSnowflake,
  Warehouse,
  Wrench,
} from "lucide-react";
import { L } from "@/lib/i18n";
import { COLLECTIONS, path } from "@/lib/routes";
import { CONTAINER_TYPES } from "@/lib/containerTypes";
import { MEDIA } from "@/lib/media";

const ICONS = {
  standard: Box,
  high_cube: MoveVertical,
  open_side: DoorOpen,
  storage: Warehouse,
  office: BriefcaseBusiness,
  conversions: Wrench,
  insulated: ThermometerSnowflake,
  tunnel: ArrowLeftRight,
};

export default function CategoryCards({ lang }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="hjc-section-tag">{L(lang, "Vores containerudvalg", "Our container range")}</p>
            <h2 className="mt-4 max-w-lg font-heading text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
              {L(lang, "Containertyper fra HJ Containers", "Container Types from HJ Containers")}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-700">
              {L(lang,
                "HJ Containers er din alsidige leverandør af nye og brugte skibscontainere samt modulbaserede løsninger.",
                "HJ Containers is your versatile provider of new and used shipping containers and modular solutions.")}
            </p>
            <Link to={path("shop", lang)} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-orange-600">
              {L(lang, "Se lagerførte containere", "View stocked containers")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>
              {L(lang,
                "Vores brede produktsortiment omfatter skibscontainere, kontorcontainere, boligcontainere, opbevarings- og materialecontainere, brugte containere, turntable-containere samt Open Side-containere og meget mere.",
                "Our wide range of products includes shipping containers, office containers, residential containers, storage and material containers, used containers, turntable containers, Open Side containers and more.")}
            </p>
            <p>
              {L(lang,
                "Vores containere er velegnede til alle anvendelsesområder – fra byggepladser og arbejdspladser til store festivaler. Hvis du ønsker at købe skibscontainere i enhver størrelse til dit projekt, er du kommet til det rette sted.",
                "Our containers are suitable for every area of use – from construction sites and workspaces to large festivals. If you are looking to buy shipping containers of any size for your projects, you have come to the right place.")}
            </p>
            <p>
              {L(lang,
                "Uanset om du har brug for en midlertidig rumløsning, ekstra opbevaringsplads eller en komplet løsning til virksomhedskontorer eller byggepladser, tilbyder vi fleksible og pålidelige løsninger.",
                "Whether you need a temporary space solution, additional storage space or a comprehensive solution for company offices or construction sites, we offer flexible and reliable options.")}
            </p>
            <p className="border-l-2 border-orange-500 pl-5 font-medium text-slate-800">
              {L(lang,
                "Efter særlig aftale udvikler vi også skræddersyede specialkonstruktioner i containere til dig.",
                "Upon special request, we also develop tailor-made special container constructions for you.")}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTAINER_TYPES.map((type) => {
            const Icon = ICONS[type.key];
            const collection = type.mode !== "service" ? COLLECTIONS.find((item) => item.key === type.key) : null;
            const href = collection
              ? path("category", lang, collection.slug[lang])
              : `${path("quote", lang)}?type=${type.key}`;
            const image = MEDIA[type.key];
            return (
              <Link
                key={type.key}
                to={href}
                className="group relative flex min-h-[390px] flex-col overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {image ? (
                    <Image
                      src={image}
                      alt={type.label[lang]}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="hjc-brand-grid flex h-full w-full items-center justify-center bg-slate-900 text-orange-400" aria-hidden="true">
                      <Icon className="h-14 w-14" strokeWidth={1.25} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-xl font-bold leading-tight text-slate-950">{type.label[lang]}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-orange-500" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{type.description[lang]}</p>
                  <div className="mt-auto flex items-center gap-2 pt-6 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    <span className={`h-1.5 w-1.5 ${collection ? "bg-emerald-500" : "bg-orange-500"}`} />
                    {collection
                      ? L(lang, "Se containere", "Shop containers")
                      : L(lang, "Tilpasset tilbud", "Custom quote")}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
