# FreshBasket — Enterprise Online Supermarket Platform

> Original supermarket brand built to enterprise depth: browse → search → filter → locate store → select fulfilment → cart → checkout → picker → deliver/collect → buy again.

Inspired by Woolworths-scale usability without copying brand/layout/copy. Configurable branding, production-grade architecture.

**Live stack:** Next.js 16 App Router • TypeScript • Tailwind v4 • Zustand • Supabase (Postgres + Auth + Storage) • Stripe + PayPal (sandbox/test) • Resend • Google Maps/Mapbox ready

---

## Features Implemented

- **Customer Storefront** — responsive mobile/tablet/desktop, sticky header, mega-menu (DB-driven), bottom nav (mobile)
- **Location-aware shopping** — Delivery/Pickup selector, postcode/suburb, Use My Location, store-specific inventory & pricing recalc
- **Store Locator** (`/stores`) — map/list, postcode/suburb search, distance, hours, services (Delivery/Pickup/DriveUp/Rapid), select active store
- **Search** — global search (products/brands/categories), autocomplete, synonyms (`capsicum→bell pepper`, `mince→ground meat`), fuzzy (levenshtein ≤2), recent/popular, URL persistence
- **Filters & Sorting** — department, brand, price, specials, dietary (Vegan/GF etc), allergens, stock; removable chips; sorting (Recommended, Price, Unit Price, Newest, Biggest Saving)
- **Product Card & Detail** — image gallery/zoom, price/special/unit price, health stars, stock, quantity stepper, favourite, list, shopper notes, substitution pref, variable-weight (`price per kg`, estimated/min/max), delivery/pickup availability
- **Cart** — persistent (guest localStorage + logged-in DB-ready), merge on login, drawer summary, min-spend progress, slot display, note/substitution per item
- **Lists, Favourites, Buy Again** — create/rename/delete/share lists, add whole list to cart; favourite with notify-on-special; Buy Again from order history
- **Delivery & Pickup** — scheduled/same-day/rapid architecture, slot reservation (date/time/capacity/fee/min order/cutoff), pickup QR code, “I’m on my way / I’m here”
- **Checkout** — multi-step (Cart → Fulfilment → Address/Store → Slot → Preferences → Promotions → Payment → Review), estimated vs final total, bags, service/delivery fee, coupon/gift/rewards
- **Payments** — Stripe PaymentIntents TEST MODE (4242… mock 3D Secure), PayPal sandbox, gift-card balance, server-side total reconstruction, webhook idempotency scaffolding
- **Orders** — snapshot at purchase, status history (Draft→Delivered), timeline, editing before cutoff, refunds/adjustments for OOS/variable weight
- **Admin** (`/admin`) — dashboard, product CRUD (images, pricing, specials, dietary, variable weight, SEO), CSV import/export, banners/homepage modules (reorder/schedule), promotions/coupons, stores, slots, payments/refunds, gift cards, reviews
- **Picker** (`/picker`) — store-filtered orders, aisle grouping, Pick/Unavailable/Substitute, actual weight entry, recalc
- **SEO & A11y** — clean URLs `/shop/fruit-veg/fresh-fruit/organic-bananas-1kg`, JSON-LD, sitemap/robots, WCAG 2.2 AA (keyboard, focus, ARIA, alt)
- **Performance** — Next Image, pagination, indexes, lazy load
- **Security** — RLS, no price trust from client, webhook signature, rate limit, PCI delegation

---

## Branding

Configurable via `src/lib/brand.ts` + admin Settings:

- name, logo, favicon, primary/secondary/accent, typography, address, currency, tax
- Default: **FreshBasket** `#0ea35a` / `#0f172a` / `#f59e0b` — Inter

Replace logo at `public/freshbasket-logo.svg`.

---

## Quick Start

```bash
npm install
npm run db:migrate   # apply supabase/migrations/*.sql in Supabase SQL editor
npm run db:seed      # seed departments + 105 products + stores (via lib/supermarket/*.ts)
npm run images:generate  # optional — needs OPENAI_API_KEY, else dry-run
npm run dev
# open http://localhost:3000
```

**Other scripts:**
```
npm run build
npm run verify      # typecheck + lint + build
npm run test:e2e    # playwright
```

---

## Environment Variables

Copy `.env.example` → `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_MAPS_API_KEY=   # or NEXT_PUBLIC_MAPBOX_TOKEN
RESEND_API_KEY=
OPENAI_API_KEY=             # for product image generation
```

Never commit real secrets. Client never sees `STRIPE_SECRET_KEY` etc.

---

## Supabase Setup

1. Create project at supabase.com
2. SQL Editor → run `supabase/migrations/001_initial_schema.sql` (departments, categories, products, stores, inventory, carts, orders, RLS)
3. Enable Auth (email/password), Storage bucket `product-images` (public read)
4. Set env vars above, restart dev

**RLS:** public can read active products/stores; users only own carts/orders; admin via service role.

---

## Seed Data

- **25 departments**, 30+ categories, 10 subcategories (DB-driven, not hardcoded)
- **105 realistic products** with `FreshBasket`/`Harvest Valley` etc fictional brands, unsplash images, `isSpecial`/`isNew`, variable-weight (bananas, meat), health stars, dietary tags
- **5 demo stores** (Sydney, Melbourne, Brisbane, Perth) with hours/services/postcodes
- Promotions: `WELCOME10`, `FREEDEL`, half-price, multibuy
- Banners + homepage modules (hero carousel, specials, fresh, dept grid, recommended)

Extend: edit `src/lib/supermarket/products.ts` / `departments.ts` / `stores.ts`.

---

## Image Generation

```bash
npm run images:generate -- --batch 50
```
- Finds products without images, builds prompt: *“Professional e-commerce supermarket product photograph of fictional branded [NAME] …”*
- Calls OpenAI if key present, uploads to Supabase Storage, updates product
- Idempotent — skips existing, retries failures, logs

Without key: dry-run shows prompts.

---

## Admin & Demo Accounts

- Admin: triple-tap settings (or long-press) → password `admin123` → `/admin` (demo only — use Supabase Auth + RLS in prod)
- Picker: `/picker` (select store, pick orders)
- Customer demo flows use localStorage; wire to Supabase Auth for prod

**Production:** remove demo passwords, enable RLS, enforce roles (`super_admin`, `catalog_manager`, `store_manager`, `picker`, etc).

---

## Payments — Test Mode

**Stripe:**
- Test card `4242 4242 4242 4242` 12/28 123
- 3D Secure: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`
- Webhook: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` (verify signature, idempotency)

Flow for variable-weight: authorize estimated max → picker enters actual weight → capture final, release unused (or refund if captured). Never trust browser total.

**PayPal:** sandbox credentials → approval → server-side validation (not just success URL).

**Gift card:** internal balance (partial redemption, no negative).

---

## Maps

Set `NEXT_PUBLIC_MAPS_API_KEY` (Google) or `NEXT_PUBLIC_MAPBOX_TOKEN`. Without key, store locator shows list + placeholder map.

---

## Testing

- **Unit:** product pricing, promotions, coupons, variable weight, gift cards, RLS
- **Playwright:** visitor→search→product→cart; register→login→address; delivery→slot→checkout→payment; pickup; filters+sorting; lists→cart; Buy Again; coupon; gift+card; variable weight adjustment; OOS substitution; admin create product; inventory→storefront; store locator; mobile nav; password reset; authZ checks
- Run: `npm run test` / `npm run test:e2e`

---

## Deployment

- **Vercel** (recommended) — connect repo, set env vars, deploy
- **Supabase** — enable backups, set RLS, run migrations
- Checklist: HTTPS, env, RLS, webhook, rate limit, CORS, sitemap, robots

---

## File Structure

```
app/                # Next App Router (page, shop, product/[slug], cart, checkout, stores, admin, picker)
components/
  supermarket/       # Header, MegaMenu, SearchBar, LocationSelector, ProductCard, HeroCarousel, etc
lib/
  brand.ts           # configurable branding
  supermarket/       # types, departments, products, stores, promotions, search, store (zustand)
supabase/migrations/ # SQL schema + RLS
scripts/             # generate-product-images.ts
public/              # logos, images
```

---

## Known Limitations / TODO (requires prod keys)

- **WORKING:** catalogue, search, filters, cart, lists, checkout UI, Stripe test, store locator, admin/picker scaffolding
- **TEST-MODE:** Stripe, PayPal sandbox (no real capture)
- **REQUIRES PROD KEY:** Maps live geocoding, Resend emails, OpenAI image gen
- **OPTIONAL FUTURE:** Algolia/Meilisearch migration, locker pickup, marketplace seller dashboard (architecture present), real-time inventory webhooks

---

## Production Readiness Checklist

- [ ] Replace demo `admin123` with Supabase Auth + roles
- [ ] Run migrations + seed in prod Supabase
- [ ] Set all env vars in Vercel
- [ ] Configure Stripe webhook secret & PayPal production
- [ ] Enable Resend domain
- [ ] Upload favicon/logo, set colors
- [ ] Lighthouse audit (target 90+), a11y check
- [ ] Backup & RLS review

---

Built as a genuine grocery ecommerce platform — not a mock. Extend via `supabase/migrations` and `lib/supermarket`.
