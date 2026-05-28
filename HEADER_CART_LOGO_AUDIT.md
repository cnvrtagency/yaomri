# Header, Cart And Logo Audit

## Summary

The header is still largely Dawn-native with Ya Omri classes and scoped CSS layered on top. This is the right short-term direction, but some problems are caused by Dawn settings, SVG asset structure and CSS overrides rather than Liquid markup.

## Cart Icon Root Cause

Files audited:

- `assets/icon-cart.svg`
- `assets/icon-cart-empty.svg`
- `assets/icon-search.svg`
- `assets/icon-account.svg`
- `sections/header.liquid`
- `assets/section-yaomri.css`

Finding:

- Search and account icons use small `18 x 19` viewBoxes.
- Cart and empty cart icons use `40 x 40` viewBoxes.
- The visible cart artwork sits inside the larger 40 x 40 box with more internal whitespace.
- Setting the SVG element to the same CSS width and height as search/account does not guarantee equal perceived size.

Root cause:

The cart SVG artwork is not normalized to the same visual box as the other header icons.

Recommended fix:

1. Short term: use scoped CSS on `.yaomri-header .icon-cart` and `.yaomri-header .icon-cart-empty` to calibrate visual scale.
2. Long term: replace or normalize the cart SVGs so their viewBox and artwork density match search/account.

Risk:

- CSS-only sizing can drift across themes, browser zoom and future icon swaps.
- Replacing SVGs is more reliable for a reusable commercial theme, but must be checked against Dawn's cart bubble positioning.

## Cart Drawer Behavior

Files audited:

- `config/settings_schema.json`
- `config/settings_data.json`
- `layout/theme.liquid`
- `sections/header.liquid`
- `snippets/cart-drawer.liquid`
- `snippets/cart-notification.liquid`
- `assets/cart-drawer.js`
- `assets/cart-notification.js`
- `assets/product-form.js`

Current setting:

- `settings.cart_type` is `notification`.

How Dawn works:

- If `cart_type` is `drawer`, `layout/theme.liquid` renders `cart-drawer` and loads `cart-drawer.js`.
- `assets/cart-drawer.js` finds `#cart-icon-bubble`, adds dialog accessibility attributes and prevents the normal cart link navigation.
- If `cart_type` is `notification`, `sections/header.liquid` renders `cart-notification`; the header cart link remains a normal link to the cart page.
- If `cart_type` is `page`, the cart link also navigates to the cart page.

Root cause:

The cart icon goes to the cart page because the current theme setting is `notification`, not `drawer`. This is expected Dawn behavior.

Recommended fix:

- To make the cart icon open the drawer, set Cart type to Drawer in Theme Editor.
- Do not add custom cart drawer JavaScript.
- Only patch header markup if `#cart-icon-bubble` or the cart drawer render path has been broken.

Risk:

Low if solved by Theme Editor setting. High if solved with custom JS.

## Logo Sizing

Files audited:

- `config/settings_schema.json`
- `config/settings_data.json`
- `sections/header.liquid`
- `assets/base.css`

Current Dawn behavior:

- Global setting `settings.logo_width` controls logo render width.
- Current saved value is `140`.
- Header Liquid uses `settings.logo_width` for both main logo branches.
- Sticky `reduce-logo-size` mode changes `.header__heading-logo-wrapper` to `75%` after scrolling.
- There is no native separate mobile logo width setting in Dawn.

Root cause of missing mobile control:

Dawn only ships one global logo width setting.

Recommended reusable approach:

- For a commercial reusable theme, add logo sizing deliberately to the brand/settings architecture:
  - desktop logo width
  - mobile logo width
  - sticky logo width
  - optional alternate mobile/sticky logo images
- Best long-term location: global theme settings under a Brand or Logo group.
- Safer short-term location: header section settings, wired through scoped CSS variables.

Risk:

- Adding header-only logo controls can feel patched and less reusable.
- Adding global logo controls requires `config/settings_schema.json` changes and migration planning.

## Header Settings

Current useful settings:

- `nav_font_size`
- `nav_font_weight`
- `nav_text_transform`
- `nav_font_style`
- `nav_gap`
- `show_account_icon`

Settings to avoid:

- Letter spacing controls named like spacing or gap. They are confusing for merchants.
- Duplicated mobile logo width settings if global brand settings will own logo sizing later.

Recommended commercial settings:

- Nav size
- Nav weight
- Nav case
- Nav style
- Nav gap
- Show search
- Show account
- Show cart
- Show localisation
- Header border
- Header background
- Sticky style
- Logo width desktop
- Logo width mobile
- Logo width sticky

Risk:

Adding too many settings directly to Dawn's header before the architecture is stable makes the section harder to maintain.

## Search And X Icon Behavior

Files audited:

- `sections/header.liquid`
- `snippets/header-search.liquid`
- `assets/section-yaomri.css`

Finding:

- Dawn search uses a details modal state.
- The search icon should show when details is closed.
- The close icon should show only when details is open.
- Current Ya Omri CSS scopes this under `.yaomri-header details[open]`.

Recommended fix status:

- Keep the current details-state approach.
- Do not globally hide `.header__icon-close`.
- Test default closed state and open search state after any header CSS change.

Risk:

Medium. Over-broad CSS can break predictive search and keyboard close behavior.

## Header Alignment

Files audited:

- `sections/header.liquid`
- `assets/section-yaomri.css`

Finding:

- Header layout is a mix of Dawn grid areas and Ya Omri scoped overrides.
- Current CSS keeps Dawn grid areas and refines `.yaomri-header.header--middle-left`.
- This is safer than replacing the header with a new flex-only structure.

Root cause of fragility:

Several header states exist in one file:

- middle-left
- middle-center
- top-left
- top-center
- drawer menu mode
- dropdown mode
- mega menu mode
- sticky/reduce-logo states

Recommended fix:

- Continue using Dawn grid areas.
- Scope all layout overrides under `.yaomri-header`.
- Avoid changing drawer/search internals.
- Test all active header settings in `sections/header-group.json`.

## Recommended Fix Plan

Later code changes should be sequenced:

1. Set cart type to drawer in Theme Editor if drawer behavior is desired.
2. Normalize cart icon visually, preferably by replacing/normalizing SVGs after approval.
3. Add commercial logo sizing settings in a planned settings architecture pass.
4. Reduce header CSS competing rules and keep Dawn grid intact.
5. Add optional search/account/cart visibility settings only where Dawn behavior remains intact.

Files to patch later:

- `sections/header.liquid`
- `assets/section-yaomri.css`
- possibly `assets/icon-cart.svg`
- possibly `assets/icon-cart-empty.svg`
- possibly `config/settings_schema.json` for global logo settings

Files not to touch without separate audit:

- `assets/global.js`
- `assets/cart-drawer.js`
- `assets/product-form.js`
- `snippets/header-search.liquid`
- `snippets/header-drawer.liquid`
- `snippets/cart-drawer.liquid`

