import { getComplianceBlockers } from "@/lib/compliance";
import { buildFeedXml, feedRow, validateVariant } from "@/lib/merchant";
import { DEMO_PRODUCTS, DEMO_VARIANTS } from "@/data/demoCatalog";
import { SETTINGS } from "@/data/content";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const products = DEMO_PRODUCTS;
  const variants = DEMO_VARIANTS;
  const settings = SETTINGS;
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
