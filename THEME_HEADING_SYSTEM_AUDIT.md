# THEME_HEADING_SYSTEM_AUDIT

## 1. Purpose

This file documents the shared heading system used across the theme and how to edit headings without accidentally changing many sections at once.

Use it with:

- `theme-audit-data/snippet-reference-counts.txt`
- `theme-audit-data/template-section-map.txt`
- `theme-audit-data/section-render-map.txt`
- `theme-audit-data/key-selector-hits.txt`

## 2. Core heading ownership

Primary shared heading path:

- `snippets/section_tophead.liquid`

Shared-risk evidence:

- `section_tophead` currently has `49` references in `theme-audit-data/snippet-reference-counts.txt`

Practical consequence:

- a heading edit here is not local
- it can affect homepage sections, merchandising sections, content sections, and promotional sections at once

## 3. Key heading selectors

Use `theme-audit-data/key-selector-hits.txt` before editing CSS.

Key selectors already indexed there:

- `t4s-top-heading`
- `t4s-section-title`
- `t4s-section-des`
- `t4s-subtitle`
- `heading-testimonials-star`

Practical rule:

- do not edit heading CSS from memory or naming guesses
- use the selector hits file to locate the actual owning CSS/Liquid files first

## 4. Homepage heading route

For homepage heading work:

1. start with `templates/index.json` in `theme-audit-data/template-section-map.txt`
2. identify the target homepage section type
3. trace that section in `theme-audit-data/section-render-map.txt`
4. confirm whether it renders `section_tophead`
5. only then inspect section-specific settings and heading CSS

## 5. Shared heading dependency pattern

The theme commonly splits heading ownership across:

- section schema/settings
- `snippets/section_tophead.liquid`
- shared heading selectors
- section-level styling helpers such as `section_style` or `bk_cus_style`

This means a “text-only” heading change can still be affected by shared classes, spacing rules, or section style output.

## 6. High-risk heading files

- `snippets/section_tophead.liquid`
  - shared heading markup owner
- heading CSS files containing:
  - `t4s-top-heading`
  - `t4s-section-title`
  - `t4s-section-des`
  - `t4s-subtitle`
- `snippets/section_style.liquid`
  - shared section-level style influence
- `snippets/bk_cus_style.liquid`
  - high shared styling influence

## 7. Rules for editing headings safely

- do not assume the visible heading comes directly from the section file
- check whether the section renders `section_tophead`
- check snippet reference counts before editing shared heading markup
- prefer section-scoped CSS when the change should be local
- avoid changing shared heading classes unless the change is intentionally global
- confirm whether the request is text/content, spacing, typography, colour, or markup structure before choosing the file

## 8. Practical routing by heading task

### Heading text/content change

- inspect:
  - target section schema/settings
  - `section_tophead` if the text is rendered there

### Heading spacing or alignment change

- inspect:
  - heading selectors in `key-selector-hits.txt`
  - section-level styling snippets
  - section-scoped CSS before global CSS

### Heading typography/colour change

- inspect:
  - shared heading selectors
  - load path in `asset-load-map.txt` if needed
  - per-section settings if typography/colour is configurable

### Homepage featured collection heading change

- inspect:
  - homepage template map
  - `sections/featured-collection.liquid`
  - `section_tophead`
  - shared heading selectors

## 9. Minimum heading regression checks

- verify the target section
- verify at least one other section using the same heading system
- verify homepage if the shared snippet changed
- verify mobile spacing and wrapping
