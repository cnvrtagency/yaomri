# Product, Collection And Cart Audit

## Product Page

Files audited:

- `templates/product.json`
- `sections/main-product.liquid`
- `snippets/buy-buttons.liquid`
- `snippets/product-variant-picker.liquid`
- `snippets/product-media-gallery.liquid`
- `assets/product-form.js`

Current structure:

- Dawn main product section.
- Product media gallery active.
- Variant picker active with swatch support.
- Quantity selector active.
- Buy buttons active.
- Dynamic checkout enabled.
- Product description block active.
- Share block active.
- Related products active.

Conversion gaps:

- No dedicated premium size guide entry point.
- No shipping/returns reassurance block by default.
- No trust badges near add to cart.
- No sticky add-to-cart layer.
- No explicit fit or care details unless merchant adds blocks.
- No upsell/cross-sell block near product form beyond related products.

Recommended improvements:

- Add an optional size guide block.
- Add shipping/returns accordion defaults.
- Add trust badges near product form.
- Add optional sticky add-to-cart after product-form audit.
- Add complementary product block carefully using Dawn's existing complementary products support.

Risk:

High for product form changes. Medium for adding blocks. Low for styling existing blocks.

## Collection Page

Files audited:

- `templates/collection.json`
- `sections/main-collection-banner.liquid`
- `sections/main-collection-product-grid.liquid`
- `snippets/facets.liquid`
- `snippets/card-product.liquid`

Current structure:

- Dawn collection banner.
- Dawn product grid.
- Filtering enabled.
- Sorting enabled.
- Filter type is horizontal.
- Desktop grid uses four columns.
- Mobile grid uses two columns.
- Quick add is disabled.

Conversion gaps:

- Collection intro is basic.
- No subcollection cards.
- No merchandising blocks inside product grid.
- No editorial promo tile inside grid.
- No mobile grid density toggle.
- No premium filter drawer restyle.
- Product-card badging is limited.

Recommended improvements:

- Add reusable collection promo banner.
- Add optional subcollection cards.
- Add product grid merchandising block.
- Add card badge logic for new, sale and low stock.
- Add quick add only after product-form/cart audit.
- Polish facets with scoped CSS before changing Liquid.

Risk:

Filters and sorting are high-risk. Product-card styling is medium-risk. Additional collection sections are lower-risk.

## Product Card

File audited:

- `snippets/card-product.liquid`

Current state:

- Mostly Dawn card-product behavior.
- Uses responsive product images.
- Supports vendor, rating, quick add and badges through Dawn settings.
- Contains hardcoded Loox rating markup:
  ```liquid
  <div class="loox-rating" data-id="{{ card_product.id }}" data-rating="{{ card_product.metafields.loox.avg_rating }}" data-raters="{{ card_product.metafields.loox.num_reviews }}"></div>
  ```

Risk:

The Loox markup creates an app-specific dependency and resale risk. It should become optional or be moved behind an app setting before packaging.

## Cart Notification

Files audited:

- `snippets/cart-notification.liquid`
- `assets/cart-notification.js`
- `sections/header.liquid`

Current behavior:

- Active because `settings.cart_type` is `notification`.
- Add-to-cart uses notification panel.
- Header cart icon remains a normal cart link.

Conversion gaps:

- Notification can be restyled.
- No free shipping progress.
- No upsell in notification.
- Limited reassurance messaging.

Risk:

Medium. Preserve notification IDs and JS targets.

## Cart Drawer

Files audited:

- `sections/cart-drawer.liquid`
- `snippets/cart-drawer.liquid`
- `assets/cart-drawer.js`
- `layout/theme.liquid`

Current behavior:

- Cart drawer assets and markup only load when `settings.cart_type == 'drawer'`.
- Drawer JS intercepts `#cart-icon-bubble`.

Root behavior:

If the theme setting is not drawer, the cart drawer will not open from the header. This is expected.

Recommended premium setup:

- Use Dawn cart drawer as the base.
- Add free shipping bar.
- Add product recommendations or manual upsell block.
- Add trust/payment icons.
- Improve empty-cart state.
- Preserve quantity updates and focus trapping.

Risk:

High if changing JS. Medium if adding markup within existing drawer structure. Low if styling only.

## Cart Page

Files audited:

- `templates/cart.json`
- `sections/main-cart-items.liquid`
- `sections/main-cart-footer.liquid`

Current state:

- Standard Dawn cart page.
- Quantity updates and note support available.
- Checkout button and tax/shipping messaging present.

Recommended improvements:

- Premium empty cart state.
- Cross-sell block.
- Trust messaging.
- Free shipping progress.
- Gift note or packaging message.
- Payment icons.

Risk:

Medium. Cart form fields and quantity inputs must remain Dawn-compatible.

