import React from "react";
import { Link } from "@/lib/next-router";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCategories } from "@/lib/useCatalog";
import { stripHtmlToText } from "@/lib/richText";
import { CONTAINER_TYPES } from "@/lib/containerTypes";

const TILE_IMAGES = {
  standard: "/images/categories/standard-container.webp",
  high_cube: "/images/categories/high-cube-container.webp",
  open_side: "/images/categories/open-side-container.webp",
  storage: "/images/categories/storage-container.webp",
  office: "/images/categories/office-container-v2.webp",
  conversions: "/images/categories/container-conversions.webp",
};

function categoryTypeKey(category) {
  const label = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  if (/high.?cube/.test(label)) return "high_cube";
  if (/open.?side/.test(label)) return "open_side";
  if (/standard/.test(label)) return "standard";
  if (/storage|opbevaring/.test(label)) return "storage";
  if (/office|kontor/.test(label)) return "office";
  return null;
}

export default function CategoryCards({ lang }) {
  const { categories } = useCategories(lang);
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTAINER_TYPES.map((type) => {
            const category = categories.find((item) => categoryTypeKey(item) === type.key);
            const href = category
              ? path("category", lang, category.slug)
              : `${path("quote", lang)}?type=${type.key}`;
            return (
              <Link
                key={type.key}
                to={href}
                className="group relative flex min-h-[390px] flex-col overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl hover:shadow-slate-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f3f5f4] p-5">
                  <Image
                    src={TILE_IMAGES[type.key]}
                    alt={category?.name || type.label[lang]}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-xl font-bold leading-tight text-slate-950">{category?.name || type.label[lang]}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-orange-500" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {category?.description ? stripHtmlToText(category.description) : type.description[lang]}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-6 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    <span className={`h-1.5 w-1.5 ${category ? "bg-emerald-500" : "bg-orange-500"}`} />
                    {category ? L(lang, "Se containere", "Shop containers") : L(lang, "Tilpasset tilbud", "Custom quote")}
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
