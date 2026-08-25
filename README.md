# HJ Container ApS

The storefront runs on Next.js 16 with the App Router. Base44 remains the
application backend for catalogue data, settings, authentication, orders,
quotes, uploads, and administrative content.

Until the existing HJ Container dashboard database is connected to the
storefront product tables, the shop uses `src/data/demoCatalog.js` as an
immediate fallback. The fallback contains three variable product families,
thirteen valid size/condition variants, and four standalone specialist
products. It is automatically replaced by published remote catalogue records
when they are available.

## Requirements

- Node.js 20.9 or newer
- npm

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add the Base44 application values:

   ```dotenv
   NEXT_PUBLIC_BASE44_APP_ID=your_app_id
   NEXT_PUBLIC_BASE44_APP_BASE_URL=https://your-app.base44.app
   NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION=
   ```

3. Start Next.js:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3100](http://localhost:3100).

When `NEXT_PUBLIC_BASE44_APP_BASE_URL` is configured, Next.js forwards local
`/api` requests to the deployed Base44 app.

## Base44 local backend

The existing `base44/config.jsonc` keeps `npm run dev` as the frontend command.
After installing and authenticating the Base44 CLI, `npx base44 dev` can start
the local backend and this Next.js frontend together.

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
- `/login`, `/register`, `/forgot-password`, and `/reset-password`

The Base44 site host is SPA-oriented. Deploy this server-rendered Next.js app
to a Next.js-compatible host while continuing to use Base44 as its backend.
