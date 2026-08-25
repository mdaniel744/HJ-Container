"use client";

import { useEffect, useState } from "react";

// Renders sanitized rich-text HTML from products.description /
// categories.description. Only for full detail views — a truncated or
// line-clamped context should use stripHtmlToText (src/lib/richText.js)
// instead, since a table or heading cut off mid-element looks broken no
// matter how well it's sanitized.
export default function RichText({ html, className = "" }) {
  const [clean, setClean] = useState("");

  useEffect(() => {
    if (!html) {
      setClean("");
      return;
    }
    import("dompurify").then(({ default: DOMPurify }) => setClean(DOMPurify.sanitize(html)));
  }, [html]);

  if (!clean) return null;
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
}
