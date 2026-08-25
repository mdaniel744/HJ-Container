// Strips HTML to plain text — for truncated/compact contexts (cards, list
// previews, line-clamped boxes) and meta descriptions/SEO tags, where a
// table or heading cut off mid-element by truncation looks broken no matter
// how well it's sanitized. Full detail views should render with RichText
// instead (see src/components/RichText.jsx).
export function stripHtmlToText(html) {
  if (!html) return "";
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
