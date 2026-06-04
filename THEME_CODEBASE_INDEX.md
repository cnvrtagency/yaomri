# THEME_CODEBASE_INDEX

## 1. Purpose

This file is the front door to the raw evidence set for this repo.

Do not use it as a replacement for search. Use it to decide which evidence file and which audit doc to read before editing theme code.

## 2. Start with raw evidence

Read these first when locating real ownership:

- `theme-audit-data/template-section-map.txt`
  - exact template-to-section relationships
- `theme-audit-data/section-render-map.txt`
  - section-to-snippet render graph
- `theme-audit-data/snippet-reference-counts.txt`
  - shared snippet risk by actual reference count
- `theme-audit-data/asset-load-map.txt`
  - confirmed CSS/JS load paths
- `theme-audit-data/key-selector-hits.txt`
  - confirmed file-path hits for important selectors
- `theme-audit-data/js-keyword-file-map.txt`
  - JS routing by feature keyword group

## 3. Highest-reference snippets from current evidence

From `theme-audit-data/snippet-reference-counts.txt`:

1. `bk_cus_style` - 121
2. `img_svg` - 98
3. `section_style` - 92
4. `section_tophead` - 49
5. `product-size` - 28
6. `product-price` - 22
7. `social_sharing` - 20
8. `pr-sidebar-loop` - 18
9. `product-atc` - 17
10. `position_content` - 16

### Shared-risk interpretation

- `25+` references: critical shared-risk
- `10+` references: high shared-risk
- Any edit to `bk_cus_style`, `img_svg`, `section_style`, or `section_tophead` should be treated as global-impact work until proven otherwise

## 4. Highest-risk shared snippets

Based on reference counts and theme role:

- `snippets/bk_cus_style.liquid`
  - heavily shared styling helper
- `snippets/img_svg.liquid`
  - heavily shared media/icon helper
- `snippets/section_style.liquid`
  - section-level style output used broadly
- `snippets/section_tophead.liquid`
  - shared heading output path
- `snippets/product-price.liquid`
  - shared price markup
- `snippets/product-atc.liquid`
  - shared add-to-cart path
- product-grid-item snippets
  - shared collection/card markup family
- cart snippets
  - shared cart and drawer behaviour surfaces
- header/menu snippets
  - shared nav, mobile menu, and drawer surfaces

## 5. Template and section evidence

Use `theme-audit-data/template-section-map.txt` for the exact current map.

Confirmed high-signal examples from the evidence set:

- `templates/index.json`
  - homepage sections include `slideshow`, `custom-scrolling-text`, `featured-collection`, `tabs-collection`, `custom-section`, and `custom-liquid`
- `templates/cart.json`
  - cart route uses `heading-template` and `main-cart`
- `templates/collection.json`
  - collection route uses `top-collections`, `heading-template`, `main-collection`, and `sidebar-collection`

Use `theme-audit-data/section-render-map.txt` next to trace a section into its snippets.

Confirmed high-signal examples:

- many sections render `section_tophead`, `section_style`, `img_svg`, and `bk_cus_style`
- `featured-collection`, `main-collection`, and `main-product` are routing-critical sections for merchandising, collection, and product work

## 6. Asset load evidence

Use `theme-audit-data/asset-load-map.txt` before editing CSS or JS.

Confirmed load path summary:

- `layout/theme.liquid`
  - CSS: `custom.css`, `theme.css`
  - JS: `global.min.js`, `lazysizes.min.js`, plus external app/vendor scripts
- `snippets/head_assets.liquid`
  - CSS: `base.css`, `bootstrap.min.css`, `ecomrise-colors.css`, `theme_rtl.css`
- `snippets/render_bottom.liquid`
  - CSS: includes `colors.css`, `drawer.min.css`, `main-product.css`, `mini-cart.css`, `mobile_nav.css`, `qs-product.css`, `qv-product.css`, `search-hidden.css`, `theme.css`
  - JS: includes `custom.js`, `facets.min.js`, `predictive-search.min.js`, `t4s-currencies.min.js`, `theme.min.js`, `t4s_zoom.min.js`, `threesixty.min.js`

Practical rule:

- do not assume a matched file is active until its load path is confirmed here

## 7. Selector evidence

Use `theme-audit-data/key-selector-hits.txt`.

Key selector families already indexed there:

- heading selectors:
  - `t4s-top-heading`
  - `t4s-section-title`
  - `t4s-section-des`
  - `t4s-subtitle`
  - `heading-testimonials-star`
- product/card selectors:
  - `product-grid-item`
  - `t4s-product`
  - `t4s-pr-item`
- cart/drawer selectors:
  - `t4s-mini_cart`
  - `t4s-cart`
  - `t4s-drawer`
- collection/filter selectors:
  - `t4s-facets`
  - `t4s-filter`
- header/menu/mobile selectors:
  - `t4s-header`
  - `t4s-menu`
  - `t4s-mobile`

Use the file-path hits to find the real CSS/Liquid ownership before editing.

## 8. JS keyword evidence

Use `theme-audit-data/js-keyword-file-map.txt`.

Keyword groups already indexed there:

- cart / add to cart
- variant / product options
- facets / filters
- predictive search
- mobile menu / drawer
- slider / carousel
- lazyload / reveal
- currency / wishlist / compare

Important caution:

- this file is routing evidence, not proof of active runtime ownership
- it includes keyword hits in backup or inactive files as well as active files
- always cross-check with `theme-audit-data/asset-load-map.txt`

## 9. Top risk files to inspect first

1. `layout/theme.liquid`
2. `snippets/head_assets.liquid`
3. `snippets/render_bottom.liquid`
4. `snippets/bk_cus_style.liquid`
5. `snippets/img_svg.liquid`
6. `snippets/section_style.liquid`
7. `snippets/section_tophead.liquid`
8. `sections/main-product.liquid`
9. `sections/main-collection.liquid`
10. `sections/main-cart.liquid`

## 10. How to use `theme-audit-data/` before editing

1. find the template in `template-section-map.txt`
2. find the section-to-snippet path in `section-render-map.txt`
3. check shared snippet risk in `snippet-reference-counts.txt`
4. check CSS/JS load path in `asset-load-map.txt`
5. check selector ownership in `key-selector-hits.txt`
6. check JS feature routing in `js-keyword-file-map.txt`
7. only then open source files for implementation
