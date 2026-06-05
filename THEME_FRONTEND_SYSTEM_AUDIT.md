# THEME_FRONTEND_SYSTEM_AUDIT

## 1. Purpose

This file describes the frontend system as it is loaded and shared in this repo: CSS entry points, JS entry points, shared runtime risks, and practical routing for product, collection, cart, header, and heading work.

Use it with:

- `theme-audit-data/asset-load-map.txt`
- `theme-audit-data/key-selector-hits.txt`
- `theme-audit-data/js-keyword-file-map.txt`
- `THEME_CSS_DESIGN_AUDIT.md`
- `THEME_JS_DEPENDENCY_AUDIT.md`

## 2. Frontend architecture overview

This theme uses a layered Kalles / T4S frontend system:

- Liquid entry points load global CSS and JS
- shared snippets inject heading and section-level styling
- section files assemble markup but often rely on shared snippets
- minified runtime JS controls major interactions
- late-loaded CSS and JS extend product, drawer, search, and facet behaviour

Practical consequence:

- a frontend change is rarely “just one file” unless the selector and render path are clearly local

## 3. CSS loading map

Confirmed from `theme-audit-data/asset-load-map.txt`:

### Early/global CSS

- `layout/theme.liquid`
  - `custom.css` preload and stylesheet when `settings.custom_css_t4s` is enabled
  - `theme.css`
- `snippets/head_assets.liquid`
  - `base.css`
  - `bootstrap.min.css`
  - `ecomrise-colors.css`
  - `theme_rtl.css`

### Late/feature CSS

- `snippets/render_bottom.liquid`
  - `colors.css`
  - `drawer.min.css`
  - `line-awesome.min.css`
  - `login-sidebar.css`
  - `main-product.css`
  - `mini-cart.css`
  - `mobile_nav.css`
  - `pre_flickityt4s.min.css`
  - `qs-product.css`
  - `qv-product.css`
  - `search-hidden.css`
  - `theme.css`

### CSS risk notes

- `theme.css` appears in both global and late load paths; do not assume one inclusion point
- `custom.css` is generated from `assets/custom.css.liquid`, which renders Theme Editor CSS settings
- section-level styling may be injected through shared snippets rather than static CSS files alone
- late-loaded CSS can override earlier assumptions about drawer, product, search, and mobile surfaces

## 4. JS loading map

Confirmed from `theme-audit-data/asset-load-map.txt`:

### Early/global JS

- `layout/theme.liquid`
  - `global.min.js`
  - `lazysizes.min.js`
  - external vendor/app scripts including TikTok, Facebook, Loox

### Late/feature JS

- `snippets/render_bottom.liquid`
  - `custom.js`
  - `des_adm.min.js`
  - `facets.min.js`
  - `interactable.min.js`
  - `nouislider.min.js`
  - `polyfill.min.js`
  - `predictive-search.min.js`
  - `reviewOther.js`
  - `t4s-currencies.min.js`
  - `t4s-instant-page.min.js`
  - `t4s_zoom.min.js`
  - `theme.min.js`
  - `threesixty.min.js`

### JS risk notes

- core interaction logic is spread across global and late-loaded runtime files
- `theme.min.js` is central but not the only active runtime owner
- collection filters, predictive search, zoom, currency, and drawer/cart behaviour are feature-specific layers loaded after the base runtime
- do not assume a keyword match in a JS file means that file is active; cross-check with `asset-load-map.txt`

## 5. Kalles / T4S token and config system

High-signal ownership points:

- `snippets/head_assets.liquid`
  - early frontend variables/config and core head assets
- `snippets/section_style.liquid`
  - section-level style output
- `snippets/bk_cus_style.liquid`
  - heavily shared styling helper
- `snippets/se_cus_css.liquid`
  - custom CSS injection path

Token-like systems likely flow through:

- colour CSS files
- section settings rendered into style tags
- Kalles/T4S utility classes and shared naming patterns
- per-section CSS scoped by section ID where the theme supports it

Practical rule:

- do not treat design tokens as a single modern token file; this theme distributes configuration across Liquid, CSS, and shared snippets

## 6. Frontend dependency groups

### Header / menu / mobile nav

Dependencies usually span:

- header/menu snippets
- `mobile_nav.css`
- `theme.css`
- `global.min.js`
- `theme.min.js`
- selector evidence in `key-selector-hits.txt`

### Cart / drawer

Dependencies usually span:

- cart snippets
- `main-cart.liquid`
- `mini-cart.css`
- `drawer.min.css`
- `global.min.js`
- `theme.min.js`

### Product page

Dependencies usually span:

- `sections/main-product.liquid`
- product snippets
- `main-product.css`
- `qs-product.css`
- `qv-product.css`
- `theme.min.js`
- zoom/media related JS if enabled

### Collection / facets

Dependencies usually span:

- `sections/main-collection.liquid`
- `sections/sidebar-collection.liquid`
- product-grid-item snippets
- `facets.min.js`
- filter selectors from `key-selector-hits.txt`

### Headings and section presentation

Dependencies usually span:

- `snippets/section_tophead.liquid`
- `snippets/section_style.liquid`
- heading CSS selectors from `key-selector-hits.txt`

## 7. Global frontend risk rules

- treat `layout/theme.liquid`, `head_assets.liquid`, and `render_bottom.liquid` as plan-first files
- treat high-reference snippets as shared frontend infrastructure
- do not edit minified runtime JS unless the owner file is clearly active and there is no safer non-minified path
- do not make global CSS changes until selector evidence shows the change is intentionally global
- assume mobile and desktop can diverge because of separate CSS and JS layers

## 8. Practical task routing

### CSS loading or override issue

- read:
  - `theme-audit-data/asset-load-map.txt`
  - `THEME_CSS_DESIGN_AUDIT.md`
- inspect:
  - global load path
  - late load path
  - shared styling snippets

### JS interaction issue

- read:
  - `theme-audit-data/js-keyword-file-map.txt`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- inspect:
  - keyword group
  - active load path
  - section/snippet markup owner

### Header or mobile nav issue

- read:
  - `theme-audit-data/key-selector-hits.txt`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- inspect:
  - header/menu snippets
  - `mobile_nav.css`
  - `theme.min.js`

### Cart issue

- read:
  - `THEME_JS_DEPENDENCY_AUDIT.md`
  - `theme-audit-data/asset-load-map.txt`
- inspect:
  - cart snippets
  - `main-cart.liquid`
  - drawer/cart CSS and runtime JS

### Product issue

- read:
  - `THEME_STRUCTURE_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- inspect:
  - `main-product.liquid`
  - shared product snippets
  - product CSS/JS layers

### Collection/filter issue

- read:
  - `THEME_STRUCTURE_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- inspect:
  - `main-collection.liquid`
  - sidebar/filter structures
  - `facets.min.js`

## 9. Testing checklists by change type

### After CSS changes

- verify desktop and mobile
- verify load-order conflicts
- verify section-scoped styling does not leak
- verify late-loaded CSS does not override unexpectedly

### After JS changes

- verify the interaction on the owning route
- verify cart, search, drawers, and mobile header if shared runtime changed
- verify no obvious regression in product or collection state flows

### After heading changes

- verify multiple section types using shared heading markup
- verify homepage plus at least one non-home section using the same heading system

### After collection/filter changes

- verify filter open/close
- verify active filter state
- verify product grid rendering

### After cart or drawer changes

- verify open/close
- verify quantity/remove actions
- verify subtotal and empty state

### After product changes

- verify media
- verify variant state
- verify add to cart
- verify price/image/snippet output

## 10. Homepage hero font loading note

### Finding

- The active custom stylesheet is `assets/custom.css.liquid`, which renders Theme Editor CSS settings into the requested `custom.css` asset.
- Before this fix, `layout/theme.liquid` preloaded `custom.css`, but the actual stylesheet tag was emitted late from `snippets/render_bottom.liquid`.
- The homepage hero copy comes from `templates/index.json` and uses `.hero-title-spaced` with `.sun-word`.
- The Theme Editor custom CSS for `.hero-title-spaced` sets the visible hero display style to `font-weight: 800` and `font-style: italic`, but did not declare its own `font-family`.
- The hero previously inherited the configured heading family from `snippets/head_assets.liquid`.
- Current settings use Shopify theme fonts with `settings.font_source == '1'`, `settings.hd_ffamily == '1'`, and `settings.fnt_fm_sp1 == 'montserrat_n4'`, so the hero display face is Montserrat 800 italic.

### Fix Added

- `layout/theme.liquid` now preloads `custom.css` early and loads it in the head after `head_assets` when `settings.custom_css_t4s` is enabled.
- `snippets/render_bottom.liquid` no longer emits the late `custom.css` stylesheet tag, avoiding duplicate stylesheet output.
- `.hero-title-spaced` now explicitly uses `font-family: "Montserrat", Arial, sans-serif !important;` in `assets/custom.css.liquid`, after Theme Editor `global_css` is rendered.
- `snippets/head_assets.liquid` now adds a homepage-only `font_face` and preload for the configured heading font modified to `weight: 800` and `style: italic`.
- The preload uses Shopify's `font_url` filter for the exact generated WOFF2 font URL, from the same valid Shopify font object used for `font_face`.
- No new external font service was added.
- No hero copy, layout, or visual styling was changed.
- Existing theme font picker settings and global typography declarations are preserved.

### Files Changed

- `layout/theme.liquid`
  - Adds the early `custom.css` preload and head stylesheet load after `head_assets`.
- `snippets/head_assets.liquid`
  - Adds the targeted homepage hero font face and font preload.
- `snippets/render_bottom.liquid`
  - Removes the late duplicate `custom.css` stylesheet output.
- `assets/custom.css.liquid`
  - Adds the explicit hero-only Montserrat font stack without editing Theme Editor generated settings.
- `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - Records the hero font finding, preload fix, and validation notes.

### Testing Notes

- Check the homepage network waterfall for early `custom.css` preload and stylesheet requests, with no late duplicate stylesheet tag.
- Check the homepage network waterfall for one additional font preload from the Shopify font URL generated for Montserrat 800 italic.
- Confirm `custom.css` returns 200.
- Confirm there is no 404 for the preloaded WOFF2 request.
- Confirm `.hero-title-spaced` still renders as uppercase, white, 800 italic text and that the visible font swap is reduced or removed.
