# Theme Settings Architecture

## Current Settings Structure

The theme currently uses Dawn's native global settings plus custom section settings.

Current global settings include:

- logo image
- logo width
- color schemes
- typography
- buttons
- variants
- inputs
- cards
- collection cards
- blog cards
- search
- currency format
- cart type
- social links

Current header custom settings include:

- nav size
- nav weight
- nav case
- nav style
- nav gap
- show account icon

Current custom section settings are powerful but inconsistent. Some sections expose many merchant controls while others still contain Ya Omri-specific naming and assumptions.

## Recommended Global Settings

For a reusable premium theme, global settings should control brand-wide design primitives:

- Brand logo
- Desktop logo width
- Mobile logo width
- Sticky logo width
- Primary colour
- Background colour
- Text colour
- Muted text colour
- Border colour
- Accent colour if needed
- Body font
- Heading font
- Navigation font style
- Button style
- Button border width
- Button radius
- Image radius
- Card radius
- Page width
- Section spacing scale
- Icon size scale

These should avoid Ya Omri-specific labels. Use merchant-friendly terms such as Brand, Header, Buttons, Product cards and Sections.

## Recommended Header Settings

Useful header settings:

- Header layout
- Sticky header
- Logo position
- Mobile logo position
- Desktop logo width
- Mobile logo width
- Sticky logo width
- Nav size
- Nav weight
- Nav case
- Nav style
- Nav gap
- Show search
- Show account
- Show cart
- Show country selector
- Show language selector
- Header border
- Header background
- Header text colour

Avoid:

- Letter spacing controls unless named clearly as letter spacing.
- Multiple settings that control the same spacing.
- Custom mobile logo settings if global logo architecture will own logo sizes.

## Recommended Section Settings

Every reusable section should use a predictable model:

- Content
- Images
- Layout
- Typography
- Colours
- Buttons
- Spacing
- Advanced

Common settings:

- heading
- subheading or eyebrow
- text
- image
- mobile image
- CTA labels and links
- background colour
- text colour
- button colours
- padding top
- padding bottom
- section width
- image radius

Multi-item sections should share:

- items per row desktop
- items per row tablet
- items per row mobile
- gap desktop
- gap mobile
- display mode where relevant

## Global Versus Section Settings

Belongs globally:

- brand colours
- typography base
- button defaults
- logo defaults
- page width
- product-card defaults
- border radius defaults
- icon scale

Belongs per section:

- section content
- selected collection
- local image
- local overlay
- local button colour override
- local spacing
- local layout mode

## Naming Conventions

Use short merchant-facing labels:

- Nav size
- Nav gap
- Button style
- Image radius
- Desktop items
- Mobile items

Use stable technical IDs:

- `nav_font_size`
- `nav_gap`
- `image_radius`
- `items_per_row_desktop`
- `padding_top`

Avoid brand-specific IDs in reusable components unless the section is intentionally store-specific.

## Settings To Remove Or Avoid

Avoid these patterns:

- Duplicated count controls such as items per row plus separate tiles to show.
- Schema defaults containing Liquid syntax.
- URL settings with invalid defaults.
- Layout-specific settings that still appear to affect other layouts.
- Controls that change no visible output.
- Long labels or explanatory paragraphs in labels.
- Settings named spacing when they control letter spacing.

## Resale Readiness

Before resale:

- Move Ya Omri tokens into generic theme tokens.
- Rename Ya Omri-specific section names and class prefixes in a planned migration.
- Convert store-specific defaults into neutral commercial defaults.
- Document setting migrations.
- Ensure presets are useful without saved `settings_data.json`.
- Remove app-specific dependencies from core snippets.

