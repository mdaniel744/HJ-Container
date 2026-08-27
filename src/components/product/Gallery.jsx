import React, { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { Expand, X } from "lucide-react";
import { L } from "@/lib/i18n";

export default function Gallery({ images, imageAlts, alt, lang }) {
  const list = (images || []).filter(Boolean);
  const [active, setActive] = useState(0);
  const [full, setFull] = useState(false);

  useEffect(() => setActive(0), [list[0]]);
  if (!list.length) return null;

  return (
    <div>
      <div className="relative border border-slate-200 bg-slate-50 overflow-hidden group">
        <Image src={list[active]} alt={imageAlts?.[active] || alt} className="w-full aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.08]" />
        <button
          onClick={() => setFull(true)}
          className="absolute bottom-3 right-3 bg-white/95 border border-slate-200 p-2 text-slate-700"
          aria-label={L(lang, "Vis billede i fuld skærm", "View image full screen")}
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-current={active === i}
              className={`border overflow-hidden ${active === i ? "border-slate-900" : "border-slate-200"}`}
            >
              <Image src={src} alt={imageAlts?.[i] || `${alt} — ${i + 1}`} className="w-full aspect-square" />
            </button>
          ))}
        </div>
      )}

      {full && (
        <div className="fixed inset-0 z-[80] bg-slate-950/95 flex items-center justify-center p-6" role="dialog" aria-modal="true">
          <button onClick={() => setFull(false)} className="absolute top-5 right-5 text-white p-2" aria-label={L(lang, "Luk", "Close")}>
            <X className="w-7 h-7" />
          </button>
          <Image src={list[active]} alt={imageAlts?.[active] || alt} fittingType="fit" className="max-h-[85vh] w-full max-w-5xl" />
        </div>
      )}
    </div>
  );
}