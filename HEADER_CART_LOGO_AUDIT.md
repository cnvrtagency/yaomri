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

---

# Full Header, Cart, Settings And Wiring Audit - 2026-05-28

This section records the deeper read-only wiring audit completed after the Ya Omri header, cart, logo, icon and settings changes. It should be treated as the current reference before further header/cart/settings patches.

No theme code was edited during the audit. The audit was based on local code inspection of:

- `config/settings_schema.json`
- `config/settings_data.json`
- `layout/theme.liquid`
- `sections/header.liquid`
- `sections/announcement-bar.liquid`
- `sections/header-group.json`
- `sections/footer-group.json`
- `sections/footer.liquid`
- `snippets/header-search.liquid`
- `snippets/header-drawer.liquid`
- `snippets/cart-drawer.liquid`
- `snippets/cart-notification.liquid`
- `snippets/buy-buttons.liquid`
- `snippets/social-icons.liquid`
- `snippets/icon-yaomri-search.liquid`
- `snippets/icon-yaomri-account.liquid`
- `snippets/icon-yaomri-cart.liquid`
- `snippets/icon-yaomri-menu.liquid`
- `snippets/icon-yaomri-close.liquid`
- `assets/cart-drawer.js`
- `assets/cart-notification.js`
- `assets/product-form.js`
- `assets/predictive-search.js`
- `assets/global.js`
- `assets/base.css`
- `assets/section-yaomri.css`
- `assets/component-cart-drawer.css`
- `assets/component-cart-notification.css`
- `assets/component-search.css`
- `assets/component-menu-drawer.css`
- `templates/cart.json`
- `templates/search.json`
- `sections/product-carousel.liquid`

## Executive Findings

### Working

- Dawn cart drawer mode is present and wired correctly.
- Dawn cart notification mode is present and wired for add-to-cart.
- Dawn cart page mode is present.
- Header cart link still keeps `id="cart-icon-bubble"`.
- Predictive search is present and wired.
- Header remains mostly Dawn-native.
- Mobile drawer remains Dawn-native.
- Search modal remains Dawn-native.
- Sticky header remains Dawn-native.
- Header account icon has a section-level `show_account_icon` setting.
- Ya Omri custom header icons now include Dawn compatibility classes.
- Local color scheme schema/data are present and structurally valid.
- Global social settings are wired into footer, announcement bar, mobile drawer and password footer.

### Partially Working

- Header icon alignment is structurally improved, but final optical alignment still requires browser verification.
- Mobile logo support is wired, but `settings.mobile_logo` is currently blank in local `settings_data.json`.
- Header logo width settings are wired in the Header section, but the split between global image upload and section sizing needs merchant documentation.
- Product carousel wishlist button renders but has no behavior.

### Broken Or Misleading

- Cart type `notification` is misleading for merchants who expect the header cart icon to open a popup. In Dawn, notification mode means add-to-cart popup, not cart icon popup.
- Social settings can appear useless because all current social URLs are blank and announcement social display is off.
- Predictive search options can appear useless unless the merchant tests by typing in search.
- Active header setting `logo_position: middle-center` can conflict with the desired visual goal of logo left, nav immediately after logo, icons right.

### Highest-Risk Areas

- `config/settings_data.json`: very high risk because it contains saved Theme Editor state.
- `assets/cart-drawer.js`, `assets/cart-notification.js`, `assets/product-form.js`: high risk because Dawn cart behavior depends on these.
- `snippets/header-search.liquid` and `snippets/header-drawer.liquid`: high risk because icon state, focus and accessibility depend on Dawn details/summary structures.
- `assets/base.css`: high risk because it controls global Dawn layout, icons and accessibility states.

## Current Global Settings Wiring

| Group | Setting ID | Current Value | Storefront Wiring | Status | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Logo | `logo` | `shopify://shop_images/ya-omri-logo.svg` | Used by header, mobile fallback and JSON-LD | Working | Keep |
| Logo | `mobile_logo` | blank | Used by header mobile logo when uploaded | Wired but unset | Keep |
| Colors | `color_schemes` | `scheme-1` through `scheme-5` present | Used by layout color CSS generation and section color schemes | Working locally | Keep and do not rename |
| Favicon | `favicon` | blank | Used by theme layout if uploaded | Wired but unset | Keep |
| Password page logo | `logo_width` | `50` | Password-page logo width after restructure | Potentially confusing | Do not treat as header logo width |
| Typography | `type_body_font` | Assistant | Global body font CSS variables | Working | Keep |
| Typography | `body_scale` | `100` | Global body scale | Working | Keep |
| Typography | `type_header_font` | Assistant | Global heading font CSS variables | Working | Keep |
| Typography | `heading_scale` | `100` | Global heading scale | Working | Keep |
| Layout | `page_width` | `1200` | Dawn page-width CSS vars | Working | Keep |
| Layout | `spacing_sections` | `0` | Dawn section spacing | Working | Keep |
| Layout | `spacing_grid_horizontal` | `8` | Dawn grid horizontal gaps | Working | Keep |
| Layout | `spacing_grid_vertical` | `8` | Dawn grid vertical gaps | Working | Keep |
| Animations | `animations_reveal_on_scroll` | `true` | Dawn scroll reveal behavior | Working | Keep |
| Animations | `animations_hover_elements` | `none` | Dawn hover behavior | Working | Keep |
| Social | `social_facebook_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_instagram_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_youtube_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_tiktok_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_twitter_link` | blank | Footer, announcement, drawer, password footer, meta tags | Wired but empty | Keep |
| Social | `social_snapchat_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_pinterest_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_tumblr_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Social | `social_vimeo_link` | blank | Footer, announcement, drawer, password footer | Wired but empty | Keep |
| Search | `predictive_search_enabled` | `true` | Loads predictive search CSS/JS and wrapper markup | Working | Keep |
| Search | `predictive_search_show_vendor` | `false` | Predictive product result display | Working but only visible in results | Keep |
| Search | `predictive_search_show_price` | `false` | Predictive product result display | Working but only visible in results | Keep |
| Currency | `currency_code_enabled` | `true` | Price formatting | Working | Keep |
| Cart | `cart_type` | `notification` | Drawer, page or add-to-cart notification mode | Working but misleading | Decide whether to keep notification |
| Cart | `show_vendor` | `false` | Cart line-item vendor display | Working | Keep |
| Cart | `show_cart_note` | `false` | Cart note in cart UI | Working | Keep |
| Cart | `cart_drawer_collection` | blank | Empty drawer collection recommendation | Wired but unset | Keep |
| Cart | `cart_color_scheme` | `scheme-1` | Cart drawer color scheme | Working in drawer mode | Keep |

## Color Scheme Audit

Local files contain both required pieces for Shopify color schemes:

- `config/settings_schema.json` has a `color_scheme_group` setting with id `color_schemes`.
- `config/settings_data.json` has `current.color_schemes` with `scheme-1`, `scheme-2`, `scheme-3`, `scheme-4` and `scheme-5`.

Sections currently referencing scheme IDs include:

- Header group: `color_scheme: scheme-1`, `menu_color_scheme: scheme-1`
- Announcement bar: `color_scheme: scheme-1`
- Footer: `color_scheme: scheme-1`
- Cart template sections: `scheme-1`
- Cart drawer global scheme: `cart_color_scheme: scheme-1`

Conclusion:

- Local color scheme wiring is valid.
- If Shopify Theme Editor still says color schemes must be defined, the problem is likely remote theme state, stale editor state, or a push/pull mismatch against the visible theme.
- Do not blindly edit `settings_data.json`.
- First compare local files to visible theme ID `164572430425`.

Safe validation commands:

```bash
ruby -r json -e 'JSON.parse(File.read("config/settings_schema.json")); JSON.parse(File.read("config/settings_data.json")); puts "json ok"'
shopify theme check
```

## Cart System Deep Audit

### Setting Source

`config/settings_schema.json` defines:

- `cart_type`
- option `drawer`
- option `page`
- option `notification`
- default `notification`

`config/settings_data.json` currently stores:

- `cart_type: notification`

### Drawer Mode

Drawer mode is active when `settings.cart_type == 'drawer'`.

Render path:

- `layout/theme.liquid` loads `component-cart-drawer.css`.
- `layout/theme.liquid` renders `{% render 'cart-drawer' %}`.
- `layout/theme.liquid` loads `cart-drawer.js`.
- `snippets/cart-drawer.liquid` renders `<cart-drawer>`, `#CartDrawer`, overlay, line items, footer and checkout controls.

Header trigger path:

- `sections/header.liquid` renders the cart link with `id="cart-icon-bubble"`.
- `assets/cart-drawer.js` finds `#cart-icon-bubble`.
- `CartDrawer.setHeaderCartIconAccessibility()` adds dialog attributes, prevents default link navigation and opens the drawer.

Expected behavior:

- Header cart icon opens drawer.
- Product add-to-cart opens/updates drawer.
- Cart bubble refreshes through section rendering.

Status:

- Confirmed by user: cart works when Theme settings > Cart > Cart type is Drawer.
- No custom JS should be added.

### Notification Mode

Notification mode is active when `settings.cart_type == 'notification'`.

Render path:

- `sections/header.liquid` loads `component-cart-notification.css`.
- `sections/header.liquid` loads `cart-notification.js`.
- `sections/header.liquid` renders `{% render 'cart-notification' %}`.
- `snippets/cart-notification.liquid` renders `<cart-notification>`, `#cart-notification`, `#cart-notification-product`, `#cart-notification-button` and checkout form.

Trigger path:

- `assets/product-form.js` sets `this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer')`.
- Product form AJAX submits to `routes.cart_add_url`.
- If a cart UI exists, product form appends sections from `this.cart.getSectionsToRender()`.
- `CartNotification.renderContents()` updates notification sections and calls `open()`.

Expected behavior:

- Add-to-cart opens popup notification.
- Header cart icon remains a normal link to `/cart`.

Status:

- Notification mode is wired locally.
- It is misleading if the merchant expects the cart icon to open a popup.
- If add-to-cart does not trigger notification in browser, debug product-form JS, network response sections and console errors before editing cart code.

### Page Mode

Page mode is active when `settings.cart_type == 'page'`.

Expected behavior:

- Header cart icon links to `/cart`.
- Product form falls back to cart page behavior when no cart drawer/notification element exists.
- `templates/cart.json` renders `main-cart-items` and `main-cart-footer`.
- `sections/main-cart-items.liquid` loads `cart.js` unless cart type is drawer.

Status:

- Dawn page mode is intact.

### Cart Recommendation

For Ya Omri, the commercial recommendation is:

- Prefer Drawer as the default cart mode.
- Either remove/deprecate Notification from the merchant-facing cart type setting, or clearly document that it is an add-to-cart notification only.
- Do not write custom JS to make Notification mode behave like Drawer mode.

## Header Component Audit

### Header Wrapper

The header remains Dawn-native:

- Sticky wrapper: `sticky-header` unless sticky type is `none`.
- Classes include `header-wrapper yaomri-header-wrapper`.
- Inner header includes `header yaomri-header`.
- Dawn logo position classes remain active.
- Dawn mobile logo position classes remain active.
- Dawn menu type classes remain active.

### Active Header Group Settings

`sections/header-group.json` currently stores:

- `logo_position: middle-center`
- `mobile_logo_position: center`
- `menu: main-menu`
- `menu_type_desktop: dropdown`
- `sticky_header_type: reduce-logo-size`
- `show_line_separator: true`
- `nav_font_size: 12`
- `nav_font_weight: 800`
- `nav_text_transform: uppercase`
- `nav_font_style: normal`
- `nav_gap: 34`
- `color_scheme: scheme-1`
- `menu_color_scheme: scheme-1`
- `show_account_icon: false`
- `enable_country_selector: false`
- `enable_language_selector: false`
- `enable_customer_avatar: false`
- `padding_top: 12`
- `padding_bottom: 12`

Important implication:

- CSS written only for `.yaomri-header.header--middle-left` will not affect the current desktop header because the active class is `header--middle-center`.

### Logo

Header Liquid assigns:

- `header_logo = settings.logo`
- `header_mobile_logo = settings.mobile_logo`
- mobile falls back to desktop logo when blank
- desktop falls back to mobile logo only if desktop logo is blank

Header sizes:

- `desktop_logo_width`
- `mobile_logo_width`
- `sticky_logo_width`

Variables output on `.yaomri-header`:

- `--yaomri-header-logo-width`
- `--yaomri-header-mobile-logo-width`
- `--yaomri-header-sticky-logo-width`

CSS consumes these variables in `assets/section-yaomri.css`.

### Search

`snippets/header-search.liquid` keeps Dawn details modal structure:

- `<details-modal class="header__search">`
- `<details>`
- summary with `header__icon header__icon--search`
- search icon wrapper
- close icon wrapper with `header__icon-close`
- predictive search form when enabled
- modal close button

The visible search icon now renders `icon-yaomri-search`.

The header toggle close icon now renders `icon-yaomri-close`.

The modal close button also renders `icon-yaomri-close`.

Search state CSS:

- closed details hides `.header__icon-close`
- open details shows `.header__icon-close`
- open search hides the non-close icon wrapper

Status:

- Structurally correct.
- Do not globally hide `.header__icon-close`.
- Do not remove Dawn details/summary markup.

### Mobile Drawer

`snippets/header-drawer.liquid` keeps Dawn drawer structure:

- `<header-drawer>`
- `<details id="Details-menu-drawer-container">`
- summary with `header__icon header__icon--menu`
- menu icon
- close icon
- `#menu-drawer`
- nested drawer navigation
- drawer utility links
- mobile localization
- drawer social list

The top drawer menu icon now renders `icon-yaomri-menu`.

The drawer close icon now renders `icon-yaomri-close`.

Compatibility classes on SVGs are required:

- menu must include `icon-hamburger`
- close must include `icon-close`

Status:

- Structurally correct after compatibility class restoration.

### Account

Header account icon is conditional:

- `shop.customer_accounts_enabled`
- `section.settings.show_account_icon`

Current header group has `show_account_icon: false`, so top header account icon is intentionally hidden.

Drawer account link remains controlled by Dawn customer account availability and is not governed by `show_account_icon`.

### Cart Icon

Header cart link remains:

```liquid
<a href="{{ routes.cart_url }}" class="header__icon header__icon--cart link focus-inset" id="cart-icon-bubble">
```

This is the critical Dawn-compatible markup.

Current visible cart icon renders `icon-yaomri-cart`.

The Ya Omri cart icon uses a `24 x 24` viewBox and compatibility class `icon-cart`.

Status:

- Drawer functionality depends on `cart_type: drawer`, not icon SVG markup.
- Optical alignment must be verified visually.

### Header Icon Alignment

Current CSS:

- `.yaomri-header .header__icon` is `4.2rem` square.
- `.yaomri-header .header__icon .svg-wrapper` is `4.2rem` square.
- `.yaomri-header .header__icon .icon` is `2rem`.
- `.yaomri-header .icon-yaomri` is `2.2rem`.

Because `.icon-yaomri` appears later and applies directly to the SVG, Ya Omri icons render at `2.2rem`.

All Ya Omri icons use `viewBox="0 0 24 24"` and stroke-based currentColor artwork.

Remaining mismatch, if visible, is probably optical SVG geometry:

- Search circle/handle center of mass differs from bag body/handle.
- Cart bubble can affect perceived weight.
- Wrapper sizes are consistent by CSS.

Recommended next check:

- Browser screenshot at desktop and mobile.
- Inspect computed `width`, `height`, `line-height`, `display`, `align-items` on `.header__icon`, `.svg-wrapper` and SVG.
- Adjust SVG path geometry before adding CSS scaling hacks.

## Logo And Mobile Logo Audit

Current global Logo group:

- `logo` image picker
- `mobile_logo` image picker

Current local value:

- `settings.logo` has Ya Omri SVG.
- `settings.mobile_logo` is blank.

Header section sizing settings:

- `desktop_logo_width`
- `mobile_logo_width`
- `sticky_logo_width`

The header no longer depends on a global `settings.logo_width` for header logo sizing.

If a merchant sees image controls such as "Vertical offset" or "Type" in the Theme Editor logo uploader, those are likely Shopify image picker/editor controls, not storefront schema settings. Do not try to remove them from theme schema without proving their source.

## Search Suggestions Audit

Global settings:

- `predictive_search_enabled: true`
- `predictive_search_show_vendor: false`
- `predictive_search_show_price: false`

Render path:

- `layout/theme.liquid` loads predictive search assets when enabled.
- `snippets/header-search.liquid` wraps the search form in `<predictive-search>`.
- Search input gets combobox and predictive result ARIA attributes.
- `assets/predictive-search.js` fetches predictive results from `routes.predictive_search_url`.
- `sections/main-search.liquid` also uses predictive search.

Expected behavior:

- Suggestions appear only after the user opens search and types.
- Vendor and price settings affect product suggestion rows, not the closed header icon.

Status:

- Wired.
- Keep.

## Social Links Audit

Global social settings are all blank in local `settings_data.json`.

Render paths:

- `snippets/social-icons.liquid`
- `sections/footer.liquid`
- `sections/announcement-bar.liquid`
- `snippets/header-drawer.liquid`
- `sections/main-password-footer.liquid`
- `snippets/meta-tags.liquid`
- header JSON-LD `sameAs`

Active section settings:

- Footer `show_social: true`
- Announcement bar `show_social: false`

Expected behavior:

- Footer social icons render only when at least one global social link is nonblank.
- Announcement social icons require global links and announcement `show_social: true`.
- Drawer social icons render when global links are nonblank.

Status:

- Social settings are wired but empty.
- They are not dead.

## Footer Audit

Footer is still Dawn-led.

Active footer settings:

- `newsletter_enable: true`
- `show_social: true`
- `enable_follow_on_shop: true`
- `enable_country_selector: true`
- `enable_language_selector: true`
- `payment_enable: true`
- `show_policy: true`

Because all global social links are blank, footer social icons do not render.

Recommendation:

- Do not patch footer for social visibility until social URLs are added.
- Future footer restyle should preserve newsletter, social, payment icons, policies and localization.

## Product Carousel Wishlist Audit

`sections/product-carousel.liquid` has `show_wishlist` and renders heart buttons.

There is no matching wishlist JavaScript, localStorage state, app integration, wishlist page or header wishlist icon.

Conclusion:

- Wishlist is currently dead UX.
- Short-term fix should be to default it off or hide it until implemented.
- Long-term wishlist requires a separate feature design and probably JavaScript.

## Ya Omri CSS Audit Notes

`assets/section-yaomri.css` currently contains:

- token/foundation styles
- hero styles
- brand strip styles
- product carousel styles
- promo banner styles
- late hero overlay repair selectors
- header and announcement styles

Risky CSS zones:

- Late hero overlay selectors are intentionally high-specificity repair selectors.
- Header icon state selectors depend on Dawn compatibility classes.
- Desktop alignment rules for `.header--middle-left` do not affect active `middle-center` layout.
- Desktop localization is intentionally hidden under `.yaomri-header .desktop-localization-wrapper`.

Cleanup order:

1. Do not remove repair selectors until visual QA confirms replacements.
2. Finish header icon optical alignment using screenshots.
3. Decide cart notification setting strategy.
4. Hide or implement wishlist.
5. Modularize `section-yaomri.css` later.

## Minimal Next Patch Recommendation

First safe patch should address cart setting confusion, not JS:

- Patch `config/settings_schema.json`.
- Remove or deprecate the `notification` cart type option, or relabel/document it clearly.
- Prefer defaulting to `drawer` for Ya Omri.
- Do not edit `settings_data.json` without explicit approval.
- Do not edit cart JS.

Alternative no-code path:

- Set Theme settings > Cart > Cart type to Drawer.
- Document that Notification is only for add-to-cart popups.

## Validation Plan

Use visible theme ID `164572430425` for production-visible sync checks. Use development theme ID `164572233817` only for explicit testing.

Read-only checks:

```bash
git status --short
ruby -r json -e 'JSON.parse(File.read("config/settings_schema.json")); JSON.parse(File.read("config/settings_data.json")); puts "json ok"'
rg -n "cart_type|notification|drawer|cart-icon-bubble|cart-notification|cart-drawer" config layout sections snippets assets templates
rg -n "predictive_search|predictive-search|Search-In-Modal" config layout sections snippets assets templates
rg -n "social_.*_link|show_social|social-icons|list-social" config sections snippets assets
rg -n "mobile_logo|logo_width|desktop_logo_width|mobile_logo_width|sticky_logo_width" config sections layout assets
```

After future patches:

```bash
git diff --check
shopify theme check
```

Theme Editor checks:

- Cart type Drawer opens drawer from header cart icon.
- Cart type Page navigates to cart page.
- If Notification remains, add-to-cart opens popup notification.
- Search closed state shows search icon only.
- Search open state shows close icon.
- Mobile drawer opens and closes.
- Header account setting hides/shows top account icon when customer accounts are enabled.
- Mobile logo upload falls back correctly when blank.
- Footer social icons render after social links are added.

