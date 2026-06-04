# THEME_CSS_DESIGN_AUDIT

## 1. Purpose

This file explains how CSS is distributed across the theme, how to avoid global leakage, and how to route CSS changes using selector and asset evidence before editing.

Use it with:

- `theme-audit-data/asset-load-map.txt`
- `theme-audit-data/key-selector-hits.txt`
- `THEME_FRONTEND_SYSTEM_AUDIT.md`

## 2. CSS role map

Confirmed CSS entry points from `theme-audit-data/asset-load-map.txt`:

### Global foundation

- `assets/base.css`
- `assets/bootstrap.min.css`
- `assets/theme.css`

### Theme and colour layers

- `assets/custom.css`
- `assets/ecomrise-colors.css`
- `assets/colors.css`
- `assets/theme_rtl.css`

### Feature CSS

- `assets/drawer.min.css`
- `assets/login-sidebar.css`
- `assets/main-product.css`
- `assets/mini-cart.css`
- `assets/mobile_nav.css`
- `assets/qs-product.css`
- `assets/qv-product.css`
- `assets/search-hidden.css`
- `assets/pre_flickityt4s.min.css`

### Liquid-influenced styling

- `snippets/section_style.liquid`
- `snippets/bk_cus_style.liquid`
- `snippets/se_cus_css.liquid`

## 3. Global vs scoped CSS risk

### Global-risk surfaces

- `theme.css`
- `base.css`
- shared selectors used across many sections
- shared heading selectors
- shared product/card selectors
- header/menu/cart/filter selectors

### Safer scoped surfaces

- section-specific selectors
- per-section styles scoped to `#shopify-section-{{ section.id }}`
- section settings rendered into local styling

Practical rule:

- if the change should affect one section, start by proving it can be scoped locally
- do not choose a global selector first just because it is easier to find

## 4. Selector search workflow

Before editing CSS:

1. search `theme-audit-data/key-selector-hits.txt`
2. identify all CSS and Liquid files that own the selector
3. confirm whether the selector is shared across product, collection, cart, header, or heading contexts
4. check `theme-audit-data/asset-load-map.txt` for the actual load path
5. prefer the narrowest safe styling surface

## 5. High-risk selector families

### Heading selectors

- `t4s-top-heading`
- `t4s-section-title`
- `t4s-section-des`
- `t4s-subtitle`
- `heading-testimonials-star`

### Product/card selectors

- `product-grid-item`
- `t4s-product`
- `t4s-pr-item`

### Cart/drawer selectors

- `t4s-mini_cart`
- `t4s-cart`
- `t4s-drawer`

### Collection/filter selectors

- `t4s-facets`
- `t4s-filter`

### Header/menu/mobile selectors

- `t4s-header`
- `t4s-menu`
- `t4s-mobile`

## 6. Practical task routing for CSS changes

### Homepage or section heading styling

- inspect:
  - `THEME_HEADING_SYSTEM_AUDIT.md`
  - `key-selector-hits.txt`
  - `section_tophead` and section-specific style output

### Product card styling

- inspect:
  - product-grid-item snippets
  - `product-grid-item`, `t4s-product`, `t4s-pr-item` selector hits
  - `theme.css` plus any card-specific CSS owner

### Product page styling

- inspect:
  - `main-product.css`
  - `theme.css`
  - product snippets and section-specific styles

### Cart drawer or cart page styling

- inspect:
  - `mini-cart.css`
  - `drawer.min.css`
  - `theme.css`
  - cart selector hits

### Collection/filter styling

- inspect:
  - `theme.css`
  - filter selector hits
  - collection section structure

### Header/mobile nav styling

- inspect:
  - `mobile_nav.css`
  - `theme.css`
  - header/menu/mobile selector hits

### Custom CSS conflict debugging

- inspect:
  - `custom.css`
  - `se_cus_css.liquid`
  - late-loaded CSS in `render_bottom.liquid`

## 7. CSS editing rules

- do not assume the first matching CSS file is the active owner
- confirm load path first
- avoid global selectors when the change should be local
- preserve Kalles/T4S class contracts unless the change is intentionally structural
- prefer section scoping where possible
- treat `theme.css` and `custom.css` as high-regression surfaces

## 8. Minimum CSS regression checks

- target route renders correctly
- other shared routes using the same selector still render correctly
- mobile layout remains intact
- spacing/overflow/wrapping are still correct
- late-loaded CSS does not override the intended result
