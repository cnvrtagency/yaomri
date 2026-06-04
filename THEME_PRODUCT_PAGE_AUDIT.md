# THEME_PRODUCT_PAGE_AUDIT

## Scope and method

This is a static audit of the current product page system in `yaomri-kalles-edit`.

Constraints followed:
- Audit only
- No theme source edits
- Evidence files used first
- Only product-page-relevant source files inspected after evidence review

Primary evidence used:
- `theme-audit-data/template-section-map.txt`
- `theme-audit-data/section-render-map.txt`
- `theme-audit-data/snippet-reference-counts.txt`
- `theme-audit-data/asset-load-map.txt`
- `theme-audit-data/key-selector-hits.txt`
- `theme-audit-data/js-keyword-file-map.txt`

Primary source files inspected:
- `templates/product.json`
- `templates/product.a-configs.json`
- `templates/product.amalfi-product.json`
- `templates/product.complementary-products.json`
- `templates/product.options-customizer.json`
- `templates/product.products-with-extra-image.json`
- `sections/main-product.liquid`
- `sections/featured-product.liquid`
- `sections/product-recommendations.liquid`
- `sections/recently_viewed.liquid`
- `sections/sidebar-product.liquid`
- `snippets/product-price.liquid`
- `snippets/product-price-single.liquid`
- `snippets/product-img.liquid`
- `snippets/product-img-with-video.liquid`
- `snippets/product-atc.liquid`
- `snippets/product-size.liquid`
- `snippets/product-countdown.liquid`
- `snippets/product-rating.liquid`
- `snippets/social_sharing.liquid`
- `snippets/product-thumbnail.liquid`
- `snippets/product_tabs.liquid`
- `snippets/product-form.liquid`
- `snippets/grouped-form.liquid`
- `assets/main-product.css`
- `assets/product-tabs.css`
- `assets/pickup-availability.css`
- `assets/qs-product.css`
- `assets/qv-product.css`
- `assets/product-360.css`
- product-page-related JS ownership from `theme-audit-data/js-keyword-file-map.txt`

Where exact runtime ownership could not be proven from static minified search, this document marks it as `unknown from static search`.

---

## 1. Product page architecture overview

### Route and template ownership

The product route is Shopify product-page driven and maps into JSON templates under `templates/`.

Confirmed product-facing templates:
- `templates/product.json`
- `templates/product.amalfi-product.json`
- `templates/product.complementary-products.json`
- `templates/product.options-customizer.json`
- `templates/product.products-with-extra-image.json`
- `templates/product.a-configs.json`

Important distinction:
- `product.json`, `product.amalfi-product.json`, `product.complementary-products.json`, `product.options-customizer.json`, and `product.products-with-extra-image.json` are storefront product-page templates.
- `product.a-configs.json` is product-adjacent configuration for quick view / quick shop sections (`main-qv`, `main-qs`), not a normal product page route template.

### Main section ownership

The core product-page owner is:
- `sections/main-product.liquid`

This is the primary section that owns:
- product media layout
- product info column
- variant state wiring
- price rendering
- product form
- add to cart state
- sticky info behavior
- tab / accordion content system
- grouped product mode
- size guide capture
- custom badge / external link / pickup-related flags

Supporting route-level sections commonly attached after the main product section:
- `sections/sidebar-product.liquid`
- `sections/product-recommendations.liquid`
- `sections/recently_viewed.liquid`
- `sections/featured-collection.liquid`
- `sections/image-gallery.liquid`
- `sections/apps` section via template

### Snippet layering

The product page is not monolithic. `main-product.liquid` delegates heavily into snippets. The important split is:

- Section-level orchestration:
  - `sections/main-product.liquid`
  - `sections/featured-product.liquid`
  - `sections/product-recommendations.liquid`
  - `sections/recently_viewed.liquid`
  - `sections/sidebar-product.liquid`

- Snippet-level rendering:
  - media: `product-thumbnail`, `product-img`, `product-img-with-video`, `product-360`
  - price: `product-price`, `product-price-single`
  - form: `product-form`, `grouped-form`, `frm_properties`
  - content blocks: `product_tabs`, `product-rating`, `product-countdown`, `product-size`, `social_sharing`

### CSS/JS fit

Product page rendering depends on a mixed asset model:

- route/section assets:
  - `assets/main-product.css`
  - `assets/product-tabs.css`
  - `assets/pickup-availability.css`
  - `assets/product-360.css`
  - `assets/qs-product.css`
  - `assets/qv-product.css`

- global/shared JS runtime:
  - `assets/theme.min.js`
  - `assets/global.min.js`
  - `assets/t4s_zoom.min.js`
  - `assets/threesixty.min.js`
  - `assets/pswp.min.js`
  - `assets/custom.js`

High-level architecture summary:
- Liquid owns structure, data attributes, and Theme Editor-driven block rendering.
- CSS owns layout, sticky behavior, gallery geometry, form/button presentation, and responsive behavior.
- JS ownership for variant/media/add-to-cart behavior is mostly centralized in minified theme runtime, with a few specialized product/media assets.

---

## 2. Product template map

## `templates/product.json`

- Likely default product template
- Section order from `template-section-map.txt`:
  1. `brc-nav-product`
  2. `main-product`
  3. `custom-liquid`
  4. `custom-liquid`
  5. `sidebar-product`
  6. `image-gallery`
  7. `product-recommendations`
  8. `featured-collection`
  9. `recently_viewed`
  10. `apps`
- Important section/settings:
  - uses `main-product` as the primary PDP owner
  - includes extra merchandising and app surface below main product
- Likely use case:
  - default PDP with sidebar content, gallery section, recommendations, merchandising, and app inserts
- Risk level:
  - High
  - This template binds multiple downstream sections and app blocks; template edits can affect the default storefront PDP immediately

## `templates/product.amalfi-product.json`

- Product-specific alternative template
- Section order:
  1. `brc-nav-product`
  2. `main-product`
  3. `sidebar-product`
  4. `product-recommendations`
  5. `logo_list`
  6. `featured-collection`
  7. `recently_viewed`
- Important settings observed from static inspection:
  - `enable_sticky_info: true`
  - `media_layout: thumbnails_left`
  - `main_click: zoom`
  - `zoom_tp: external`
  - `enable_zoom_click_mb: true`
  - tabs configured as accordion variants
  - content blocks include shipping / returns-style HTML tabs
  - app blocks present for Loox, Kiwi sizing, Tabby
- Likely use case:
  - branded or campaign-specific PDP with more curated below-the-fold merchandising
- Risk level:
  - High
  - Contains product-specific experience decisions and app block dependencies

## `templates/product.complementary-products.json`

- Alternative template with complementary / support content
- Section order:
  1. `brc-nav-product`
  2. `main-product`
  3. `sidebar-product`
  4. `product-recommendations`
  5. `recently_viewed`
- Important settings observed:
  - includes `complimentary_products` block
  - includes `img` trust-badge style block
  - includes `size_delivery_ask`
  - includes `meta`, `tab_des`, `tab_add`, `tab_html`
- Likely use case:
  - PDP with complementary product merchandising and extra support/trust content
- Risk level:
  - High
  - Changes here affect upsell/support content logic and block combinations

## `templates/product.options-customizer.json`

- Customization-heavy product template
- Section order:
  - centered on `main-product`
  - includes supporting PDP sections
- Important settings observed:
  - includes `properties` blocks for custom personalization/custom product fields
  - includes `social` block and multiple tab/content blocks
- Likely use case:
  - products requiring extra customer inputs or personalization
- Risk level:
  - Very high
  - Product form customization changes can break line item properties or orderability

## `templates/product.products-with-extra-image.json`

- Product template variant with additional gallery content
- Section order:
  1. `brc-nav-product`
  2. `main-product`
  3. `sidebar-product`
  4. `image-gallery`
  5. `product-recommendations`
  6. `featured-collection`
  7. `recently_viewed`
  8. `apps`
- Important settings observed:
  - similar PDP settings to the Amalfi variant
  - extra image-gallery section below the main PDP
  - app blocks present
- Likely use case:
  - products needing richer editorial gallery content below the main PDP
- Risk level:
  - High
  - Adds media-heavy merchandising and app surfaces to the default PDP flow

## `templates/product.a-configs.json`

- Product-adjacent config template
- Section order:
  - `main-qv`
  - `main-qs`
- Likely use case:
  - quick view / quick shop configuration, not a standard PDP
- Risk level:
  - Medium for PDP redesign work
  - High for quick view / quick shop work
- Note:
  - treat this as a separate surface when redesigning the main PDP

---

## 3. Main product section audit

File:
- `sections/main-product.liquid`

### Purpose

This is the core PDP orchestrator. It builds the main two-column product experience, variant state payload, media gallery, form area, content blocks, sticky behavior, and specialized product modes.

### Wrapper classes and selectors

Confirmed structural selectors from static inspection and CSS hits:
- `.t4s-main-product__content`
- `.t4s-row__product`
- `.t4s-product__media`
- `.t4s-product__info-wrapper`
- `.t4s-product__info-container`
- `.t4s-product-form__buttons`

Important note:
- `assets/main-product.css` is tightly coupled to these wrappers. Any redesign must audit both Liquid markup and CSS selector ownership together.

### Key Liquid variables

Confirmed important assigns:
- `se_stts = section.settings`
- `current_variant`
- `isProductAvailable`
- `remove_soldout`
- `PR_no_pick`
- `ntsoldout`
- `unvariants`
- `ck_so_un`
- `meta_theme = product.metafields.theme`
- `meta_meta = product.metafields.meta`
- `custom_badge`
- `external_title`
- `external_link`
- `block_form`
- `isGrouped`
- `media_layout`
- `variant_images`
- `canMedia_group`
- `has_media_360`
- `enable_sticky_info`
- `sticky_mode`
- `isSticky`
- `isStickyMB`
- `html_sizeg`
- `html_price`

### Key snippets rendered

Confirmed direct/critical snippet relationships:
- `product-price-single`
- `product-thumbnail`
- `product-360`
- `product-btns`
- `product-form`
- `grouped-form` when grouped products are enabled
- `product_tabs`
- `product-rating`
- `product-size`
- `social_sharing`
- `product-countdown`

### Block types and section schema behavior

Confirmed block families from template evidence and snippet usage:
- `form`
- `inventory_qty`
- `tab_des`
- `tab_html`
- `tab_add`
- `tab_rivui`
- `tab_liquid`
- `meta`
- `img`
- `size_delivery_ask`
- `complimentary_products`
- `properties`
- `social`
- app blocks from Shopify app extensions

Observed implication:
- the section is designed to be block-driven in Theme Editor rather than hardcoded to one PDP structure

### Product form ownership

Primary product form ownership is within:
- `snippets/product-form.liquid`
- `snippets/grouped-form.liquid` for grouped products

`main-product.liquid` decides:
- whether grouped mode applies
- which form path to render
- which product/variant state and product JSON payload is attached

### Media/gallery ownership

`main-product.liquid` owns:
- media layout selection
- gallery wrapper structure
- thumbnails placement
- grouped media gating
- 360 media flagging
- zoom-related data flags

### Variant picker ownership

Variant picker rendering is owned by:
- `snippets/product-form.liquid`
- `snippets/product-size.liquid`

But the state payload/config is assembled in:
- `sections/main-product.liquid`

### Price / ATC ownership

Price:
- dynamic PDP price is owned by `snippets/product-price-single.liquid`

ATC:
- main PDP ATC is inside `snippets/product-form.liquid`
- `snippets/product-atc.liquid` is a separate helper surface for cards/listing/quickshop-style actions, not the primary PDP form owner

### Tabs / accordion ownership

Tabs/accordion content is orchestrated by:
- `sections/main-product.liquid`
- `snippets/product_tabs.liquid`

Observed section settings:
- `tabs_design`
- `tabs_design_mb`
- `tabs_position`
- `enable_first_tab`

### App block handling

App blocks are present in product templates and need to be treated as first-class PDP content.

Observed app integrations in product templates:
- Loox
- Kiwi sizing / size chart
- Tabby pay later

### Risk level

Very high.

Reasons:
- owns variant state and form behavior
- owns media state payload
- drives sticky info and mobile/desktop layout
- contains multiple conditional product modes
- interacts with app blocks and tabbed content

### What to inspect before editing

- exact media markup and thumbnail structure in `main-product.liquid`
- `snippets/product-form.liquid`
- `snippets/grouped-form.liquid`
- `snippets/product-price-single.liquid`
- `snippets/product-thumbnail.liquid`
- `assets/main-product.css`
- `assets/theme.min.js` product handlers
- template JSON block combinations for the target product template

---

## 4. Product media/gallery system

### Core rendering pieces

Confirmed media-related snippets:
- `snippets/product-thumbnail.liquid`
- `snippets/product-img.liquid`
- `snippets/product-img-with-video.liquid`
- `snippets/product-360.liquid`

### Supported media types

Confirmed or strongly evidenced:
- images
- video via `product-img-with-video.liquid`
- 360 media via alt-tag flag `break--360` and `product-360`
- zoom/lightbox behavior from loaded assets

3D model support:
- unknown from static search

### Layout modes

Confirmed in `main-product.liquid`:
- `no_media_size`
- `one_media_size`
- `thumbnails_left`
- `thumbnails_bottom`
- `thumbnails_right`
- `without_thumbnails`
- `one_column`
- `two_columns`
- `combined_grid`

### Thumbnails

Owned by:
- `snippets/product-thumbnail.liquid`
- `assets/main-product.css`

### Zoom / lightbox

Confirmed dependencies:
- `assets/t4s_zoom.min.js`
- `assets/pswp.min.js`

Observed settings in templates/main section:
- `main_click: zoom`
- `zoom_tp: external`
- `enable_zoom_click_mb: true`

### Slider/carousel dependencies

Confirmed CSS dependencies:
- `pre_flickityt4s.min.css`
- `slider-settings.css`

Exact JS slider owner:
- likely in `assets/theme.min.js`
- unknown from static search at function level

### Media grouping / variant image behavior

Observed flags:
- `variant_images`
- `canMedia_group`
- `changeVariantByImg`

Implication:
- gallery state likely updates when variants change and may support grouped media filtering

### Mobile behavior

Strongly coupled to:
- `assets/main-product.css`
- zoom flags for mobile
- thumbnail position settings

Exact swipe/media event ownership:
- unknown from static search

### CSS/JS dependencies

CSS:
- `assets/main-product.css`
- `assets/product-360.css`
- `pre_flickityt4s.min.css`
- `slider-settings.css`

JS:
- `assets/theme.min.js`
- `assets/t4s_zoom.min.js`
- `assets/threesixty.min.js`
- `assets/pswp.min.js`

### Risk notes

High risk.

Why:
- media layout, variant synchronization, zoom, and mobile behavior are interdependent
- gallery redesigns often affect variant switching and sticky layout geometry
- minified JS ownership makes exact change impact harder to reason about statically

---

## 5. Product information/layout system

### Title

Owned by main product info markup and styled by `assets/main-product.css`.

### Vendor / SKU

Vendor styling selectors appear in `main-product.css`, including vendor pill-like styling.
SKU support is likely block/setting driven, but exact current output path is not fully confirmed from static excerpt.

### Reviews / rating

Rating snippet:
- `snippets/product-rating.liquid`

Observed review app support:
- Shopify reviews
- Ryviu
- Loox
- Judge.me
- SSW
- SCM
- other app-switch logic in snippet

### Price

PDP price owner:
- `snippets/product-price-single.liquid`

Handles:
- compare-at pricing
- sale presentation
- unit price
- price varies state
- no-pick variant state

### Badges / sale / compare price

Observed:
- custom badges can be driven by metafields / section logic
- sale price presentation handled in price snippet
- main section data payload includes badge arrays and price fields

### Description

Description appears in tab/accordion system rather than only as a flat inline block on all templates.

### Variant options

Owned by:
- `snippets/product-form.liquid`
- `snippets/product-size.liquid`

Patterns observed:
- swatches
- dropdowns
- size-style chips
- sold-out state classes

### Size guide

Observed:
- size guide HTML is captured into `html_sizeg`
- form snippet injects size guide affordance into option titles when configured
- Kiwi sizing app blocks also appear in some templates

### Quantity

Owned inside product form / grouped form flow.
Styled by `assets/main-product.css`.
Exact JS quantity logic owner:
- likely `assets/theme.min.js`
- unknown from static search at function level

### Add to cart / dynamic checkout / buy buttons

Owned by:
- `snippets/product-form.liquid`
- `snippets/grouped-form.liquid`

Observed:
- ATC submit button
- dynamic checkout button classes
- wishlist/compare alongside buttons
- unavailable / sold out / incoming inventory states

### Pickup / shipping / trust blocks

Confirmed product-page-related CSS:
- `assets/pickup-availability.css`

Observed in templates/blocks:
- shipping / returns style `tab_html` content
- `size_delivery_ask`
- trust-badge image block

Pickup section / snippet exact render path:
- `sections/pickup-availability.liquid` appears in selector evidence
- exact PDP include path should be rechecked before editing pickup behavior

### Social sharing

Owned by:
- `snippets/social_sharing.liquid`

### General layout ownership

Layout relationship is:
- media column and info column structure in `main-product.liquid`
- actual responsive/sticky geometry in `assets/main-product.css`

---

## 6. Product form and variant system

### Core form files

Primary files:
- `snippets/product-form.liquid`
- `snippets/grouped-form.liquid`

### Form markup

Observed in `product-form.liquid`:
- swatch and dropdown option rendering
- line-item properties support through `frm_properties`
- gift card recipient form support
- `.t4s-product-form__buttons`
- ATC submit button
- wishlist/compare block
- dynamic checkout path
- incoming inventory messaging

### Variant picker markup

Observed picker patterns:
- `data-swatch-option`
- `data-swatch-item`
- `data-dropdown-open`
- size-chip rendering via `product-size`

### Hidden inputs / JSON / data payload

`main-product.liquid` outputs a structured `data-product-featured` payload including:
- product id
- section id
- form id
- sticky flags
- variant/media flags
- soldout/unavailable flags
- zoom/media flags
- grouped product flags
- price/badge/date fields

This is a high-signal integration point for JS-driven behavior.

### Unavailable / sold out states

Confirmed logic flags:
- `ntsoldout`
- `unvariants`
- `ck_so_un`
- `remove_soldout`
- `PR_no_pick`

### Add-to-cart behavior

Exact JS event implementation:
- likely `assets/theme.min.js`
- unknown from static search at function level

Relevant runtime relationship:
- add-to-cart likely integrates with cart drawer behavior owned by global theme runtime

### Cart drawer relationship

Strongly likely:
- PDP ATC updates the Kalles mini-cart / cart drawer

Exact handler path:
- unknown from static search

### What could break ATC / variants

High-risk change areas:
- form markup shape
- variant selector data attributes
- hidden input names/ids
- `data-product-featured` payload
- grouped product mode conditionals
- button wrappers and dynamic checkout block

---

## 7. Product tabs / accordions / content blocks

### Core files

- `snippets/product_tabs.liquid`
- `assets/product-tabs.css`
- `sections/main-product.liquid`

### Block/content types observed

Confirmed from section/template evidence:
- `tab_des`
- `tab_html`
- `tab_add`
- `tab_rivui`
- `tab_liquid`
- `meta`
- `properties`
- app blocks

### Content sources

Observed / likely sources:
- product description
- admin-authored HTML blocks
- additional info content
- review tab integrations
- custom Liquid blocks
- metafield-driven blocks
- personalization/custom property content

### Metafields

Observed in main section:
- `product.metafields.meta`
- `product.metafields.theme`

Exact tab-to-metafield mapping:
- partially evidenced
- unknown from static search in full detail

### App/custom Liquid handling

The PDP supports:
- app blocks in template JSON
- custom liquid blocks in templates

This means future custom product information sections can be added safely if they are isolated as:
- a new block type inside `main-product.liquid`, or
- a new section below the main product section in template JSON

Safer future pattern:
- add new product information surfaces below `main-product` first, before altering the main form/info block internals

---

## 8. Product page CSS map

### Core CSS files

Primary product CSS owners:
- `assets/main-product.css`
- `assets/product-tabs.css`
- `assets/pickup-availability.css`
- `assets/product-360.css`

Adjacent product surfaces:
- `assets/qs-product.css`
- `assets/qv-product.css`

### What each file appears to own

## `assets/main-product.css`

High-confidence ownership:
- PDP grid/layout
- media/info column geometry
- thumbnail states
- sticky info behavior
- title/vendor/price/meta styling
- inventory progress / status
- ATC / quantity / dynamic checkout styling
- wishlist/compare buttons
- media buttons and overlays
- mobile adjustments

This is the highest-risk styling file for PDP redesign.

## `assets/product-tabs.css`

Owns:
- tab / accordion presentation
- potentially tab slider/carousel presentation where used

## `assets/pickup-availability.css`

Owns:
- pickup availability / pickup widget styling

## `assets/product-360.css`

Owns:
- 360-viewer-specific controls and layout

## `assets/qs-product.css`

Owns:
- quick shop styling, not primary full PDP

## `assets/qv-product.css`

Owns:
- quick view styling, not primary full PDP

### Important selectors / layout behavior

High-signal selectors seen in product CSS/search evidence:
- `.t4s-product__media`
- `.t4s-product__info-container`
- `.t4s-product-form__buttons`
- thumbnail active/placement selectors
- sticky info selectors
- pickup availability selectors

### Sticky areas

Confirmed settings:
- `enable_sticky_info`
- `sticky_mode`

Sticky behavior styling is heavily coupled to `assets/main-product.css` and runtime config payload in `main-product.liquid`.

### Mobile breakpoints

Product CSS is responsive and includes mobile-specific media/info behavior. Exact breakpoint inventory is not fully enumerated in this audit because `main-product.css` is large/minified, but mobile behavior is clearly first-order.

### High-risk styling files

- `assets/main-product.css`
- `assets/product-tabs.css`
- `assets/pickup-availability.css`

### What to inspect before changing design

- `sections/main-product.liquid`
- `assets/main-product.css`
- `snippets/product_tabs.liquid`
- `assets/product-tabs.css`
- template JSON for the target product template

---

## 9. Product page JS / dependency map

### High-confidence product JS files

From evidence files and targeted grep:
- `assets/theme.min.js`
- `assets/global.min.js`
- `assets/t4s_zoom.min.js`
- `assets/threesixty.min.js`
- `assets/pswp.min.js`
- `assets/custom.js`

### Variant JS

Most likely owner:
- `assets/theme.min.js`

Supporting evidence:
- product payload is emitted in `main-product.liquid`
- global theme runtime is loaded on product pages
- explicit product-form data attributes align with theme runtime patterns

Exact function names and event flow:
- unknown from static minified search

### Media/gallery JS

Likely owners:
- `assets/theme.min.js`
- `assets/t4s_zoom.min.js`
- `assets/pswp.min.js`
- `assets/threesixty.min.js`

### Zoom / lightbox JS

Confirmed specialized files:
- `assets/t4s_zoom.min.js`
- `assets/pswp.min.js`

### Carousel / slider JS

Likely owner:
- `assets/theme.min.js`

CSS evidence:
- Flickity-related CSS assets are loaded for product media/tab/recommendation sections

### Add-to-cart / cart drawer JS

Likely owners:
- `assets/theme.min.js`
- `assets/global.min.js`

Exact mini-cart update path:
- unknown from static search

### Quantity selector JS

Likely owner:
- `assets/theme.min.js`

### Pickup / app scripts

Pickup styling is clearly present.
Exact pickup runtime path and app-block script ownership are not fully confirmed from static search.

### High-risk JS files

- `assets/theme.min.js`
- `assets/global.min.js`
- `assets/t4s_zoom.min.js`
- `assets/threesixty.min.js`

### What to test after edits

- variant switching
- sold out state transitions
- media/thumbnail sync
- zoom/lightbox
- grouped product mode if used
- ATC and cart drawer update
- dynamic checkout visibility
- mobile gallery interactions

---

## 10. Apps / integrations

Observed or strongly evidenced on product pages:

### Reviews

- Loox app blocks observed in product templates
- `snippets/product-rating.liquid` supports multiple review systems including Loox, Judge.me, Ryviu, SSW, SCM, and Shopify reviews

### Wishlist

- wishlist / compare controls are rendered in product form button area
- exact wishlist app/runtime owner is theme-specific and should be verified before redesigning those controls

### Subscriptions

- unknown from static search

### Size guide

- Kiwi size chart app block observed in templates
- native size guide capture also exists through product form / `html_sizeg`

### Recommendations / upsell / cross-sell

- `sections/product-recommendations.liquid`
- `sections/recently_viewed.liquid`
- complementary products block observed in template

### Financing / payment messaging

- Tabby pay-later app block observed in product templates

### Custom apps

- `apps` section is present in some product templates
- exact app mix is template-specific and should be rechecked on the live theme before redesigning template order

---

## 11. Current limitations / opportunities

## Opportunity: redesign overall PDP layout

- Likely files:
  - `sections/main-product.liquid`
  - `assets/main-product.css`
  - target `templates/product*.json`
- Risk:
  - High
- Change type:
  - Liquid + CSS

## Opportunity: cleaner product media gallery

- Likely files:
  - `sections/main-product.liquid`
  - `snippets/product-thumbnail.liquid`
  - `snippets/product-img.liquid`
  - `snippets/product-img-with-video.liquid`
  - `assets/main-product.css`
  - possibly JS-involved files if behavior changes
- Risk:
  - High
- Change type:
  - Liquid + CSS, possibly JS-involved

## Opportunity: improve product info hierarchy

- Likely files:
  - `sections/main-product.liquid`
  - `snippets/product-price-single.liquid`
  - `assets/main-product.css`
- Risk:
  - Medium to high
- Change type:
  - Liquid + CSS

## Opportunity: improve ATC area

- Likely files:
  - `snippets/product-form.liquid`
  - `snippets/grouped-form.liquid`
  - `snippets/product-price-single.liquid`
  - `assets/main-product.css`
- Risk:
  - Very high
- Change type:
  - Liquid + CSS, possibly JS-sensitive

## Opportunity: better tabs / accordions

- Likely files:
  - `snippets/product_tabs.liquid`
  - `assets/product-tabs.css`
  - `sections/main-product.liquid`
- Risk:
  - Medium
- Change type:
  - Liquid + CSS

## Opportunity: trust / shipping / returns blocks

- Likely files:
  - `sections/main-product.liquid`
  - target `product*.json` templates
  - `sections/sidebar-product.liquid`
- Risk:
  - Medium
- Change type:
  - Liquid + CSS

## Opportunity: size guide improvement

- Likely files:
  - `sections/main-product.liquid`
  - `snippets/product-form.liquid`
  - app blocks in product templates
- Risk:
  - Medium to high
- Change type:
  - Liquid + CSS, with app coordination

## Opportunity: sticky add-to-cart

- Likely files:
  - `sections/main-product.liquid`
  - `snippets/product-form.liquid`
  - `assets/main-product.css`
  - likely `assets/theme.min.js` interaction review before implementation
- Risk:
  - High
- Change type:
  - Liquid + CSS, likely JS-involved

## Opportunity: better mobile PDP

- Likely files:
  - `sections/main-product.liquid`
  - `assets/main-product.css`
  - possibly media snippets
- Risk:
  - High
- Change type:
  - CSS-heavy, possibly Liquid + CSS

## Opportunity: recommendations / recently viewed improvement

- Likely files:
  - `sections/product-recommendations.liquid`
  - `sections/recently_viewed.liquid`
  - downstream product-card snippets used by those sections
- Risk:
  - Medium
- Change type:
  - Liquid + CSS

---

## 12. High-risk product page files

### `sections/main-product.liquid`

Why:
- primary PDP owner
- variant/media/form/sticky/tab orchestration
- grouped product and special-case logic

### `snippets/product-form.liquid`

Why:
- add-to-cart form, options, properties, dynamic checkout, button state

### `snippets/grouped-form.liquid`

Why:
- separate grouped-product ATC/quantity/variant behavior

### `snippets/product-price-single.liquid`

Why:
- dynamic PDP price and sale/unit-price presentation

### `snippets/product-thumbnail.liquid`

Why:
- media navigation and thumbnail/gallery structure

### `assets/main-product.css`

Why:
- primary visible PDP geometry and responsive behavior

### `assets/theme.min.js`

Why:
- likely primary owner for product interactions
- minified and high blast radius

### `assets/global.min.js`

Why:
- shared runtime dependencies can affect cart drawer/form state

### `assets/t4s_zoom.min.js`

Why:
- zoom/media behavior dependency

### `assets/threesixty.min.js`

Why:
- specialized media path with nontrivial interaction surface

---

## 13. Future implementation routing

## Redesign product page layout

Inspect first:
- `templates/product.json`
- target alternate `templates/product*.json`
- `sections/main-product.liquid`
- `assets/main-product.css`

## Change product media / gallery

Inspect first:
- `sections/main-product.liquid`
- `snippets/product-thumbnail.liquid`
- `snippets/product-img.liquid`
- `snippets/product-img-with-video.liquid`
- `assets/main-product.css`
- `assets/t4s_zoom.min.js`
- `assets/threesixty.min.js`

## Change variant picker

Inspect first:
- `snippets/product-form.liquid`
- `snippets/product-size.liquid`
- `sections/main-product.liquid`
- `assets/theme.min.js`

## Change add-to-cart area

Inspect first:
- `snippets/product-form.liquid`
- `snippets/grouped-form.liquid`
- `snippets/product-price-single.liquid`
- `assets/main-product.css`
- cart-drawer behavior in `assets/theme.min.js`

## Add sticky ATC

Inspect first:
- `sections/main-product.liquid`
- `snippets/product-form.liquid`
- `assets/main-product.css`
- `assets/theme.min.js`

## Change tabs / accordions

Inspect first:
- `snippets/product_tabs.liquid`
- `assets/product-tabs.css`
- relevant `tab_*` blocks in `sections/main-product.liquid`

## Add trust blocks

Inspect first:
- target `product*.json`
- `sections/main-product.liquid`
- `sections/sidebar-product.liquid`

## Add / improve size guide

Inspect first:
- `snippets/product-form.liquid`
- `sections/main-product.liquid`
- Kiwi app blocks in templates

## Improve mobile product layout

Inspect first:
- `assets/main-product.css`
- media/info wrappers in `sections/main-product.liquid`
- mobile zoom/gallery flags in section settings

## Add a custom product template

Inspect first:
- `templates/product.json`
- `templates/product.amalfi-product.json`
- `templates/product.complementary-products.json`
- `templates/product.options-customizer.json`
- `templates/product.products-with-extra-image.json`

Safer approach:
- clone a product template JSON first
- keep `main-product` intact initially
- move merchandising/side content via template sections before modifying form/media internals

---

## 14. Testing checklist after product page edits

Always test:

### Product types
- product with one variant
- product with multiple variants
- sold out variant
- unavailable variant
- grouped product if used
- customized/personalized product if using `properties` blocks

### Media
- image gallery
- thumbnails
- zoom/lightbox
- video media if present
- 360 media if present
- mobile gallery

### Form / ATC
- variant switching
- hidden selected variant state
- quantity selector
- add to cart
- cart drawer opens/updates
- dynamic checkout button
- incoming inventory / availability messaging

### Content
- size guide
- accordions/tabs
- description/additional info blocks
- metafield-driven content if used
- app blocks

### Merchandising
- product recommendations
- recently viewed
- featured collection below PDP
- sidebar product content

### Layout / responsiveness
- desktop
- tablet
- mobile
- sticky info behavior
- long product title
- many variants
- product with many media items

### Theme Editor
- section settings
- block order changes
- alternate product templates
- app block visibility

---

## Summary conclusions

### Primary ownership point

If a future redesign is planned, the real ownership point is:
- `sections/main-product.liquid`
- `assets/main-product.css`

Everything else attaches to that core.

### Safest redesign strategy

Safest path for a custom PDP redesign:
1. choose the target product template first
2. keep `main-product.liquid` behavior intact initially
3. redesign structure in controlled increments
4. avoid touching variant/media JS assumptions until markup ownership is fully mapped
5. treat `theme.min.js` and `global.min.js` as high-risk runtime dependencies

### Biggest static-audit uncertainty

The biggest unknowns from static search are:
- exact JS ownership for variant-change flow
- exact cart-drawer update path from PDP ATC
- exact slider initialization ownership for product media
- exact pickup-availability runtime binding
- exact app-block runtime expectations across all installed integrations

These need runtime inspection before any major product-form or gallery rebuild.
