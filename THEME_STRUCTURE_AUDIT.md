# THEME_STRUCTURE_AUDIT

## 1. Purpose

This file explains the Liquid-side structure of the theme: how templates route into sections, how sections render snippets, and where shared-risk ownership usually lives.

Use it with:

- `THEME_CODEBASE_INDEX.md`
- `theme-audit-data/template-section-map.txt`
- `theme-audit-data/section-render-map.txt`
- `theme-audit-data/snippet-reference-counts.txt`

## 2. Structural model

This theme follows a Kalles / T4S structure:

- `layout/`
  - global page shell and asset entry points
- `templates/`
  - route-level JSON/Liquid template definitions
- `sections/`
  - primary page modules and Theme Editor surfaces
- `snippets/`
  - shared markup, heading, product, cart, header, and styling partials
- `assets/`
  - shared CSS and JS runtime

Practical rule:

- templates decide which sections appear
- sections decide which shared snippets render
- shared snippets often own the visible HTML more than the section name suggests

## 3. Route mapping workflow

Before editing Liquid:

1. locate the route template in `theme-audit-data/template-section-map.txt`
2. identify the section ID and section type
3. trace that section into `theme-audit-data/section-render-map.txt`
4. check whether the visible markup actually comes from a shared snippet
5. only then edit the relevant section or snippet

## 4. High-signal route maps

### Homepage

Use `templates/index.json` in `theme-audit-data/template-section-map.txt`.

Confirmed section types from current evidence include:

- `slideshow`
- `custom-scrolling-text`
- `featured-collection`
- `tabs-collection`
- `custom-section`
- `custom-liquid`

Practical implication:

- homepage changes are often section-driven, but headings and section-level styling frequently route through shared snippets such as `section_tophead`, `section_style`, and `bk_cus_style`

### Collection page

Use `templates/collection.json` in `theme-audit-data/template-section-map.txt`.

Confirmed section types from current evidence include:

- `top-collections`
- `heading-template`
- `main-collection`
- `sidebar-collection`
- optional custom content sections

Practical implication:

- visible collection layout is split between the template, `main-collection`, sidebar/filter logic, shared product card snippets, and facets JS/CSS

### Cart page

Use `templates/cart.json` in `theme-audit-data/template-section-map.txt`.

Confirmed section types from current evidence include:

- `heading-template`
- `main-cart`

Practical implication:

- cart work is usually a combination of `main-cart`, cart snippets, cart CSS, and global runtime JS rather than a single isolated file

### Product page

Use `theme-audit-data/template-section-map.txt` to confirm the exact product template.

High-signal structural ownership:

- `sections/main-product.liquid` is the primary product route section
- product UI is shared across multiple product snippets such as price, media, options, and add-to-cart helpers

Practical implication:

- product edits should assume section + snippet + JS coordination until proven otherwise

### Search page

Use `theme-audit-data/template-section-map.txt` for the exact search route mapping.

Practical implication:

- search page ownership is split between template/section structure and predictive search runtime loaded from shared asset paths

## 5. Section-to-snippet dependency pattern

`theme-audit-data/section-render-map.txt` shows the actual render graph.

Repeated section dependencies visible in the evidence set:

- `section_tophead`
- `section_style`
- `img_svg`
- `bk_cus_style`
- `position_content`

This means many section-level changes are not local. The rendered output or styling hook may come from a shared snippet.

## 6. High-risk Liquid files

- `layout/theme.liquid`
  - global shell and global asset loading
- `snippets/head_assets.liquid`
  - shared head assets, variables, and CSS entry points
- `snippets/render_bottom.liquid`
  - shared late asset loading
- `snippets/section_tophead.liquid`
  - shared heading markup
- `snippets/section_style.liquid`
  - shared section style injection
- `snippets/bk_cus_style.liquid`
  - very high shared usage
- `snippets/img_svg.liquid`
  - very high shared usage
- `sections/main-product.liquid`
  - product root section
- `sections/main-collection.liquid`
  - collection root section
- `sections/main-cart.liquid`
  - cart root section
- `sections/featured-collection.liquid`
  - frequent homepage/merchandising entry point
  - optional heading CTA button is implemented locally in this section with `heading_cta_*` settings and custom sizing, spacing, colour, typography, radius, and hover controls; the old shared `head_btn_*` heading button controls are removed/disabled for Featured Collection, desktop CTA is centered against the heading block, mobile CTA renders below the product grid/carousel, and `snippets/section_tophead.liquid` remains untouched

## 7. Theme Editor and schema guidance

Before editing schema:

1. confirm the route template and section owner
2. find the actual setting ID names already used in that section
3. confirm whether the setting is consumed directly by the section or indirectly by a shared snippet
4. keep schema JSON valid
5. avoid duplicating existing controls under slightly different IDs

Common schema ownership types:

- layout controls
- heading/subheading/text content
- spacing and alignment
- product source and merchandising
- slider/carousel behaviour
- button/link content
- image/media controls
- colour/typography toggles
- custom CSS fields

## 8. Practical task routing

### Heading change

- start with:
  - `theme-audit-data/template-section-map.txt`
  - `theme-audit-data/section-render-map.txt`
  - `THEME_HEADING_SYSTEM_AUDIT.md`
- inspect:
  - target section
  - `snippets/section_tophead.liquid`

### Product card change

- start with:
  - `theme-audit-data/snippet-reference-counts.txt`
  - `theme-audit-data/section-render-map.txt`
  - `THEME_SNIPPET_AUDIT.md`
- inspect:
  - product-grid-item snippet family
  - source section such as `featured-collection` or `main-collection`

### Collection/filter change

- start with:
  - `templates/collection.json` in `template-section-map.txt`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- inspect:
  - `sections/main-collection.liquid`
  - `sections/sidebar-collection.liquid`
  - facets runtime and selectors

### Product page change

- start with:
  - product template in `template-section-map.txt`
  - `THEME_SNIPPET_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
- inspect:
  - `sections/main-product.liquid`
  - relevant product snippets

### Cart change

- start with:
  - `templates/cart.json` in `template-section-map.txt`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- inspect:
  - `sections/main-cart.liquid`
  - cart snippets

### Header/menu change

- start with:
  - `theme-audit-data/snippet-reference-counts.txt`
  - `theme-audit-data/key-selector-hits.txt`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
- inspect:
  - header/menu snippets
  - global asset dependencies

## 9. Structural rules for future sessions

- do not assume a section owns its visible markup
- do not edit shared snippets without checking reference counts first
- do not add settings before checking whether a matching control already exists
- do not treat template JSON alone as the whole routing story
- do not touch global Liquid entry points without a plan-first pass
