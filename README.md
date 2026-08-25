# HJ Container ApS

The storefront runs on Next.js 16 with the App Router. Catalogue, FAQ, policy
and settings content is currently served from local static data in
`src/data/` while the shared multi-tenant Supabase backend is wired up.

Until the existing HJ Container dashboard database is connected to the
storefront product tables, the shop uses `src/data/demoCatalog.js` as an
immediate fallback. The fallback contains three variable product families,
thirteen valid size/condition variants, and four standalone specialist
products. The existing Supabase catalogue modules remain in place for the
planned dashboard product-table integration.

## Requirements

- Node.js 20.9 or newer
- npm

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Next.js:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3100](http://localhost:3100).

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Routes

The Next.js App Router contains real routes for both the Danish and English
storefronts, including:

- `/` and `/en`
- `/shop` and `/en/shop`
- `/containere/[slug]` and `/en/containers/[slug]`
- `/produkt/[slug]` and `/en/product/[slug]`
- cart, checkout, quote, content, guide, policy, and confirmation routes

Checkout, the quote request form, and the contact form render their full UI
but do not submit anywhere yet — there is no backend wired up. Each shows a
notice directing visitors to email us directly instead.
