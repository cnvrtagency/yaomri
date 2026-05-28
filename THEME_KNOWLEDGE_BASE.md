# Ya Omri Dawn Theme Knowledge Base

## Theme Base

This theme is based on Shopify Dawn 15.4.1. The safest development model is to preserve Dawn's core systems and add a controlled premium theme layer around them.

Core Dawn systems still in use:

- Header section, menu drawer, dropdown menu, mega menu, search modal, predictive search.
- Cart notification, cart drawer, cart page and product form add-to-cart wiring.
- Product media gallery, variant picker, buy buttons and recommendations.
- Collection filters, sorting, pagination and Dawn product cards.
- Theme editor schema settings and Shopify translation keys.
- JSON-LD for organization, website, product and article structures.

## Key Files And Responsibilities

| File | Responsibility | Edit Risk |
| --- | --- | --- |
| `layout/theme.liquid` | Global asset loading, cart drawer render, predictive search, page shell | High |
| `sections/header.liquid` | Header markup, sticky behavior, logo, nav, search, account, cart icon | High |
| `sections/announcement-bar.liquid` | Dawn announcement strip and slider behavior | Medium |
| `snippets/header-drawer.liquid` | Mobile menu drawer trigger and drawer content | High |
| `snippets/header-search.liquid` | Header search modal trigger and close icon state | High |
| `snippets/cart-drawer.liquid` | Cart drawer markup | High |
| `snippets/cart-notification.liquid` | Cart notification markup | High |
| `assets/cart-drawer.js` | Cart drawer behavior and cart icon interception | High |
| `assets/product-form.js` | Product form add-to-cart behavior | High |
| `sections/main-product.liquid` | Product page structure and product form blocks | High |
| `sections/main-collection-product-grid.liquid` | Collection grid, filters, sorting and product-card render | High |
| `snippets/card-product.liquid` | Dawn product-card render used by collections and related products | Medium |
| `assets/base.css` | Global Dawn base styles | High |
| `assets/section-yaomri.css` | Current Ya Omri premium layer and custom section styles | Medium |
| `config/settings_schema.json` | Global theme settings | High |
| `config/settings_data.json` | Current saved theme settings | Very high |

## Header System

The header remains Dawn's native section with Ya Omri classes appended:

- Wrapper: `header-wrapper yaomri-header-wrapper`.
- Inner header: `header yaomri-header`.
- Dawn grid areas and logo position settings are still active.
- `header-drawer` is rendered when a menu exists.
- `header-dropdown-menu` or `header-mega-menu` is rendered based on `menu_type_desktop`.
- `header-search` is rendered through Dawn's snippet.
- Account link is currently controlled by Shopify customer account availability and `show_account_icon`.
- Cart link keeps `id="cart-icon-bubble"`, which is required by Dawn cart drawer JS.
- Sticky behavior is handled by Dawn's `sticky-header` custom element in `sections/header.liquid`.

Current Ya Omri header settings:

- `nav_font_size`
- `nav_font_weight`
- `nav_text_transform`
- `nav_font_style`
- `nav_gap`
- `show_account_icon`

The visible desktop localisation wrapper is hidden by Ya Omri CSS, but Dawn localisation settings and drawer compatibility are still present.

## Cart System

Dawn cart behavior is controlled by the global `settings.cart_type` value:

- `drawer`: `layout/theme.liquid` renders `cart-drawer`, loads `cart-drawer.js`, and the cart icon opens the drawer.
- `notification`: `sections/header.liquid` renders `cart-notification`, and add-to-cart opens the notification.
- `page`: the cart icon and product form flow fall back to the cart page.

Current `config/settings_data.json` has `cart_type: notification`, so clicking the header cart link to the cart page is expected unless the setting is changed to drawer.

Dawn's cart drawer JS intercepts `#cart-icon-bubble` only when `cart-drawer` exists. Do not replace this with custom header JavaScript unless Dawn's native wiring is proven broken.

Important audit finding from 2026-05-28:

- Popup notification is wired locally, but it is an add-to-cart notification, not a header cart icon drawer.
- If Cart type is `notification`, clicking the header cart icon should navigate to `/cart`.
- If Cart type is `drawer`, Dawn's `cart-drawer.js` converts `#cart-icon-bubble` into a drawer trigger.
- The merchant-facing confusion is the setting label/expectation, not missing cart drawer code.
- Do not add custom cart JavaScript to make notification mode behave like drawer mode.

## Logo And Settings System

The current Ya Omri header separates logo image selection from logo sizing:

- Global theme settings:
  - `settings.logo`
  - `settings.mobile_logo`
- Header section settings:
  - `desktop_logo_width`
  - `mobile_logo_width`
  - `sticky_logo_width`

`sections/header.liquid` now renders the desktop logo from `settings.logo` and the mobile logo from `settings.mobile_logo`, falling back to the main logo when no mobile logo is uploaded.

Logo widths are wired through scoped CSS variables on `.yaomri-header`:

- `--yaomri-header-logo-width`
- `--yaomri-header-mobile-logo-width`
- `--yaomri-header-sticky-logo-width`

The old global Dawn `settings.logo_width` should not be treated as the active header logo size control. If a global `logo_width` remains in settings, verify whether it belongs to the password page before changing it.

Merchant note:

- Theme settings > Logo controls image uploads.
- Header section > Logo sizes controls desktop, mobile and sticky widths.
- Shopify image picker UI may show image controls such as focal/offset/type. Those are not necessarily theme schema settings.

## Product System

The product template is still Dawn-led:

- `templates/product.json` renders `main-product` and `related-products`.
- Product page uses Dawn product media gallery, variant picker, quantity selector, buy buttons and dynamic checkout.
- `snippets/buy-buttons.liquid` and `assets/product-form.js` should be preserved unless a full product-form audit is done.
- Product recommendations are active through Dawn's `related-products` section.

Conversion opportunities exist, but should be layered carefully around Dawn's product form, not by rewriting it.

## Collection And Filter System

The collection template is still Dawn-led:

- `templates/collection.json` renders `main-collection-banner` and `main-collection-product-grid`.
- Filters and sorting use `snippets/facets.liquid`.
- Product cards use `snippets/card-product.liquid`.
- Current collection grid is four columns desktop, two columns mobile.
- Quick add is currently disabled in collection settings.

Any collection-grid changes must preserve filter form names, sorting URLs, pagination and product-card compatibility.

## CSS Architecture

Current CSS architecture is mixed:

- Dawn base and component CSS still provide core layout and accessibility behavior.
- Ya Omri custom styling lives mostly in `assets/section-yaomri.css`.
- `section-yaomri.css` is loaded by the header and by custom sections, so it can affect every page and may be loaded redundantly.
- Header styles are scoped under `.yaomri-header-wrapper` and `.yaomri-header`.
- Custom homepage sections use Ya Omri-prefixed classes such as `.yaomri-hero-triple`, `.yaomri-product-carousel`, `.yaomri-brand-strip` and `.yaomri-promo-banner`.

Long term, split the reusable theme layer into clearer modules:

- global tokens
- header
- announcement
- home sections
- product/collection enhancements

## Custom Section Layer

Existing custom sections:

- `sections/hero-triple.liquid`: Editorial Hero. Powerful but complex and historically fragile.
- `sections/product-carousel.liquid`: custom homepage product carousel. Does not use Dawn card snippet.
- `sections/brand-strip.liquid`: USP strip with static, marquee and carousel modes.
- `sections/promo-banner.liquid`: full-bleed campaign banner.
- `sections/yaomri-home-hero.liquid`: earlier custom hero, likely legacy.

These sections are Ya Omri-specific in naming and styling. They can be made reusable later, but should first be stabilized.

## Known Risks

- Header edits can break search modal, mobile drawer, sticky behavior, cart drawer wiring or JSON-LD.
- Cart edits can break product-form add-to-cart behavior.
- Product template edits can break variant selection, dynamic checkout and accessibility.
- Collection edits can break filters, sorting and pagination.
- `settings_data.json` can be overwritten by Shopify Theme Editor saves or remote theme pulls.
- `assets/base.css` changes can create global regressions across Dawn.
- `section-yaomri.css` is becoming a catch-all layer and needs modularization before resale.
