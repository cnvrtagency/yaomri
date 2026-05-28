# Reusable Theme Roadmap

## Goal

Turn the current Ya Omri Dawn theme into a stable premium Shopify theme layer that preserves Dawn compatibility and can later be generalized, reused and packaged.

## Phase 1: Stabilise Current Ya Omri Theme

Priorities:

1. Stop broad patching and document architecture before changes.
2. Fix header/cart/logo issues in a controlled order.
3. Stabilize Editorial Hero overlay, item model and saved-data compatibility.
4. QA product carousel, brand strip and promo banner.
5. Remove temporary diagnostics and dead settings.
6. Confirm Theme Check warnings are known and separated from new warnings.

Do not:

- Rewrite Dawn header.
- Rewrite product form.
- Add custom cart JS.
- Edit `settings_data.json` casually.

## Phase 2: Abstract Brand Layer

Tasks:

- Move Ya Omri palette into generic theme tokens.
- Define global brand colour settings.
- Define typography scale.
- Define button and border settings.
- Define page width and spacing scale.
- Decide whether logo sizing belongs globally or in header.
- Document all token names.

Naming direction:

- Current: `yaomri-*`
- Future reusable layer: `editorial-*`, `theme-*`, or another neutral prefix.

Migration should be planned, not done as scattered renames.

## Phase 3: Build Reusable Section Library

Core sections:

- Editorial hero
- Campaign banner
- Image with text editorial
- Featured collection carousel
- Product grid
- Collection cards
- Brand strip or trust bar
- Review/social proof
- Lookbook gallery
- FAQ
- Newsletter
- Promo strip
- Rich editorial content block

Section rules:

- Valid presets.
- Complete placeholder defaults.
- Mobile image support for visual sections.
- Consistent spacing controls.
- Consistent item-per-row controls.
- No hardcoded store handles.
- No app-specific dependencies.

## Phase 4: Improve Product, Collection And Cart Conversion

Product:

- Size guide.
- Shipping and returns messaging.
- Trust badges.
- Sticky add-to-cart after audit.
- Product recommendations and complementary products.

Collection:

- Subcollection cards.
- Promo tile inside grid.
- Premium filter drawer styling.
- New/sale/low-stock badge model.
- Mobile grid controls.

Cart:

- Enable Dawn cart drawer if desired.
- Free shipping progress.
- Upsell block.
- Trust/payment icons.
- Premium empty cart.

Rule:

Use Dawn systems first. Custom JavaScript only after native paths are proven insufficient.

## Phase 5: Packaging And Resale Readiness

Checklist:

- Remove Ya Omri-specific names from reusable files or document them as brand layer.
- Remove hardcoded collection URLs.
- Remove app-specific Loox markup or make it optional.
- Ensure every custom section has robust presets.
- Ensure schema labels are merchant-friendly.
- Ensure no temporary comments or debug CSS remain.
- Ensure Theme Check is clean or warnings are documented.
- Create setup guide.
- Create changelog.
- Create safe edit guide for future developers.

## Prioritised Next Fixes

1. Decide cart type: notification or drawer. If drawer is desired, change Theme Editor setting first.
2. Normalize cart icon sizing. Prefer SVG normalization after approval.
3. Remove or reduce fragile header CSS rules that compete with Dawn grid.
4. Stabilize Editorial Hero fully and remove temporary diagnostic comments.
5. QA custom sections on mobile and desktop.
6. Decide global logo sizing architecture.
7. Split or modularize `section-yaomri.css`.

## Do Not Touch Without Audit

- `assets/global.js`
- `assets/product-form.js`
- `assets/cart-drawer.js`
- `snippets/buy-buttons.liquid`
- `snippets/facets.liquid`
- `layout/theme.liquid`
- `config/settings_data.json`

