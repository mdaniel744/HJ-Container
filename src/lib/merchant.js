import { CONDITION_LABEL } from "@/lib/i18n";
import { CATEGORY_LABEL } from "@/lib/routes";

const GOOGLE_CATEGORY = "Business & Industrial > Material Handling > Shipping Containers";

/** Required fields for Google Merchant Center eligibility (Danish feed, DKK). */
export function validateVariant(variant, product) {
  const issues = [];
  if (!product) issues.push("product_missing");
  if (!variant.sku) issues.push("id");
  if (!variant.item_group_id) issues.push("item_group_id");
  if (!product?.name_da) issues.push("title");
  if (!product?.description_da) issues.push("description");
  if (!product?.slug_da) issues.push("link");
  if (!(variant.image || product?.images?.[0])) issues.push("image_link");
  if (!variant.price_incl_vat) issues.push("price");
  if (!variant.direct_order) issues.push("direct_order_disabled");
  if (variant.quote_only) issues.push("quote_only");
  if (variant.availability !== "in_stock") issues.push("availability");
  if (!variant.condition) issues.push("condition");
  if (variant.is_sample) issues.push("sample_data");
  if (variant.status !== "published") issues.push("not_published");
  return issues;
}

export function feedRow(variant, product, origin) {
  return {
    id: variant.sku,
    item_group_id: variant.item_group_id,
    title: `${product.name_da} ${variant.size} — ${CONDITION_LABEL[variant.condition].da}`,
    description: product.description_da,
    link: `${origin}/produkt/${product.slug_da}?variant=${variant.sku}`,
    image_link: variant.image || product.images?.[0],
    additional_image_link: (product.images || []).filter((i) => i !== (variant.image || product.images?.[0])).slice(0, 4),
    availability: variant.availability === "in_stock" ? "in_stock" : "backorder",
    price: `${variant.price_incl_vat} DKK`,
    sale_price: variant.compare_at_price ? `${variant.price_incl_vat} DKK` : "",
    condition: variant.condition === "new" ? "new" : "used",
    brand: "HJ Container ApS",
    mpn: variant.mpn || "",
    gtin: variant.gtin || "",
    product_type: `${CATEGORY_LABEL[product.category].da} > ${variant.size}`,
    google_product_category: GOOGLE_CATEGORY,
    shipping: "DK:::0.00 DKK",
    shipping_weight: variant.tare_weight || "",
    return_policy_label: "HJC-DK-RETUR",
    custom_label_0: variant.size,
    custom_label_1: variant.condition,
    custom_label_2: product.category,
  };
}

const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildFeedXml(rows, origin) {
  const items = rows.map((r) => {
    const extra = (r.additional_image_link || []).map((i) => `      <g:additional_image_link>${esc(i)}</g:additional_image_link>`).join("\n");
    const fields = Object.entries(r)
      .filter(([k, v]) => k !== "additional_image_link" && v !== "" && v !== undefined && v !== null)
      .map(([k, v]) => `      <g:${k}>${esc(v)}</g:${k}>`)
      .join("\n");
    return `    <item>\n${fields}${extra ? `\n${extra}` : ""}\n    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>HJ Container ApS — Danmark</title>
    <link>${esc(origin)}</link>
    <description>Containere til salg i Danmark. Priser i DKK inkl. moms.</description>
${items}
  </channel>
</rss>`;
}

export function buildSitemapXml(urls, origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => `  <url>
    <loc>${esc(origin + u.da)}</loc>
    <xhtml:link rel="alternate" hreflang="da-DK" href="${esc(origin + u.da)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(origin + u.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(origin + u.da)}"/>
  </url>`).join("\n")}
</urlset>`;
}