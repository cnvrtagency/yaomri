# THEME_JS_DEPENDENCY_AUDIT

## 1. Purpose

This file explains which JS files matter, how runtime ownership is split, and how to route JS/debugging work without guessing.

Use it with:

- `theme-audit-data/asset-load-map.txt`
- `theme-audit-data/js-keyword-file-map.txt`
- `THEME_FRONTEND_SYSTEM_AUDIT.md`

## 2. JS load ownership

Confirmed from `theme-audit-data/asset-load-map.txt`:

### Early/global runtime

- `assets/global.min.js`
- `assets/lazysizes.min.js`
- external vendor/app scripts loaded from `layout/theme.liquid`

### Late/feature runtime

- `assets/custom.js`
- `assets/des_adm.min.js`
- `assets/facets.min.js`
- `assets/interactable.min.js`
- `assets/nouislider.min.js`
- `assets/polyfill.min.js`
- `assets/predictive-search.min.js`
- `assets/reviewOther.js`
- `assets/t4s-currencies.min.js`
- `assets/t4s-instant-page.min.js`
- `assets/t4s_zoom.min.js`
- `assets/theme.min.js`
- `assets/threesixty.min.js`

Practical rule:

- determine whether the behaviour belongs to the base runtime or a later feature runtime before editing anything

## 3. JS keyword routing evidence

Use `theme-audit-data/js-keyword-file-map.txt` to locate candidate files for:

- cart / add to cart
- variant / product options
- facets / filters
- predictive search
- mobile menu / drawer
- slider / carousel
- lazyload / reveal
- currency / wishlist / compare

Important caution:

- this keyword map is not the same as an active dependency graph
- it can include backup or inactive files
- always cross-check candidate files against `theme-audit-data/asset-load-map.txt`

## 4. JS file role guidance

### Core runtime

- `assets/global.min.js`
  - early theme-wide runtime foundation
- `assets/theme.min.js`
  - major shared theme interaction layer

### Product / variant / media

- `assets/theme.min.js`
- `assets/t4s_zoom.min.js`
- `assets/threesixty.min.js`
- product-related keyword hits in `js-keyword-file-map.txt`

### Cart / add to cart

- `assets/global.min.js`
- `assets/theme.min.js`
- cart/add-to-cart keyword hits in `js-keyword-file-map.txt`

### Collection / facets

- `assets/facets.min.js`
- `assets/nouislider.min.js`
- `assets/interactable.min.js`

### Header / mobile nav / drawer

- `assets/global.min.js`
- `assets/theme.min.js`
- mobile menu / drawer keyword hits in `js-keyword-file-map.txt`

### Predictive search

- `assets/predictive-search.min.js`
- shared search-related runtime in the main theme stack if selectors overlap

### Currency / app / vendor

- `assets/t4s-currencies.min.js`
- app/vendor scripts loaded globally from `layout/theme.liquid`

## 5. High-risk JS systems

- `assets/theme.min.js`
  - broad shared interaction owner
- `assets/global.min.js`
  - early runtime dependency surface
- `assets/facets.min.js`
  - collection/filter system
- `assets/predictive-search.min.js`
  - shared search behaviour
- `assets/t4s-currencies.min.js`
  - currency behaviour with potential store-wide impact
- vendor/app scripts loaded globally
  - integrations can affect timing or DOM assumptions

## 6. Warnings for future sessions

- avoid editing minified JS unless absolutely necessary
- do not rely on keyword hits alone
- do not assume one JS file owns the whole interaction
- confirm the related Liquid and CSS path as well
- test mobile and desktop when shared runtime files change

## 7. Practical task routing

### Cart or add-to-cart issue

- read:
  - `js-keyword-file-map.txt`
  - `asset-load-map.txt`
- inspect:
  - `global.min.js`
  - `theme.min.js`
  - cart snippets / main cart structure

### Product variant or media issue

- read:
  - `js-keyword-file-map.txt`
  - `THEME_STRUCTURE_AUDIT.md`
- inspect:
  - `main-product.liquid`
  - product snippets
  - product/media runtime files

### Collection filter issue

- read:
  - `js-keyword-file-map.txt`
  - `asset-load-map.txt`
- inspect:
  - `facets.min.js`
  - `nouislider.min.js`
  - collection/filter markup owners

### Predictive search issue

- read:
  - `js-keyword-file-map.txt`
  - `asset-load-map.txt`
- inspect:
  - `predictive-search.min.js`
  - header/search markup

### Mobile menu or drawer issue

- read:
  - `js-keyword-file-map.txt`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
- inspect:
  - `global.min.js`
  - `theme.min.js`
  - header/menu snippets

## 8. Testing checklist after JS edits

- target interaction works on the owning route
- no obvious errors in shared flows related to the edited runtime file
- cart and drawer still work if shared runtime changed
- header/mobile nav still works if shared runtime changed
- product cards and collection interactions still work if theme-wide runtime changed
- predictive search still opens/closes correctly if search or header runtime changed
- mobile behaviour is tested separately from desktop
