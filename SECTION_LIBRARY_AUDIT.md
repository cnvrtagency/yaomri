# Section Library Audit

## Existing Custom Sections

| Section | Purpose | Reusability | Notes |
| --- | --- | --- | --- |
| `hero-triple.liquid` | Editorial hero with grid, single, split, carousel and marquee modes | Medium | Powerful but complex. Needs stabilization and simpler controls before reuse. |
| `product-carousel.liquid` | Homepage custom product carousel | Medium | Useful. Custom card avoids Dawn card dependency but duplicates product-card logic. |
| `brand-strip.liquid` | USP strip with static, marquee and carousel modes | High | Good reusable concept. Needs final QA for arrows, separators and editor clarity. |
| `promo-banner.liquid` | Full-bleed campaign banner | High | Strong reusable section. Should be generalized beyond Ya Omri naming later. |
| `yaomri-home-hero.liquid` | Earlier homepage hero | Low | Likely legacy. Keep until migration is complete, then remove or archive. |

## Existing Dawn Sections

Dawn still provides a broad baseline:

- image banner
- image with text
- slideshow
- featured collection
- featured product
- collection list
- multicolumn
- multirow
- rich text
- newsletter
- video
- collapsible content
- contact form

These can be restyled or wrapped, but should not be rewritten casually.

## Custom Section Risks

Common risks found:

- Ya Omri-specific class names and defaults.
- Shared `section-yaomri.css` contains many unrelated section styles.
- Some sections include inline JavaScript per instance.
- Product carousel has custom product-card logic, so collection/product-card improvements may not apply automatically.
- Editorial Hero has had several patches and should be considered fragile until fully QA-tested.
- `templates/index.json` contains saved legacy values that may not match current schemas.

## Reusability Scores

| Section | Score | Reason |
| --- | --- | --- |
| Brand strip | 8/10 | Clear purpose, block-based, simple content model. |
| Promo banner | 8/10 | Strong campaign primitive with common settings. |
| Product carousel | 6/10 | Useful but duplicates product card behavior and includes inactive wishlist button. |
| Editorial Hero | 5/10 | High potential but too many modes and historic layout/overlay issues. |
| Ya Omri home hero | 3/10 | Legacy and store-specific. |

## Missing High-Converting Sections

Recommended reusable library:

- Editorial hero
- Campaign banner
- Image with text editorial
- Featured collection carousel
- Product grid
- Collection cards
- Trust or USP bar
- Reviews/social proof
- Press logo strip
- Founder/story section
- Lookbook gallery
- Promo strip
- Newsletter/signup
- FAQ
- Size guide preview
- Before/after or comparison section
- Store benefits icon row
- Recently viewed products
- Complementary products

## Missing Settings By Section Type

Hero/banner sections should have:

- desktop image
- mobile image
- overlay colour
- overlay opacity
- content width
- content position
- text alignment
- button style
- image radius
- min height

Product sections should have:

- selected collection
- product limit
- items per row
- card gap
- image ratio
- show vendor
- show price
- show badges
- show quick add
- show secondary image
- badge style

Editorial/image sections should have:

- layout direction
- image position
- section width
- image ratio
- mobile stacking order
- text width
- button options

Trust/social sections should have:

- block icons
- block text
- separator style
- layout mode
- marquee option where relevant

## Preset Recommendations

Each reusable section should ship with:

- neutral commercial defaults
- no hardcoded Ya Omri copy
- valid placeholder image labels
- complete block examples
- no collection handles that may not exist
- no URL defaults unless valid strings

## Brand-Specific Dependencies To Remove Later

- Ya Omri class prefixes in reusable sections.
- Ya Omri copy defaults.
- Hardcoded collection URLs such as `/collections/women` or `/collections/resortwear`.
- Palette names tied to Ya Omri instead of generic tokens.
- Loox rating markup in `snippets/card-product.liquid` unless app integration is optional.

