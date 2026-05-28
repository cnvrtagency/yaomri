# Safe Edit Rules

## Primary Rule

Preserve Dawn behavior first. Add the premium theme layer only where the Dawn contract is understood.

Before editing any risky system, inspect the Liquid, schema, CSS, JavaScript hook and saved settings that control it.

## Safer Files To Edit

These are safer when the task is scoped:

- New documentation files.
- New Online Store 2.0 sections.
- New section-specific assets.
- `assets/section-yaomri.css`, when selectors remain scoped.
- Custom sections already created for Ya Omri, after schema audit.

## Risky Files

Audit before editing:

- `sections/header.liquid`
- `sections/announcement-bar.liquid`
- `layout/theme.liquid`
- `sections/main-product.liquid`
- `sections/main-collection-product-grid.liquid`
- `snippets/card-product.liquid`
- `snippets/facets.liquid`
- `snippets/buy-buttons.liquid`
- `snippets/cart-drawer.liquid`
- `snippets/cart-notification.liquid`
- `assets/global.js`
- `assets/product-form.js`
- `assets/cart-drawer.js`
- `assets/cart-notification.js`
- `config/settings_schema.json`
- `config/settings_data.json`

## Files To Avoid Without Explicit Audit

- `assets/base.css`
- `assets/global.js`
- Product form snippets or scripts.
- Cart drawer scripts.
- Search modal snippets or scripts.
- Mobile drawer snippets.
- Collection filter snippets.
- `settings_data.json`.

## Header Rules

- Keep Dawn classes and append custom classes.
- Preserve `sticky-header`.
- Preserve `header-drawer`.
- Preserve `header-search`.
- Preserve `id="cart-icon-bubble"`.
- Preserve `header-dropdown-menu` and `header-mega-menu`.
- Do not duplicate announcement-bar logic inside the header.
- Do not add custom search or cart JavaScript while Dawn's native systems are available.

## Cart Rules

- First check `settings.cart_type`.
- If cart type is `notification`, cart drawer behavior is not expected.
- If cart type is `drawer`, `layout/theme.liquid` must render `cart-drawer` and load `cart-drawer.js`.
- Cart drawer JS expects `#cart-icon-bubble`.
- Product forms expect either `cart-notification` or `cart-drawer`.
- Do not fake drawer behavior with custom header JavaScript.

## Product Form Rules

- Preserve `product-form` custom element behavior.
- Preserve variant ID inputs.
- Preserve dynamic checkout settings.
- Preserve selling plan and recipient form logic.
- Do not move buy button blocks without checking product-form JS.

## Search Rules

- Preserve `details-modal` behavior.
- Preserve predictive search markup and IDs.
- Search icon and close icon state should follow Dawn's `[open]` details state.
- Do not globally hide close icons.

## Mobile Drawer Rules

- Preserve `header-drawer` structure.
- Preserve `summary` and `details` accessibility behavior.
- Avoid CSS that changes drawer internals unless scoped and tested.

## Filters Rules

- Preserve filter form input names.
- Preserve `facets.js` expectations.
- Preserve sorting and pagination URL behavior.
- Do not rewrite `snippets/facets.liquid` without a dedicated collection audit.

## Shopify Schema Rules

- Schema JSON must parse.
- No trailing commas.
- No duplicate setting IDs in the same schema scope.
- No Liquid syntax in schema defaults.
- Range settings must have at least three possible values.
- URL settings should usually omit `default` unless the default is a valid string.
- Translation keys must exist in locale files if using `t:` references.

## `settings_data.json` Rules

- Treat as saved merchant state.
- Do not edit unless the user explicitly asks.
- When auditing, read it to understand the current theme behavior.
- Shopify Theme Editor saves can overwrite values.
- A theme pull can overwrite local saved settings.

## Shopify CLI Workflow

Recommended checks after code edits:

- Parse changed section schema.
- `git diff --check`.
- `shopify theme check`.
- If upload/syncing, review Shopify CLI schema errors exactly.

Do not run commands that modify theme files during audit-only tasks.

## Git Workflow

- Check `git status --short` before and after work.
- Do not revert unrelated user changes.
- Keep commits scoped.
- Document whether changes are docs-only, CSS-only or schema-affecting.

## When To Audit Before Editing

Audit first when touching:

- header
- cart
- product forms
- search
- mobile drawer
- collection filters
- global settings
- `settings_data.json`
- existing custom sections with saved homepage data

