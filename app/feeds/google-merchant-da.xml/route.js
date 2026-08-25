import { base44 } from "@/api/base44Client";
import { getComplianceBlockers } from "@/lib/compliance";
import { buildFeedXml, feedRow, validateVariant } from "@/lib/merchant";

export const dynamic = "force-dynamic";

export async function GET(request) {
  let products;
  let variants;
  let settingsList;
  try {
    [products, variants, settingsList] = await Promise.all([
      base44.entities.Product.filter({ status: "published" }, "sort_order", 200),
      base44.entities.Variant.filter({ status: "published" }, "sku", 500),
      base44.entities.SiteSetting.list("-created_date", 1),
    ]);
  } catch {
    return new Response("Merchant feed is temporarily unavailable because the catalogue service could not be reached.", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  const settings = settingsList[0] || {};
  const blockers = getComplianceBlockers(settings);

  if (blockers.length) {
    return new Response("Merchant feed is disabled until delivery times, the return-transport estimate and the payment deadline are approved.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const origin = new URL(request.url).origin;
  const rows = variants
    .filter((variant) => !(variant.size === "10ft" && variant.product_key === "open_side"))
    .map((variant) => ({ variant, product: products.find((product) => product.key === variant.product_key) }))
    .filter(({ variant, product }) => variant.merchant_include && validateVariant(variant, product).length === 0)
    .map(({ variant, product }) => feedRow(variant, product, origin, settings));

  return new Response(buildFeedXml(rows, origin), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
    },
  });
}
