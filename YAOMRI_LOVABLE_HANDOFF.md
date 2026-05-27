# Ya Omri Swimwear — Shopify Dawn Rebuild Handoff

**Source:** React + Tailwind v4 prototype
**Target:** Shopify Online Store 2.0, Dawn theme
**Goal:** 1:1 visual rebuild as modular Liquid sections. Do not redesign.

---

## 0. Global Design System

### 0.1 Colour tokens (paste into Dawn `settings_data.json` colour schemes or `base.css` custom properties)

| Token | Value (oklch) | Approx hex | Usage |
|---|---|---|---|
| `--paper` | `oklch(1 0 0)` | `#ffffff` | Page background, light surfaces |
| `--ink` | `oklch(0.14 0 0)` | `#1a1a1a` | Body text, dark surfaces, footer, announcement bar |
| `--sand` | `oklch(0.96 0.005 80)` | `#f6f4ef` | Subtle hover / chip background |
| `--secondary` | `oklch(0.96 0 0)` | `#f4f4f4` | Search field background, button hover |
| `--muted-foreground` | `oklch(0.45 0 0)` | `#737373` | Secondary text, captions |
| `--border` | `oklch(0.92 0 0)` | `#e8e8e8` | Hairline dividers, card outlines |
| `--destructive` | `oklch(0.55 0.2 25)` | `#d23a2a` | Sale tag (not used on home) |

All other Tailwind colours in the prototype resolve to these — there are no extra accent colours.

### 0.2 Typography

- **Family:** Inter (300–900, with italic). Self-host via Dawn `assets/` or load from Google Fonts.
- **Headings (h1–h4):** `font-weight: 800`, `font-style: italic`, `text-transform: uppercase`, `letter-spacing: 0`.
- **Body:** Inter regular, 14–16 px.
- **Eyebrow / micro-label:** 0.7 rem, `font-weight: 800`, italic, uppercase, letter-spacing 0.04em.
- **Nav links:** 0.78 rem, italic, uppercase, weight 800.
- **Product titles:** 0.78 rem, uppercase, weight 600.
- **Buttons:** 0.75 rem, italic, uppercase, weight 800, no letter-spacing change, no border-radius.

### 0.3 Shape & radius

- `--radius: 0px` everywhere. **No rounded corners** on buttons, cards, inputs, badges (except the cart count which is a `rounded-full` circle).

### 0.4 Layout grid

- Page max-width: **1500 px** (`max-w-[1500px]`).
- Side padding: `px-4` mobile, `lg:px-6` desktop.
- Vertical section padding: `py-10 md:py-14`.
- Gutter between cards: `gap-3 md:gap-4`.

### 0.5 Custom CSS (must be ported verbatim to Dawn `assets/section-yaomri.css` or component CSS)

```css
.eyebrow{
  font-size:.7rem;
  letter-spacing:.04em;
  text-transform:uppercase;
  font-weight:800;
  font-style:italic;
}

/* Diagonal hatched image placeholder — keep until real assets exist */
.placeholder-img{
  position:relative;
  background:repeating-linear-gradient(135deg,
    #f3f0eb 0 14px,
    #efece5 14px 28px);
  overflow:hidden;
}
.placeholder-img::after{
  content:attr(data-label);
  position:absolute; inset:8px;
  display:flex; align-items:center; justify-content:center;
  text-align:center; padding:1rem;
  font-size:.6rem; letter-spacing:.18em; text-transform:uppercase;
  font-weight:600; color:#595959;
  background:rgba(255,255,255,.55);
  border:1px dashed #c7c7c7;
}

.no-scrollbar::-webkit-scrollbar{display:none}
.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
```

Replace `.placeholder-img` blocks with real `{{ section.settings.image | image_url }}` once content is loaded.

---

## 1. Section-by-section handoff

Every section below maps to one Dawn section file under `sections/`. Use `presets` so merchants can add/remove freely. Keep block schemas where noted.

---

### Section 1 — Announcement Bar + Header

- **Section name:** Header + Announcement
- **Component / file:** `src/components/site/Header.tsx` → Dawn `sections/header.liquid` (override the bundled one)
- **Visual:** Two stacked bars. (a) Slim 32 px black bar, centered white uppercase message. (b) 64 px white bar with hairline bottom border: logo + main nav (left/centre cluster), search field + country + account + wishlist + cart (right cluster).
- **Desktop layout:** Single row, 1500 px max-width, `px-6`. Logo first (h-10), inline nav at 28 px gap, right side `ml-auto`. Search input is 256 px wide, 40 px tall.
- **Mobile layout:** Announcement unchanged. Burger icon shown left, logo next, search hidden, country hidden, wishlist hidden — only account + cart remain.
- **Copy:**
  - Announcement: `Complimentary shipping on orders over AED 500`
  - Nav: `WOMEN`, `NEW IN`, `SWIMWEAR`, `RESORTWEAR`, `BEST SELLERS`, `LOOKBOOK`, `SALE`
  - Search placeholder: `Search`
  - Country chip: `AE`
- **Images:** Brand logo only → `src/assets/logo.avif` (Dawn: `settings.logo`).
- **Buttons / links:** Each nav item → collection URL. Search opens predictive search. User → `/account`. Wishlist → app endpoint. Cart → `/cart`.
- **Colours:** Announcement `bg-ink text-paper`. Main bar `bg-background` (paper) with `border-b border-border`.
- **Typography:** Announcement `text-[0.7rem] tracking-wider font-semibold uppercase`. Nav `text-[0.78rem] font-extrabold italic uppercase`. Search input 14 px.
- **Spacing:** Heights fixed (h-8 announcement, h-16 main). Inner padding `px-4 lg:px-6`. Icon buttons `p-2`.
- **Hover/animation:** Nav links `hover:underline underline-offset-4 decoration-2`. No transitions on icons.
- **Repeatable blocks:** Each nav item = `menu_item` block (type `link`, fields: label, url, optional megamenu image).
- **Schema settings:**
  - `logo` (image_picker)
  - `logo_height` (range 24–80, default 40)
  - `announcement_text` (text)
  - `announcement_link` (url, optional)
  - `show_country_selector` (checkbox)
  - `show_wishlist` (checkbox)
  - Menu picker for main nav (`linklist`)
- **Editor notes:** Logo, announcement copy, nav menu, and visibility toggles must be editable. Cart/account icons are theme-locked.

---

### Section 2 — Hero (Triple Campaign)

- **Section name:** Hero — 3-up Campaign
- **Component / file:** `src/components/site/HeroSection.tsx` → `sections/hero-triple.liquid`
- **Visual:** Three full-bleed campaign tiles side by side, separated by 4 px gaps, with 4 px top padding. Each tile is 78 vh on desktop (min 420 px). Left tile has overlaid copy block (bottom-left): eyebrow-style subhead, large italic uppercase headline, two CTAs.
- **Desktop layout:** `grid-cols-3 gap-1 px-1 pt-1`. Each tile 1/3 width, 78 vh.
- **Mobile layout:** Stacks `grid-cols-1`, each tile 55 vh (min 420 px). Copy block stays on first tile, bottom-left.
- **Copy (on tile 1 only):**
  - Headline: `Get sun-drenched`
  - Sub: `Statement swimwear for golden-hour escapes.`
  - CTA1: `Shop the Collection`
  - CTA2: `Explore New Arrivals`
- **Images:** 3 placeholders — `Hero Left — Campaign`, `Hero Centre — Campaign`, `Hero Right — Campaign`. Recommended export 1200×1500 (4:5) each.
- **Buttons:** CTA1 → `/collections/all`. CTA2 → `/collections/new`.
- **Colours:** Copy and CTAs white on image. CTA1: `bg-paper text-ink`, hover `bg-sand`. CTA2: transparent with `border border-paper text-paper`, hover inverts to `bg-paper text-ink`.
- **Typography:** Headline `text-3xl md:text-5xl font-extrabold italic uppercase leading-[0.95]`. Sub `text-sm font-medium uppercase tracking-wide`.
- **Spacing:** Copy block offset `left-6 bottom-6 md:left-10 md:bottom-10`, max-width `max-w-xs`.
- **Hover/animation:** Button background colour transition only.
- **Repeatable blocks:** Each tile = `hero_tile` block. Fields: image, optional headline, optional subheading, CTA1 label+link, CTA2 label+link, text-position (preset bottom-left).
- **Schema settings:**
  - `tile_height_desktop` (range 60–90 vh, default 78)
  - `tile_height_mobile` (range 40–80 vh, default 55)
  - `gap_px` (range 0–16, default 4)
  - Block max: 3.
- **Editor notes:** Merchant should swap each campaign image and rewrite copy/CTA per tile. Lock tile count to 3 by default but allow 1–3.

---

### Section 3 — Brand Strip

- **Section name:** Brand Strip (USP bar)
- **Component / file:** `src/components/site/BrandStrip.tsx` → `sections/brand-strip.liquid`
- **Visual:** Slim black band, 4 brand statements separated by tiny white bullet dots, centered, wraps on small screens.
- **Desktop layout:** `flex flex-wrap items-center justify-center gap-x-10 gap-y-2`, vertical padding `py-4`.
- **Mobile layout:** Items wrap to 2 columns visually.
- **Copy:** `Sculpted Fits`, `Premium Swimwear`, `Resort-Ready Styling`, `Designed to Turn Heads`.
- **Images:** None.
- **Buttons / links:** None (static).
- **Colours:** `bg-ink text-paper`. Bullets are `bg-paper` 1×1 px dots.
- **Typography:** `text-[0.72rem] font-extrabold italic uppercase tracking-wider`.
- **Spacing:** `py-4`, container `max-w-[1500px] px-4 lg:px-6`.
- **Hover/animation:** None.
- **Repeatable blocks:** Each statement = `statement` block (single `text` field, max 6 blocks).
- **Schema settings:** `background_color`, `text_color`, `padding_vertical` (range 8–32). Otherwise content-only.
- **Editor notes:** Merchant adds/removes statements; styling fixed.

---

### Section 4, 5, 7 — Product Carousel (reusable)

Used three times on the home: **New In — Swimwear**, **Best Sellers**, **Shop Resortwear**.

- **Section name:** Product Carousel
- **Component / file:** `src/components/site/ProductCarousel.tsx` → `sections/product-carousel.liquid`
- **Visual:** Above-the-row header with title + small count, right-aligned prev/next square buttons (36 px). Below: row of 5 product cards on desktop, 2 on mobile, 4 on tablet. Each card is 4:5 image then 3 lines (title, "Swimwear" category, price), with a small `New` tag chip top-left and a heart button top-right that fades in on hover.
- **Desktop layout:** `grid-cols-5 gap-4`. Header `flex items-end justify-between mb-5`.
- **Mobile layout:** `grid-cols-2 gap-3`. Arrows remain visible.
- **Copy (one set per instance):**
  - Instance A: title `New In — Swimwear`, count `24 pieces`.
  - Instance B: title `Best Sellers`, count `Most loved`.
  - Instance C: title `Shop Resortwear`, count `New season`.
- **Card data arrays (verbatim):**

```ts
const newIn = [
  { name: "Solara Bikini Set", price: "AED 720", tag: "New" },
  { name: "Amara One Piece",   price: "AED 890", tag: "New" },
  { name: "Capri Cover-Up",    price: "AED 1,120" },
  { name: "Isla Triangle Bikini", price: "AED 680" },
  { name: "Mira Wrap One Piece",  price: "AED 940", tag: "New" },
];
const bestSellers = [
  { name: "Solara Bikini Set", price: "AED 720" },
  { name: "Riviera Tie Bikini", price: "AED 760" },
  { name: "Amara One Piece",   price: "AED 890" },
  { name: "Capri Cover-Up",    price: "AED 1,120" },
  { name: "Nova Halter Top",   price: "AED 420" },
];
const resort = [
  { name: "Sienna Kaftan",        price: "AED 1,480" },
  { name: "Luna Slip Dress",      price: "AED 1,260" },
  { name: "Marrakech Linen Set",  price: "AED 1,640" },
  { name: "Belle Sarong",         price: "AED 540" },
  { name: "Atlas Shirt Dress",    price: "AED 1,180", tag: "New" },
];
```

In Dawn these become a collection picker — pull products via `{% for product in section.settings.collection.products limit: section.settings.product_limit %}`. Tag chip should show if product has tag `New`.

- **Images:** 5 product placeholders per row at 4:5 ratio. Use product featured image.
- **Buttons / links:** Card → product URL. Wishlist button → wishlist app handler. Arrows → scroll the row.
- **Colours:** Card background `bg-background` (paper). Tag chip `bg-paper text-ink`. Heart hover button `bg-paper/90`. Arrow buttons `border border-border hover:bg-secondary`.
- **Typography:** Section title `text-xl md:text-2xl font-extrabold italic uppercase`. Count next to it `text-xs text-muted-foreground font-semibold not-italic`. Product title `text-[0.78rem] font-semibold uppercase tracking-wide`. Category `text-xs text-muted-foreground`. Price `text-[0.78rem] font-semibold`.
- **Spacing:** Section `py-10 md:py-14 border-t border-border`. Card text uses `mt-3 space-y-0.5`.
- **Hover/animation:** Heart icon `opacity-0 group-hover:opacity-100 transition-opacity`. Arrow buttons `hover:bg-secondary`. No image zoom.
- **Repeatable blocks:** Not needed — driven by a collection. Optionally a `featured_product` block for manual override.
- **Schema settings:**
  - `title` (text)
  - `count_label` (text)
  - `collection` (collection_picker)
  - `product_limit` (range 4–12, default 5)
  - `show_wishlist` (checkbox)
  - `show_arrows` (checkbox)
  - `show_new_tag` (checkbox)
- **Editor notes:** Three instances of this same section on the home — each editable independently.

---

### Section 6 — Promo Banner (Campaign Feature)

- **Section name:** Full-Bleed Campaign Banner
- **Component / file:** `src/components/site/PromoBanner.tsx` → `sections/promo-banner.liquid`
- **Visual:** Full-bleed campaign image, 58 vh desktop / 44 vh mobile (min 340 px). Copy block left-aligned, vertically centered desktop / bottom mobile. Eyebrow, large italic uppercase title, body line, two CTA buttons.
- **Desktop layout:** `relative` image, copy inside `max-w-[1500px] px-10`. Text `max-w-md`.
- **Mobile layout:** Copy pinned `items-end` bottom-left with `pb-10`.
- **Copy:**
  - Eyebrow: `The Poolside Edit`
  - Title: `A summer in the sun`
  - Body: `Statement swimwear and refined resort pieces — curated for long lunches and golden hours.`
  - CTA1: `Shop Women`
  - CTA2: `Shop Resort`
- **Image:** 1 placeholder, `Campaign Feature — Poolside Edit`. Export at 2400×1400.
- **Buttons / links:** CTA1 → `/collections/women`. CTA2 → `/collections/resortwear`.
- **Colours:** Default `invert=true` → text and buttons white. CTA1 `bg-paper text-ink`. CTA2 `border border-paper text-paper`.
- **Typography:** Title `text-3xl md:text-5xl leading-[0.95]` (h2 inherits italic uppercase). Body `text-sm font-medium uppercase tracking-wide`.
- **Spacing:** Image `h-[44vh] min-h-[340px] md:h-[58vh]`. Container `pb-10 md:pb-0`.
- **Hover/animation:** None.
- **Repeatable blocks:** None — single composition.
- **Schema settings:**
  - `image` (image_picker)
  - `eyebrow` (text)
  - `title` (text)
  - `body` (textarea)
  - `cta_1_label`, `cta_1_link`
  - `cta_2_label`, `cta_2_link`
  - `text_color_invert` (checkbox, default true) — toggles white/dark text + button variants
  - `height_desktop` (range 40–80 vh, default 58)
  - `height_mobile` (range 30–70 vh, default 44)
- **Editor notes:** Designed to be reusable — merchant can drop a second instance later with `invert=false` for a light-on-dark variant. Don't expose redesign options.

---

### Section 8 — Category Row

- **Section name:** Shop By Category
- **Component / file:** `src/components/site/CategoryRow.tsx` → `sections/category-row.liquid`
- **Visual:** Section title left, then 4 portrait tiles in a row. Below each tile, underlined italic uppercase label.
- **Desktop layout:** `grid-cols-4 gap-4`. Tiles 3:4 portrait. Section padding `py-14`, top border.
- **Mobile layout:** `grid-cols-2 gap-3`.
- **Copy:** Title `Shop By Category`. Tile labels: `Bikinis`, `One Pieces`, `Cover-Ups`, `Resortwear`.
- **Images:** 4 placeholders, 3:4.
- **Buttons / links:** Each tile → collection page.
- **Colours:** Standard paper background, ink labels.
- **Typography:** Title `text-xl md:text-2xl`. Tile label `text-[0.78rem] font-extrabold italic uppercase underline underline-offset-4`.
- **Spacing:** Label `mt-3`. Section `py-10 md:py-14 border-t border-border`.
- **Hover/animation:** Image scales `group-hover:scale-[1.03] transition-transform duration-700` inside `overflow-hidden`.
- **Repeatable blocks:** `category` block — fields: image, label, link. Min 2, max 6, default 4.
- **Schema settings:** `title` (text), `columns_desktop` (range 2–6, default 4).
- **Editor notes:** Block-driven. Don't allow text styling overrides.

---

### Section 9 — Lookbook Grid

- **Section name:** Lookbook — Seen in the Sun
- **Component / file:** `src/components/site/LookbookGrid.tsx` → `sections/lookbook-grid.liquid`
- **Visual:** Title left + "Shop the Look" link right. Below: 4 portrait tiles in a row, each with caption overlaid bottom-left in white italic uppercase.
- **Desktop layout:** `grid-cols-4 gap-4`. Tiles 3:4.
- **Mobile layout:** `grid-cols-2 gap-3`.
- **Copy:** Title `Seen in the Sun`. Right link `Shop the Look`. Tile captions: `Marrakech No. 01`, `Capri No. 02`, `Mykonos No. 03`, `Riviera No. 04`.
- **Images:** 4 placeholders, 3:4. Lifestyle/editorial.
- **Buttons / links:** Right link → `/collections/lookbook`. Each tile → optional URL (product, collection, or article).
- **Colours:** Caption is `text-paper` over the image (no gradient overlay — relies on darker imagery; consider adding subtle bottom gradient when shipping with real photos).
- **Typography:** Title `text-xl md:text-2xl`. Caption `text-[0.7rem] font-extrabold italic uppercase`.
- **Spacing:** Caption positioned `absolute left-3 bottom-3`. Section `py-10 md:py-14 border-t border-border`.
- **Hover/animation:** Same `scale-[1.03]` 700ms transform inside `overflow-hidden`.
- **Repeatable blocks:** `lookbook_tile` block — image, caption, link. Min 3, max 8, default 4.
- **Schema settings:** `title`, `cta_label`, `cta_link`, `columns_desktop` (default 4).
- **Editor notes:** Captions optional per tile.

---

### Section 10 — Category Cards (Editorial 4-up)

- **Section name:** Editorial Category Cards
- **Component / file:** `src/components/site/CategoryCards.tsx` → `sections/editorial-cards.liquid`
- **Visual:** 4 vertical cards side by side. Each = 4:5 image then below-image text stack: bold italic uppercase title, body paragraph, underlined italic CTA.
- **Desktop layout:** `grid-cols-4 gap-4`.
- **Mobile layout:** `grid-cols-1 gap-3`.
- **Copy / data array (verbatim):**

```ts
const cards = [
  { title: "Ya Omri Beach Club",
    body:  "Statement bikinis, sculpted one pieces and resort essentials designed for golden-hour escapes.",
    cta:   "Shop Swimwear" },
  { title: "Resortwear Edit",
    body:  "Refined cover-ups, kaftans and slip dresses that move effortlessly from poolside to dinner.",
    cta:   "Shop Resort" },
  { title: "Wedding & Honeymoon",
    body:  "Curated bridal swim and resort pieces for getaways, ceremonies and the days that follow.",
    cta:   "Shop The Edit" },
  { title: "Limited Drops",
    body:  "Small-batch capsules in seasonal palettes — released in limited quantities, never restocked.",
    cta:   "Shop New In" },
];
```

- **Images:** 4 placeholders, 4:5.
- **Buttons / links:** One CTA per card → collection.
- **Colours:** Standard.
- **Typography:** Title `text-base md:text-lg` (italic uppercase via global h3). Body `text-sm text-muted-foreground leading-relaxed`. CTA `text-xs font-extrabold italic uppercase underline underline-offset-4`.
- **Spacing:** Text block `pt-4`. Body `mt-2`. CTA `mt-3`.
- **Hover/animation:** None.
- **Repeatable blocks:** `card` block — image, title, body, cta_label, cta_link. Min 2, max 6, default 4.
- **Schema settings:** `columns_desktop` (range 2–6, default 4).
- **Editor notes:** Pure block-driven content section.

---

### Section 11 — SEO Text

- **Section name:** SEO Text
- **Component / file:** `src/components/site/SeoText.tsx` → `sections/seo-text.liquid`
- **Visual:** Plain white section with 3 stacked heading + paragraph pairs. Headings italic uppercase, body muted.
- **Desktop layout:** Container `max-w-[1500px] px-6`, content blocks `max-w-4xl`. Vertical rhythm `space-y-8`.
- **Mobile layout:** Same, single column.
- **Copy:**
  1. `Luxury Swimwear & Resortwear` — *Ya Omri designs elevated swimwear and resortwear for women who travel well. From sculpted bikinis and refined one pieces to fluid cover-ups and easy slip dresses, every piece is cut, draped and finished to feel effortless from poolside to dinner.*
  2. `Built for sun-drenched escapes` — *Our fabrics are chosen for hand-feel, recovery and longevity. Premium Italian lycra, soft-touch linings and warm tonal palettes — ivory, sand, espresso, deep noir — make Ya Omri swimwear at home in Mykonos, Marrakech, Capri or the Maldives.*
  3. `Resortwear, redefined` — *Beyond swimwear, the Ya Omri resort collection brings together sheer kaftans, sculpted dresses and tailored separates. Considered silhouettes and quiet detailing make each piece an effortless layer for long lunches, private villas and late summer evenings.*
- **Images:** None.
- **Buttons / links:** None.
- **Colours:** Paper background, headings ink, body muted-foreground.
- **Typography:** First heading h2 (`text-xl md:text-2xl`), other two h3 (`text-base md:text-lg`). Body `text-sm leading-relaxed`.
- **Spacing:** `py-12 md:py-16 border-t border-border`. Body paragraph `mt-3`.
- **Hover/animation:** None.
- **Repeatable blocks:** `seo_block` — heading + richtext body. Min 1, max 6, default 3.
- **Schema settings:** None beyond blocks.
- **Editor notes:** SEO copy is owned by marketing — keep fully editable.

---

### Section 12 — Footer

- **Section name:** Footer (with Newsletter band)
- **Component / file:** `src/components/site/Footer.tsx` → override Dawn `sections/footer.liquid`
- **Visual:** Dark ink background covering full footer. Two horizontal bands inside: (a) Newsletter band — left: eyebrow + large italic uppercase headline + supporting copy; right: inline email input + Join button. (b) Main columns band — 2-col logo cluster + 3 link columns. (c) Bottom legal bar — copyright left, policy links + locale right.
- **Desktop layout:** Bands separated by `border-b border-paper/15`. Main grid `grid-cols-5 gap-10`, logo cluster spans 2.
- **Mobile layout:** Newsletter stacks vertically. Columns drop to `grid-cols-2`. Legal bar stacks.
- **Copy:**
  - Eyebrow: `The Private List`
  - Headline: `Your next escape starts here`
  - Body: `Be the first to discover new drops, curated edits and limited seasonal pieces.`
  - Email placeholder: `Email address`
  - Button: `Join the List`
  - Brand caption: `Luxury swimwear and resortwear, designed in Dubai for sun-drenched escapes around the world.`
  - Column titles + links:
    - **Shop:** New In, Bikinis, One Pieces, Cover-Ups, Resortwear, Best Sellers
    - **Help:** Contact Us, Shipping, Returns, Size Guide, Track Order, FAQ
    - **About:** Our Story, Sustainability, Journal, Stockists, Careers, Press
  - Legal: `© 2026 Ya Omri Swimwear — Dubai` + `Privacy`, `Terms`, `Cookies`, `AE — AED`
- **Images:** Logo (rendered white via `invert brightness-0`).
- **Buttons / links:** Newsletter posts to Shopify customer signup. Each link maps to a real route.
- **Colours:** `bg-ink text-paper`. Inputs transparent with `border-paper/40`, focus `border-paper`. Button `bg-paper text-ink`. Muted text uses `text-paper/70`. Dividers `border-paper/15`.
- **Typography:** Newsletter headline `text-3xl md:text-4xl`. Column titles `text-[0.75rem] font-extrabold italic uppercase`. Link list `text-sm`. Legal `text-[0.7rem] uppercase tracking-wider text-paper/60`.
- **Spacing:** Newsletter band `py-12 md:py-16`. Main columns `py-14`. Legal `py-5`.
- **Hover/animation:** Link hover `hover:text-paper`.
- **Repeatable blocks:** `footer_column` block (title + linklist picker). Allow 2–5 columns. `social_link` block (icon type + url). Newsletter is a fixed sub-section.
- **Schema settings:**
  - `newsletter_eyebrow`, `newsletter_heading`, `newsletter_body`, `newsletter_form_id`
  - `brand_caption` (textarea)
  - `legal_copyright` (text)
  - `locale_label` (text)
  - Policy link pickers (Privacy, Terms, Cookies)
  - Social icon blocks
- **Editor notes:** Newsletter signup must wire to Shopify's `<form action="/contact" method="post">` newsletter endpoint, not a third-party.

---

## 2. Full React component tree (for orientation)

```
src/routes/index.tsx
└── <Home>
    ├── <Header>
    ├── <main>
    │   ├── <HeroSection>
    │   ├── <BrandStrip>
    │   ├── <ProductCarousel title="New In — Swimwear" ... />
    │   ├── <ProductCarousel title="Best Sellers" ... />
    │   ├── <PromoBanner ... />
    │   ├── <ProductCarousel title="Shop Resortwear" ... />
    │   ├── <CategoryRow>
    │   ├── <LookbookGrid>
    │   ├── <CategoryCards>
    │   └── <SeoText>
    └── <Footer>

Shared:
- <Placeholder label ratio className />  (Dawn: replace with image rendering)
```

## 3. Tailwind class reference (most-used utility patterns)

| Pattern | Tailwind classes | Notes |
|---|---|---|
| Section wrap | `py-10 md:py-14 border-t border-border` | All non-hero sections |
| Container | `mx-auto max-w-[1500px] px-4 lg:px-6` | Every section |
| Section header row | `flex items-end justify-between mb-5` | Title left, action right |
| Section title | `text-xl md:text-2xl` (h2 inherits italic uppercase) | |
| Eyebrow | `eyebrow` (custom class) | Defined in CSS above |
| Primary CTA on dark | `bg-paper text-ink px-5 py-3 text-xs font-extrabold italic uppercase hover:bg-sand transition-colors` | Hero/Promo |
| Outline CTA on dark | `border border-paper text-paper px-5 py-3 text-xs font-extrabold italic uppercase hover:bg-paper hover:text-ink transition-colors` | Hero/Promo |
| Primary CTA on light | `bg-ink text-paper px-5 py-3 text-xs font-extrabold italic uppercase` | |
| Card image | `placeholder-img w-full` + `ratio="4/5"` | Use `style={{aspectRatio:'4/5'}}` |
| Card text block | `mt-3 space-y-0.5` | Product cards |
| Square nav button | `h-9 w-9 border border-border flex items-center justify-center hover:bg-secondary` | Carousel arrows |
| Tile zoom on hover | `transition-transform duration-700 group-hover:scale-[1.03]` inside `overflow-hidden` parent | Category/Lookbook |
| Underline link | `underline underline-offset-4` | Editorial CTAs |

## 4. Section-by-section rebuild order for Dawn

Do them in this order so each new section can be previewed in the theme editor without depending on later ones:

1. **Global tokens & typography** — drop colour CSS vars + Inter font into `assets/base.css`. Confirm Dawn colour schemes don't override (set scheme `paper` with bg `#fff` text `#1a1a1a`, scheme `ink` with bg `#1a1a1a` text `#fff`).
2. **Header + Announcement** (`sections/header.liquid` override).
3. **Footer + Newsletter** (`sections/footer.liquid` override). Doing header + footer first locks the chrome.
4. **Brand Strip** (`sections/brand-strip.liquid`) — quick win, validates block schema patterns.
5. **Hero Triple** (`sections/hero-triple.liquid`).
6. **Product Carousel** (`sections/product-carousel.liquid`) — build once, add three times in `templates/index.json`.
7. **Promo Banner** (`sections/promo-banner.liquid`).
8. **Category Row** (`sections/category-row.liquid`).
9. **Lookbook Grid** (`sections/lookbook-grid.liquid`).
10. **Editorial Category Cards** (`sections/editorial-cards.liquid`).
11. **SEO Text** (`sections/seo-text.liquid`).
12. **Assemble `templates/index.json`** in the order above.

## 5. What must be editable in the theme editor (summary)

| Section | Editable | Locked |
|---|---|---|
| Header | logo, announcement, nav menu, country toggle, wishlist toggle | Icon set, layout |
| Hero | each tile image, copy, 2 CTAs per tile, tile heights | Number of CTAs (max 2), text position |
| Brand Strip | each statement (block), colours, padding | Typography |
| Product Carousel | title, count label, collection, limit, wishlist toggle, arrow toggle, new-tag toggle | Card layout, hover behaviour |
| Promo Banner | image, eyebrow, title, body, 2 CTAs, invert toggle, heights | Composition |
| Category Row | section title, each tile (image, label, link), columns | Hover, typography |
| Lookbook | title, right CTA, each tile (image, caption, link), columns | Hover, typography |
| Editorial Cards | each card (image, title, body, CTA), columns | Layout |
| SEO Text | each heading+richtext block | Layout |
| Footer | newsletter texts + form, brand caption, columns + linklists, social icons, legal copy, policy links | Visual layout |

## 6. Notes for Codex (rebuild assistant)

- Do **not** introduce any border-radius — design is intentionally hard-cornered.
- Do **not** introduce coloured accents — palette is paper / ink / sand only.
- Italic uppercase is a **brand mark** — applied to every heading and CTA. Don't normalise it away.
- Hover behaviour is intentionally minimal: underline grows on nav, image scales 3 % on category/lookbook tiles, heart fades in on product card, button bg shifts. Don't add fades or parallax.
- Image placeholders (`.placeholder-img`) exist only in the prototype. In Dawn replace the entire `<div data-label="...">` with `{{ image | image_url: width: 1500 | image_tag }}` keeping the same width/aspect-ratio wrapper.
- All copy in this doc is the prototype's source of truth — copy/paste into Liquid `default` schema values so a fresh install renders identically before merchant edits.