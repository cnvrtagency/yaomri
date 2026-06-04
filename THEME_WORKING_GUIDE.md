# THEME_WORKING_GUIDE

## 1. Purpose

This is the read-first operating guide for future Codex sessions working on this Shopify theme.

Read this file before touching code. It explains how to use the audit set, where the evidence lives, which files are risky, and how to route common theme tasks without guessing.

## 2. Project identity

- Theme: Ya Omri Shopify theme
- Base architecture: Kalles / T4S
- Working reality: shared-snippet, shared-asset, theme-core architecture with many global dependencies
- Practical consequence: small edits can spread through multiple sections, templates, and runtime paths if the real render path is not identified first

## 3. Read order and audit directory

### Read first

1. `THEME_WORKING_GUIDE.md`
2. `THEME_CODEBASE_INDEX.md`
3. Relevant files in `theme-audit-data/`
4. Only then the deeper audit doc for the task

### Which doc to read by task

- Factual file relationships and evidence routing:
  - `THEME_CODEBASE_INDEX.md`
  - `theme-audit-data/template-section-map.txt`
  - `theme-audit-data/section-render-map.txt`
  - `theme-audit-data/snippet-reference-counts.txt`
  - `theme-audit-data/asset-load-map.txt`
- Structure, sections, snippets, template relationships, Theme Editor routing:
  - `THEME_STRUCTURE_AUDIT.md`
- CSS, JS, design system, frontend behaviour, load order:
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
- Heading and title work:
  - `THEME_HEADING_SYSTEM_AUDIT.md`
- Snippet-specific shared-risk work:
  - `THEME_SNIPPET_AUDIT.md`
- CSS-only work:
  - `THEME_CSS_DESIGN_AUDIT.md`
- JS-only work:
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- Historical first-pass notes:
  - `THEME_AUDIT_AND_WORKING_CONTEXT.md`

## 4. Evidence directory

Use `theme-audit-data/` before guessing.

- `file-counts.txt`
  - top-level folder counts and extension counts
- `template-section-map.txt`
  - template-to-section relationships, including section IDs/types where parseable
- `snippet-reference-counts.txt`
  - snippet reference counts, sorted highest first
- `section-render-map.txt`
  - section-to-snippet render/include map plus obvious direct asset loads
- `asset-load-map.txt`
  - CSS/JS load sources from `layout/theme.liquid`, `snippets/head_assets.liquid`, `snippets/render_bottom.liquid`, and direct section/snippet loads
- `key-selector-hits.txt`
  - file-path hits for important frontend selectors
- `js-keyword-file-map.txt`
  - JS file-path routing by feature keyword groups

## 5. Mandatory workflow before any implementation

1. Run `git status`.
2. Restate the exact requested change in one sentence.
3. Read `THEME_WORKING_GUIDE.md`.
4. Read `THEME_CODEBASE_INDEX.md`.
5. Read only the audit docs relevant to the task.
6. Use `theme-audit-data/` to identify the real template, section, snippet, selector, and asset path before editing.
7. Search for actual rendered selectors, setting IDs, schema fields, and snippet renders before touching code.
8. For risky tasks, confirm the exact files to edit and the plan before implementation.
9. Make small scoped changes.
10. Review `git diff`.
11. Report changed files and why.

## 6. Plan-first vs implementation work

### Plan-first tasks

Use a plan-first approach when:

- the change touches `layout/theme.liquid` or shared asset loading
- the change touches shared snippets with high reference counts
- the change affects product cards, cart, collection filters, header, mobile nav, or headings used across many sections
- the change introduces or edits Theme Editor schema/settings
- the request is ambiguous about where the rendered markup actually comes from

### Direct implementation tasks

Direct implementation is safer when:

- the change is clearly scoped to one section
- the selector path is confirmed
- the section/snippet usage is low-risk
- no global assets, shared heading snippets, or runtime JS dependencies are involved

## 7. Evidence-first rules

- Do not infer ownership from file names alone.
- Do not assume a section owns visible markup until the template, section, and snippet path is confirmed.
- Do not assume a JS file is active just because it matches a keyword; verify load path in `asset-load-map.txt`.
- Do not assume a snippet is local; check `snippet-reference-counts.txt` first.
- Treat high reference counts as shared-risk evidence.
- Prefer file relationships from `theme-audit-data/` over memory, intuition, or old audit language.

## 8. High-risk files and systems

These are high risk because they are global entry points, shared snippet dependencies, or core cart/product/collection/header files.

- `layout/theme.liquid`
  - global CSS/JS load entry
- `snippets/head_assets.liquid`
  - shared CSS variables/config and early asset loading
- `snippets/render_bottom.liquid`
  - shared late CSS/JS loading for cart, search, product, facets, drawers
- `snippets/section_tophead.liquid`
  - shared heading output across many sections
- `snippets/section_style.liquid`
  - shared section-level styling path
- `snippets/se_cus_css.liquid`
  - custom CSS injection path
- `snippets/bk_cus_style.liquid`
  - highest-reference shared styling snippet in current evidence
- `snippets/img_svg.liquid`
  - high-reference shared media/icon snippet
- `assets/theme.css`
  - global theme styling layer
- `assets/base.css`
  - foundational styling loaded early
- `assets/section.css`
  - shared section styling
- `assets/global.min.js`
  - early runtime foundation
- `assets/theme.min.js`
  - main theme interaction runtime
- `assets/facets.min.js`
  - collection/filter runtime
- `assets/predictive-search.min.js`
  - search runtime
- `sections/main-product.liquid`
  - product page root section
- `sections/main-collection.liquid`
  - collection page root section
- `sections/main-cart.liquid`
  - cart page root section
- `sections/featured-collection.liquid`
  - common homepage and merchandising surface
- product-grid-item snippets
  - shared card output across collection-like sections
- cart snippets
  - drawer and cart interactions are tightly coupled to JS and CSS
- header/menu snippets
  - mobile nav, drawer, search, and header state are shared systems

## 9. Common task routing

### Homepage heading/title change

- Read:
  - `THEME_HEADING_SYSTEM_AUDIT.md`
  - `theme-audit-data/template-section-map.txt`
  - `theme-audit-data/section-render-map.txt`
  - `theme-audit-data/key-selector-hits.txt`
- Inspect first:
  - homepage template section map
  - target section file
  - `snippets/section_tophead.liquid`
  - heading CSS files/selectors

### Featured collection change

- Read:
  - `THEME_STRUCTURE_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
- Inspect first:
  - `sections/featured-collection.liquid`
  - referenced product-grid-item snippet
  - related CSS in product-card / section styles

### Product card change

- Read:
  - `THEME_SNIPPET_AUDIT.md`
  - `THEME_CSS_DESIGN_AUDIT.md`
- Inspect first:
  - product-grid-item snippets
  - `theme-audit-data/snippet-reference-counts.txt`
  - `theme-audit-data/key-selector-hits.txt`

### Product price / image / ATC change

- Read:
  - `THEME_SNIPPET_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md` if interaction is involved
- Inspect first:
  - `snippets/product-price.liquid`
  - `snippets/product-img*.liquid`
  - `snippets/product-atc.liquid`
  - `sections/main-product.liquid`

### Collection / filter change

- Read:
  - `THEME_STRUCTURE_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- Inspect first:
  - `sections/main-collection.liquid`
  - `sections/sidebar-collection.liquid`
  - `assets/facets.min.js`
  - filter-related selectors in `key-selector-hits.txt`

### Product page change

- Read:
  - `THEME_STRUCTURE_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- Inspect first:
  - `sections/main-product.liquid`
  - product snippets
  - product CSS/JS load path in `asset-load-map.txt`

### Cart drawer / cart page change

- Read:
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
  - `THEME_SNIPPET_AUDIT.md`
- Inspect first:
  - `sections/main-cart.liquid`
  - cart snippets
  - `assets/theme.min.js`
  - `assets/global.min.js`
  - drawer/cart CSS loads in `asset-load-map.txt`

### Header / menu / mobile nav change

- Read:
  - `THEME_STRUCTURE_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
  - `THEME_JS_DEPENDENCY_AUDIT.md`
- Inspect first:
  - header/menu snippets
  - `theme-audit-data/snippet-reference-counts.txt`
  - `theme-audit-data/key-selector-hits.txt`
  - `theme-audit-data/js-keyword-file-map.txt`

### Adding Theme Editor controls

- Read:
  - `THEME_STRUCTURE_AUDIT.md`
- Inspect first:
  - target section schema
  - actual setting IDs already used in the section/snippets
  - downstream CSS/JS selectors using those values

### CSS-only styling change

- Read:
  - `THEME_CSS_DESIGN_AUDIT.md`
  - `theme-audit-data/key-selector-hits.txt`
  - `theme-audit-data/asset-load-map.txt`

### JS / interaction change

- Read:
  - `THEME_JS_DEPENDENCY_AUDIT.md`
  - `theme-audit-data/js-keyword-file-map.txt`
  - `theme-audit-data/asset-load-map.txt`

### Custom CSS conflict / debugging

- Read:
  - `THEME_CSS_DESIGN_AUDIT.md`
  - `THEME_FRONTEND_SYSTEM_AUDIT.md`
- Inspect first:
  - `snippets/se_cus_css.liquid`
  - `assets/custom.css`
  - late-loaded CSS in `snippets/render_bottom.liquid`

## 10. Shopify / Kalles safety rules

- Do not assume from file names.
- Search actual rendered selectors and schema setting IDs.
- Preserve Kalles / T4S classes unless the change intentionally replaces them.
- Scope CSS to `#shopify-section-{{ section.id }}` where possible.
- Avoid editing minified or vendor JS unless absolutely necessary.
- Keep Shopify schema JSON valid.
- Do not edit `settings_data.json` unless explicitly required.
- Avoid global CSS unless the change is intentionally global.
- Avoid editing high-reference snippets without checking all usage first.
- Test both desktop and mobile.

## 11. Testing checklist

- Homepage:
  - section spacing, heading output, sliders, featured collection blocks
- Collection page:
  - product grid, filters, sorting, pagination/infinite behaviour if present
- Product page:
  - media, variant state, price, quantity, add to cart, sticky/related UI if present
- Cart drawer / cart page:
  - open/close, quantity changes, remove item, subtotal updates, empty state
- Mobile header / menu:
  - drawer open/close, nested nav, search, overlap, body scroll lock
- Search / predictive search:
  - input interaction, result panel, empty state, close behaviour
- Product cards:
  - image, title, price, badges, hover state, quick actions if present
- Filters / facets:
  - checkbox/range interactions, active filter state, clear/reset actions
- Theme Editor settings:
  - confirm setting appears, saves, and affects only intended surface

## 12. Git workflow

- Keep `main` clean.
- Prefer a new branch per implementation task.
- Commit audit docs separately from implementation work.
- Commit small scoped changes.
- Use clear commit messages.
- Run `git status` before and after.
- Review `git diff` before reporting completion.

## 13. What future sessions must report after edits

Every implementation session should report:

1. exact files changed
2. why each file changed
3. which audit/evidence files were used
4. which selectors/settings/render paths were verified before editing
5. what was tested
6. any unresolved risks or follow-up checks
