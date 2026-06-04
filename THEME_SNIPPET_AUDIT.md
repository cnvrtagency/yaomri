# THEME_SNIPPET_AUDIT

## 1. Purpose

This file documents shared snippet risk and how to inspect snippets safely before editing them.

Use it with:

- `theme-audit-data/snippet-reference-counts.txt`
- `theme-audit-data/section-render-map.txt`
- `THEME_CODEBASE_INDEX.md`

## 2. Shared-risk thresholds

- `25+` references: critical shared-risk
- `10+` references: high shared-risk
- `<10` references: still inspect usage before editing, but impact is usually easier to contain

## 3. Highest-reference snippets from current evidence

From `theme-audit-data/snippet-reference-counts.txt`:

### Critical shared-risk

- `bk_cus_style` - 121
- `img_svg` - 98
- `section_style` - 92
- `section_tophead` - 49
- `product-size` - 28

### High shared-risk

- `product-price` - 22
- `social_sharing` - 20
- `pr-sidebar-loop` - 18
- `product-atc` - 17
- `position_content` - 16
- `product-rating` - 16
- `product-img` - 15
- `product-countdown` - 14
- `newsletter` - 13
- `product-grid-item1` - 12
- `product-grid-item6` - 12
- `push_menu` - 12
- `title_menu2` - 12
- `product-grid-item2` - 11
- `product-grid-item3` - 11
- `product-grid-item4` - 11
- `product-grid-item5` - 11
- `t4s_logo` - 11
- `product-grid-item7` - 10
- `product-grid-item8` - 10
- `product-grid-item9` - 10
- `product-img-with-video` - 10

## 4. Snippet groups that matter most

### Shared style and presentation snippets

- `bk_cus_style`
- `section_style`
- `section_tophead`
- `position_content`
- `img_svg`

These are cross-section infrastructure. Treat them as global-impact files.

### Product and card snippets

- `product-price`
- `product-atc`
- `product-img`
- `product-img-with-video`
- `product-rating`
- `product-size`
- `product-countdown`
- `product-grid-item*`

These affect product cards, collection grids, merchandising sections, and product page UI.

### Header and menu snippets

- `push_menu`
- `title_menu2`
- `t4s_logo`

These are higher risk because header and mobile nav behaviour is shared and CSS/JS dependent.

### Sidebar / collection support snippets

- `pr-sidebar-loop`
- `newsletter`

These can affect collection-like or promotional surfaces across more than one route.

## 5. How to inspect a snippet before editing

1. check `theme-audit-data/snippet-reference-counts.txt`
2. find the exact reference count
3. if `10+`, treat it as shared-risk
4. use `theme-audit-data/section-render-map.txt` to identify which sections render it
5. inspect whether the snippet outputs markup, style, configuration, or helper fragments
6. only then decide whether the edit belongs in the snippet or in a calling section

## 6. Practical routing by snippet type

### Heading snippet work

- inspect:
  - `section_tophead`
  - calling sections from `section-render-map.txt`
  - heading selectors in `key-selector-hits.txt`

### Product card snippet work

- inspect:
  - `product-grid-item*`
  - `product-price`
  - `product-img*`
  - `product-atc`
  - source sections such as `featured-collection` and `main-collection`

### Cart snippet work

- inspect:
  - cart-related calling sections/snippets
  - active JS/CSS in `asset-load-map.txt`
  - `THEME_JS_DEPENDENCY_AUDIT.md`

### Header/menu snippet work

- inspect:
  - header/menu snippet family
  - selector ownership in `key-selector-hits.txt`
  - JS ownership in `js-keyword-file-map.txt`

## 7. Snippet editing rules

- do not edit shared snippets before checking actual reference count
- do not assume a snippet is route-local
- do not move global behaviour into a shared snippet casually
- do not edit product/card snippets without checking both collection and product contexts
- do not edit header/menu snippets without checking mobile impact
- prefer the calling section when the requested change is truly section-specific

## 8. Highest-risk snippets for future sessions

Start with these when assessing shared impact:

1. `snippets/bk_cus_style.liquid`
2. `snippets/img_svg.liquid`
3. `snippets/section_style.liquid`
4. `snippets/section_tophead.liquid`
5. `snippets/product-price.liquid`
6. `snippets/product-atc.liquid`
7. `snippets/product-img.liquid`
8. product-grid-item snippet family
9. cart snippet family
10. header/menu snippet family
