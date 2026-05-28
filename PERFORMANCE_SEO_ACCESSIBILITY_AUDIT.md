# Performance, SEO And Accessibility Audit

## Performance Findings

### CSS Loading

Current state:

- Dawn base CSS is loaded globally.
- Component CSS is loaded conditionally in sections.
- `assets/section-yaomri.css` is loaded by the header and by custom sections.

Risk:

`section-yaomri.css` has become a shared catch-all file. Loading it in the header means custom section CSS can load on every page. If custom sections also load it, duplicate stylesheet links can occur.

Recommendation:

- Keep tokens and shared utilities in one global Ya Omri file.
- Split large section-specific styles later if performance becomes a problem.
- Avoid loading the same CSS file from every section once header already loads it globally.

### JavaScript Loading

Current state:

- Dawn scripts are mostly conditional.
- Cart drawer JS loads only for drawer cart type.
- Predictive search JS loads when predictive search is enabled.
- Some custom sections include scoped inline JS for carousel behavior.

Risk:

Inline per-section scripts can duplicate when multiple instances are used.

Recommendation:

- Keep section JS lightweight and scoped.
- Prefer native scroll behavior where possible.
- Avoid global custom JS until a dedicated theme script layer exists.

### Images

Current state:

- Dawn product and collection images use responsive `image_url` and `image_tag` patterns.
- Custom homepage sections also generally use Shopify image filters.

Recommendation:

- Use mobile image settings for hero/banner sections.
- Use appropriate widths.
- Use eager loading only for first viewport hero images.
- Lazy load below-the-fold content.

### Fonts And Render Blocking

Current state:

- Dawn font loading remains intact.
- Custom CSS could become render-blocking if it keeps growing.

Recommendation:

- Keep typography driven by theme settings.
- Avoid loading unnecessary external fonts.
- Audit CSS size before packaging.

## SEO Findings

Preserved Dawn defaults:

- Organization JSON-LD in header.
- Website search JSON-LD on index.
- Product SEO structures in product sections.
- Article and collection templates largely Dawn-native.
- Logo alt falls back to shop name.

Risks:

- Custom homepage sections can create weak heading hierarchy if every section uses large headings without structure.
- Placeholder text may be indexed if accidentally published.
- Hardcoded collection links can lead to 404s on reused themes.
- App-specific Loox markup creates dependency risk.

Recommendations:

- Use one clear H1 per template.
- Hero sections should allow heading tag control only if carefully documented.
- Avoid hardcoded store handles in reusable presets.
- Keep JSON-LD Dawn-native unless extending with a full SEO audit.

## Accessibility Findings

Preserved Dawn defaults:

- Skip link.
- Header nav semantics.
- Details-based search modal.
- Mobile menu drawer semantics.
- Cart drawer focus handling when enabled.
- Product form accessibility.
- Facet drawer accessibility.

Custom risks:

- Header CSS can hide or expose the search close icon incorrectly.
- Inert wishlist buttons in product carousel can confuse keyboard and screen reader users.
- Merchant-controlled overlay and text colours can create poor contrast.
- Marquee motion can affect motion-sensitive users.
- Custom carousel arrows must remain keyboard reachable and scoped.
- Placeholder image blocks need text alternatives or clear decorative handling.

Recommendations:

- Preserve focus styles.
- Never remove visually hidden labels from Dawn controls.
- Respect `prefers-reduced-motion` for marquee/carousel movement.
- Do not use buttons for links or links for buttons.
- Ensure icon-only buttons have accessible labels.
- Add contrast guidance for merchant colour settings.

## Known Theme Check Warnings

Recent theme check warnings were Dawn-related and should be tracked separately:

- `layout/password.liquid`: `scheme_classes` undefined.
- `layout/theme.liquid`: `scheme_classes` undefined.
- `sections/featured-product.liquid`: unused `seo_media`.
- `sections/main-article.liquid`: variable name `anchorId`.
- `sections/main-list-collections.liquid`: variable name `moduloResult`.
- `sections/main-product.liquid`: unused `seo_media`.
- `sections/main-product.liquid`: `continue` undefined warning.
- `sections/main-search.liquid`: unused `product_settings`.
- `snippets/quick-order-product-row.liquid`: orphaned snippet.

## Guardrails

- Keep Dawn accessibility markup unless there is a specific replacement plan.
- Test header, drawer, search and cart using keyboard.
- Run Theme Check after schema or Liquid changes.
- Do not hide focus outlines globally.
- Do not introduce app dependencies into core snippets without settings.

