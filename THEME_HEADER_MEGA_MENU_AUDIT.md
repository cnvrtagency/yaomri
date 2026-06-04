# THEME_HEADER_MEGA_MENU_AUDIT

Date: 2026-06-04
Repo: `/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit`
Scope: audit-only

## 1. Header architecture overview

The header is not a single section. It is a render system composed of:
- `layout/theme.liquid` as the global render entrypoint
- `snippets/header.liquid` as the header router
- one active header section chosen from theme settings
- shared snippets for logo, navigation, icons, search, split menus, and mobile trigger
- a separate hidden `sections/mega-menu.liquid` content source for desktop mega menu payloads
- shared CSS in `assets/base.css`, `assets/mega-menu.css`, and `assets/t4s-submenu.css`
- shared runtime behavior in minified global theme JS, referenced via `data-header-options`, menu hover classes, and drawer/data attributes

The system is split into:
- header shell selection
- desktop top-level nav rendering
- dropdown submenu rendering
- mega-menu content rendering
- icon/search/account/cart rendering
- sticky/transparent state handling
- mobile drawer trigger handling

The theme uses multiple header designs. The active one is selected by the global theme setting `settings.header_design`, then routed through `snippets/header.liquid`.

## 2. Header render path

Primary render path:

1. `layout/theme.liquid`
   - renders `{% render 'header', t_name: t_name %}` near the top of the page, inside `.t4s-website-wrapper`

2. `snippets/header.liquid`
   - always renders:
     - `section 'announcement-bar'`
     - `section 'top-bar'`
   - then conditionally renders one header section based on `settings.header_design`
   - in Theme Editor / design mode, it also renders hidden helper sections for mega-menu editing

Actual routing found in `snippets/header.liquid`:
- `header-inline`
- `header-sidebar`
- `header-bottom`
- `header-categories-menu`
- `header-vertical`

Additional helper sections rendered conditionally:
- `section 'mega-menu'`
- `section 'header-categories'` for the categories design in design mode

Implication:
- header behavior is shared through snippets and CSS, but merchant-facing control lives in the active header section schema plus the separate mega-menu section schema.

## 3. Header section inventory

### `sections/header-inline.liquid`
Purpose:
- primary standard desktop header
- supports multiple layout variants

Notable layouts:
- `logo_left`
- `logo_center`
- `menu_split`
- `logo_search`

Shared snippets rendered:
- `menu_blocks`
- `menu_splits`
- `push_menu`
- `t4s_group_btns`
- `t4s_group_btns_split`
- `t4s_logo`

Key settings families:
- `full_header`
- desktop heights
- transparent header
- sticky header
- nav typography/colors
- icon settings
- menu block settings for `mega`, `drop`, `simple`

Risk level:
- high
- this is the most common shared desktop header path

### `sections/header-bottom.liquid`
Purpose:
- two-row header with navigation on the bottom row

Shared snippets rendered:
- `menu_blocks`
- `push_menu`
- `search_form_header`
- `social_sharing`
- `t4s_group_btns`
- `t4s_group_btns_split`
- `t4s_logo`

Key settings families:
- `full_header`
- top height / bottom height
- sticky / transparent header
- nav blocks for mega/drop/simple

Risk level:
- high

### `sections/header-sidebar.liquid`
Purpose:
- desktop horizontal header with alternate left/right menu composition

Shared snippets rendered:
- `pr-sidebar-loop`
- `push_menu`
- `social_sharing`
- `t4s_group_btns`
- `t4s_logo`

Notable behavior:
- includes a `menu_right` desktop mode
- injects desktop CSS that can move `#t4s-menu-drawer` and its sibling close button to the right in that mode

Risk level:
- high

### `sections/header-categories-menu.liquid`
Purpose:
- header with categories trigger plus standard nav

Shared snippets rendered:
- `menu_blocks`
- `pr-sidebar-loop`
- `push_menu`
- `t4s_group_btns`
- `t4s_logo`

Notable behavior:
- has separate mid and bottom header rows
- full-width container logic differs slightly from inline/bottom/sidebar
- category heading width hard-coded in section CSS

Risk level:
- high

### `sections/header-vertical.liquid`
Purpose:
- fixed desktop vertical sidebar header

Shared snippets rendered:
- `currencies`
- `languages`
- `menu_blocks`
- `push_menu`
- `social_sharing`
- `t4s_group_btns`
- `t4s_logo`

Notable behavior:
- fixed `280px` desktop sidebar width
- shifts `.t4s-website-wrapper`
- mega/drop menus open rightward from the fixed sidebar
- sticky/transparent header behavior is effectively disabled here

Risk level:
- very high
- separate layout contract from all other headers

### `sections/mega-menu.liquid`
Purpose:
- hidden content source for desktop mega menu payloads
- not the same thing as top-level menu item definitions

Notable behavior:
- outputs grouped mega menu content buckets keyed by block `id`
- is consumed by header top-level mega menu items through shared `id` matching
- includes many merchandising/content block types

Risk level:
- very high
- the real merchant-facing content source for desktop mega menus

## 4. Header render responsibilities by file

### `layout/theme.liquid`
Owns:
- global page shell
- initial header render call
- document classes including `t4s-header__{{ settings.header_design }}`
- global JS/CSS load order

### `snippets/header.liquid`
Owns:
- choosing which header section renders
- injecting announcement bar and top bar before the chosen header section
- rendering hidden helper sections in Theme Editor

### `snippets/t4s_logo.liquid`
Owns:
- normal, sticky, transparent, and mobile logo image selection
- logo width variants
- output classes for CSS state switching

### `snippets/menu_blocks.liquid`
Owns:
- top-level desktop menu item rendering for the active header section
- decides whether a top-level item is:
  - `mega`
  - `drop`
  - simple link
- binds mega menu top-level items to the separate `mega-menu` section via matching numeric `id`
- binds dropdown top-level items to Shopify Navigation menus via `linklists[bk_stts.menu]`

### `snippets/menu_dropdown.liquid`
Owns:
- dropdown submenu markup for `drop` menu items
- reads Shopify Navigation directly from `linklists[handle_menu].links`
- supports 3 levels of navigation

### `sections/mega-menu.liquid`
Owns:
- merchandising/content payload for top-level mega items
- banner blocks
- collection blocks
- product blocks
- link/link2 menu blocks
- html blocks
- blog/article blocks

### `snippets/t4s_group_btns.liquid` and `snippets/t4s_group_btns_split.liquid`
Owns:
- search icon/search form behavior
- account icon/account dropdown or login drawer trigger
- wishlist icon/link
- cart icon/cart drawer trigger or cart page link

### `snippets/push_menu.liquid`
Owns:
- mobile drawer trigger only
- relevant to header/mobile overlap because it targets `#t4s-menu-drawer`

## 5. Desktop menu and mega menu system

The desktop nav is section-block-driven, not purely Shopify Navigation driven.

### Top-level menu ownership
Top-level items are built in `snippets/menu_blocks.liquid` from `section.blocks` of the active header section.

That means merchants edit top-level desktop menu items through the active header section blocks, not only through Shopify Navigation.

Top-level block types:
- `mega`
- `drop`
- simple link

### `drop` menu items
`drop` items are the standard dropdown navigation path.

Connection model:
- header section block setting: `bk_stts.menu`
- dropdown rendering check: `linklists[bk_stts.menu].links.size > 0`
- submenu markup render path:
  - lazy submenu in storefront mode
  - `render 'menu_dropdown'` in design mode

Merchant implication:
- top-level label, URL, position, colors come from the header section block
- submenu items come from Shopify Navigation / linklists attached via the block's `menu` setting

### `mega` menu items
`mega` items are a split system.

Part 1: top-level mega trigger lives in the active header section block.
- block type: `mega`
- block settings include:
  - URL
  - submenu position
  - width mode
  - custom width
  - `id` used to connect content
  - packery option

Part 2: mega menu content lives in `sections/mega-menu.liquid`.
- mega content buckets are keyed by numeric `id`
- `menu_blocks.liquid` writes `data-id="{{ bk_stts.id }}"`
- `sections/mega-menu.liquid` outputs wrappers like `id="t4s-mega-contents{{ bk_stts.id }}" data-id="{{ bk_stts.id }}"`

Merchant implication:
- top-level mega item setup happens in the active header section
- actual mega content columns/images/promos are edited in the separate `Mega menu` section
- the numeric `ID` must match across the two systems

## 6. How merchants edit menu and mega menu items

### Standard dropdown menu editing
To edit a dropdown menu item end to end, the merchant needs two surfaces:

1. Active header section block
   - defines the top-level menu item itself
   - block type: `drop`
   - controls title, URL, color override, submenu position, attached `menu`

2. Shopify Navigation
   - provides the nested submenu links via `linklists[...]`
   - edit this in Shopify Navigation / menus

This means desktop dropdown items are hybrid:
- top-level desktop item = header section block
- nested submenu tree = Shopify Navigation menu

### Mega menu editing
Mega menu editing requires two separate Theme Editor surfaces:

1. Active header section block
   - block type: `mega`
   - defines top-level menu item title/URL/position/width/ID

2. `Mega menu` section
   - defines the actual content blocks shown inside the mega menu
   - content is grouped by matching `ID`

### Mega menu content block types confirmed from static read
In `sections/mega-menu.liquid`, confirmed content block families include:
- `banner`
- `cat`
- `pr`
- `link`
- `link2`
- `html`
- `blogs`

What they do:
- `banner`: image/promo card with overlay/content HTML
- `cat`: collection merchandising tile
- `pr`: products from a collection, grid or carousel
- `link`: titled menu column sourced from `linklists[bk_stts.menu].links`
- `link2`: simplified link list sourced from `linklists[bk_stts.menu].links`
- `html`: custom HTML/page-like content
- `blogs`: article list/slider

### Important editing consequence
Desktop navigation is not one single source of truth.
It is split across:
- active header section blocks
- Shopify Navigation menus
- the separate `Mega menu` section

This is the biggest practical constraint for future simplification work.

## 7. How menu items connect to Shopify Navigation / linklists

Confirmed direct connections:

### Standard dropdown path
- `snippets/menu_blocks.liquid`
  - `linklists[bk_stts.menu].links.size > 0`
- `snippets/menu_dropdown.liquid`
  - `assign llists = linklists[handle_menu].links`

### Mega-menu link columns
- `sections/mega-menu.liquid`
  - `assign llists = linklists[bk_stts.menu].links` for `link` / `link2` blocks

Implication:
- Shopify Navigation owns nested link trees only where a header block or mega-menu block explicitly points to a menu handle
- top-level desktop nav labels are not automatically synced from a Shopify Navigation tree unless the merchant manually mirrors them

## 8. Mega menu blocks, images, promos, and merchandising control

### Connection contract
Mega menu content is connected through numeric `ID`.

Header section `mega` block:
- setting: `id`
- info text: `ID connect mega menu.`

Mega menu section `mega` block:
- same `id`
- groups subsequent child blocks under that bucket

### Width controls already present on mega top-level items
Found in multiple header section schemas:
- `wid`
  - `cus` = custom
  - `full` = full width
  - `full nav_t4cnt` = content full width
- `cus_wid`
  - custom width in px
- `enable_packery`
- row spacing settings:
  - `r_s_h_item`
  - `r_s_v_item`

### Mega content settings already present
Confirmed examples from `sections/mega-menu.liquid` schema and markup:
- image picker controls
- image ratio/position/height controls
- content alignment
- overlay color/opacity
- promo HTML
- collection selection
- collection design options
- product/blog layout options
- items per row
- horizontal/vertical item spacing
- button style/shape/color/size for carousel blocks
- column width control per mega content block

This is already a large settings surface.

## 9. Existing header settings inventory

The active header sections already expose substantial control.

### Common section-level header settings
Across inline/bottom/sidebar/categories variants, confirmed settings families include:
- `full_header`
- `sticky_header`
- `scroll_header`
- `transparent_header`
- `space_transparent_header`
- desktop height settings
- mobile/tablet height settings
- nav arrow toggle
- active-link highlight toggle
- nav typography:
  - font family
  - weight
  - size
  - letter spacing
- nav colors:
  - default
  - hover
  - background / opacity
- sticky color variants
- transparent color variants
- icon set / icon visibility
- search/account/wishlist/cart toggles
- cart badge styling
- search form sizing in some layouts

### Section block-level menu settings
For top-level desktop menu items, confirmed block settings include:
- title/URL/open target
- custom color override
- submenu position
- submenu width mode
- custom width
- mega menu `ID`
- packery option
- row spacing
- menu handle for dropdown content

### Mega-menu section settings
Confirmed section/block settings include:
- global mega background
- content block families with many image/layout options
- link column menu handle selection
- product/blog merchandising controls
- banner promo alignment and overlay controls

## 10. How the current “Enable full width” setting works

This is a section-level setting named:
- `full_header`
- label: `Enable full Width`
- info: `Make header full width`

### What it actually controls
It does not create a separate bespoke width system.
It mainly toggles whether the header section continues using the default Kalles `.t4s-container` clamp and padding behavior.

### Baseline container contract from `assets/base.css`
- `.t4s-container` has built-in left/right padding from `--ts-gutter-x`
- desktop max-width is clamped:
  - `1170px` at `min-width: 1200px`
  - `1200px` at `min-width: 1230px`

### What header sections override
In the header section inline styles, `full_header` switches specific header containers to `max-width: 100%`.

Observed patterns:
- `header-inline`, `header-bottom`, `header-sidebar`
  - when `full_header` is enabled, section inline CSS sets relevant header container(s) to full width
  - when disabled, they keep a more standard contained header and also enforce manual side padding such as `padding-left/right: 20px`

- `header-categories-menu`
  - similar intent, but it targets separate mid and bottom containers
  - this section has its own container targeting rules, not exactly the same selectors as inline/bottom/sidebar

### Important distinction
`full_header` is not the same as mega submenu width.

Separate systems exist:
- header shell width = `full_header`
- individual mega submenu width = block setting `wid`
  - `cus`
  - `full`
  - `full nav_t4cnt`

### How mega full-width classes work
From shared CSS in `assets/theme.css`:
- `.menu-width__full .t4s-sub-menu { width: 100vw; left: 0 }`
- `.t4s-header__wrapper:not(.t4s-layout_vertical) .menu-width__full .t4s-sub-menu { left: 0 !important; max-width: 100vw !important }`
- `.menu-width__full .t4s-sub-menu .t4s-container { max-width: 100% }`

And from `menu_blocks.liquid`:
- when `wid != 'full nav_t4cnt'`, inline `style="width:{{ bk_stts.cus_wid }}px"` is applied to the inner mega `.t4s-container`
- when `wid == 'full nav_t4cnt'`, that inline width is omitted

Practical reading:
- `full`: viewport-wide mega panel
- `full nav_t4cnt`: full-width mega panel whose inner content container is allowed to follow the standard content width system instead of a forced custom px width
- `cus`: explicitly fixed inner width

## 11. Header icon / search / account / cart system

Primary ownership:
- `snippets/t4s_group_btns.liquid`
- `snippets/t4s_group_btns_split.liquid`

### Search
Confirmed paths:
- inline header search form in some contexts
- otherwise trigger to `#t4s-search-hidden`
- predictive or hidden search behavior is runtime-owned elsewhere; exact ownership is unknown from this static pass

### Account
Confirmed paths:
- logged-in: `routes.account_url`
- logged-out: may use `#t4s-login-sidebar` if `settings.login_side != false`
- also has logged-in dropdown markup/styling in the snippet

### Wishlist
Confirmed path:
- default wishlist path uses `{{ routes.search_url }}/?view=wishlist`
- alternative path if `settings.wishlist_mode == '3'` uses Growave snippet integration

### Cart
Confirmed path:
- page link: `routes.cart_url`
- drawer trigger: `#t4s-mini_cart` when not on cart page and cart drawer is enabled

### Logo system
`snippets/t4s_logo.liquid` supports:
- normal logo
- transparent logo
- sticky logo
- mobile logo
- independent widths per mode

This means logo behavior already has a mature variant system and likely does not need new settings unless the desired redesign changes layout rather than source assets.

## 12. Sticky / transparent header system

### Liquid hooks
All non-vertical header sections emit:
- `data-header-options='{ "isTransparent": ..., "isSticky": ..., "hideScroldown": ... }'`

This is the main JS handshake point for header state.

### Transparent header
Observed behavior:
- `transparent_header` exists per section
- inline script adds:
  - `document.documentElement.classList.add('is--header-transparent')`
  - `--header-height` on the root element
- transparent behavior appears intended primarily for homepage use

### Sticky header
Observed behavior from shared CSS:
- `.shopify-section-header-sticky` and `.t4sp-sticky .t4s-section-header.shopify-section-header-sticky`
  - `position: sticky`
  - `top: 0`
  - `z-index: 460`
  - box shadow

### Hide-on-scroll
Observed behavior:
- `scroll_header` is passed through as `hideScroldown`
- `.shopify-section-header-hidden { transform: translateY(-100%) }`
- exact JS ownership of when that class is added is in minified runtime and is unknown from this static pass

### Vertical header exception
`header-vertical.liquid` hardcodes:
- `isTransparent: false`
- `isSticky: false`
- `hideScroldown: false`

It owns a different fixed-sidebar contract and should be treated separately.

## 13. CSS ownership map

### `assets/base.css`
Owns baseline structure:
- `.t4s-container` width and gutter contract
- `.t4s-row` and column system
- base dropdown shell styles are not primarily here, but the container/grid contract is

This is the underlying reason `full_header` is sensitive: the header sections are overriding the standard container contract from this file.

### `assets/theme.css`
Owns shared interactive header/menu behavior including:
- sticky header state classes
- hidden header transform class
- mega/drop submenu absolute-positioned shell
- menu hover state visibility
- `.menu-width__full` viewport-wide mega behavior
- vertical header mega width exception

### `assets/t4s-submenu.css`
Owns standard dropdown submenu styling:
- `.t4s-type__drop > .t4s-sub-menu`
- nested flyout submenu width and positioning
- arrow direction and nested submenu orientation

### `assets/mega-menu.css`
Owns mega menu internal content styling:
- top-level mega panel padding
- link column styling
- `type_mn_link`
- `type_mn_link2`
- content typography inside mega columns
- promotional content row polish

### Section inline CSS
The active header section owns many header-specific values inline, including:
- color vars
- transparent/sticky logo switching
- explicit side padding when not full width
- local nav typography
- full width container exceptions

This inline CSS is the real ownership point for header shell geometry.

## 14. JS dependency map

### Confirmed static hooks
From Liquid and CSS:
- `data-header-options`
- `data-menu-nav`
- hover-state classes like `.is-action__hover`
- sticky classes like `.shopify-section-header-sticky`
- transparent root class `is--header-transparent`
- drawer/search/cart data attributes used by shared runtime

### What is known from static search
Shared runtime JS is minified in:
- `assets/global.min.js`
- `assets/theme.min.js`

From static selector/keyword search, the exact readable header controller source is not practical in this audit. However the runtime clearly owns:
- sticky state toggling
- hidden-on-scroll class toggling
- submenu hover/open state
- drawer triggers
- cart/search sidebars

### Unknown from static search
Unknown in readable detail without runtime inspection or de-minification:
- exact JS function that reads `data-header-options`
- exact submenu collision/position calculation path
- exact sticky/transparent state sequencing across all header designs

## 15. Mobile overlap note
Only limited mobile-overlap context was checked, per request.

Relevant confirmed file:
- `snippets/push_menu.liquid`

Confirmed behavior:
- mobile menu button uses `data-menu-drawer`
- targets `#t4s-menu-drawer`

This matters because header-level spacing, fixed positioning, and categories/sidebar exceptions can visually interact with mobile drawers and close controls. The detailed custom Ya Omri mobile drawer work is documented separately in `THEME_MOBILE_MENU_DRAWER_AUDIT.md`.

## 16. Existing settings sufficiency: what already exists vs what is missing

### Already sufficient / already broad
The theme already has many controls for:
- header colors
- transparent/sticky color states
- nav typography
- icon visibility/design
- logo variants by state
- top-level menu item types
- mega menu content blocks
- mega menu width mode
- mega menu merchandising content

### Still missing or awkward
From a layout-system perspective, the cleanest missing controls are:
- desktop header side padding
- tablet header side padding
- mobile header side padding

Reason:
- current header shell spacing is partially hard-coded inline, commonly `20px`
- `full_header` only toggles width behavior, not responsive gutter control
- categories header uses different inner container selectors than the other header designs

This means there is still no clean merchant-facing way to align header gutters with custom page-content gutters across breakpoints.

## 17. Recommendation for adding side padding controls

### Recommendation
Add explicit responsive header side-padding controls to each active desktop header section schema, rather than trying to overload `full_header`.

Recommended new settings per section:
- desktop side padding
- tablet side padding
- mobile side padding

Suggested naming:
- `header_pad_x_desktop`
- `header_pad_x_tablet`
- `header_pad_x_mobile`

### Why this is the safest approach
Because the real header shell ownership lives in the header section inline CSS, not in a single shared stylesheet.

That means the safest implementation path is:
1. add settings to the relevant header section schemas
2. emit CSS variables in the active section inline style block
3. apply those variables only to the actual container selectors already used by that section

### Do not do this
Do not implement side padding by changing:
- global `.t4s-container`
- shared `assets/base.css`
- generic sitewide row gutters

That would affect far more than the header.

### Recommended selector strategy by header family
For `header-inline`, `header-bottom`, `header-sidebar`:
- use the actual section-owned selector already used for non-full width padding
- likely target:
  - `.t4s-header__wrapper > .t4s-container`
  - plus any exact section row wrapper currently receiving `20px` left/right padding

For `header-categories-menu`:
- apply to both:
  - `.t4s-section-header__mid > .t4s-container`
  - `.t4s-section-header__bot > .t4s-container`
- this section has a split shell and should not be forced into the inline/bottom/sidebar selector pattern

For `header-vertical`:
- separate treatment required
- desktop side padding does not mean the same thing because the header itself is a fixed `280px` left sidebar

### Relationship with `full_header`
Keep `full_header` separate.

Best behavior model:
- `full_header` controls whether the header shell is clamped to content width or stretched wider
- side padding controls manage the horizontal inset inside that shell

This allows:
- full-width header with aligned internal padding
- contained header with custom edge spacing
- responsive alignment with page content

### Safe implementation shape
Best future implementation route:
- CSS variables emitted per active header section
- no change to global container defaults
- no change to submenu width system
- no change to mega-menu connection logic

## 18. Whether more settings are needed

Needed soon:
- responsive side padding controls

Potentially useful later, but lower priority:
- separate nav max-width or inner nav container width for split headers
- explicit mega panel inner padding controls if design alignment becomes more editorial
- explicit icon group spacing controls if header becomes more minimal/luxury

Not immediately needed:
- more mega-menu content settings
- more logo asset settings
- more sticky/transparent toggles

The current system already has many settings. The missing gap is mostly clean layout/gutter control.

## 19. High-risk files

Highest risk:
- `layout/theme.liquid`
  - global render order and shell ownership
- `snippets/header.liquid`
  - routes the entire header system
- `snippets/menu_blocks.liquid`
  - top-level desktop menu ownership and mega/drop branching
- `sections/mega-menu.liquid`
  - actual mega-menu content system and ID contract
- `snippets/t4s_group_btns.liquid`
  - search/account/wishlist/cart behavior and drawer triggers
- `sections/header-inline.liquid`
- `sections/header-bottom.liquid`
- `sections/header-sidebar.liquid`
- `sections/header-categories-menu.liquid`
- `sections/header-vertical.liquid`
- `assets/theme.css`
  - shared mega/drop positioning and sticky state classes
- `assets/t4s-submenu.css`
  - dropdown submenu geometry
- `assets/mega-menu.css`
  - mega menu internal structure

Why these are high risk:
- shared across multiple header designs
- mix structure and styling together
- contain the mega/drop connection logic
- contain inline CSS that overrides the global container contract
- many changes would affect both Theme Editor and storefront behavior

## 20. Future implementation routing

### If the task is “edit header logo only”
Inspect first:
- `snippets/t4s_logo.liquid`
- active header section inline CSS around logo sizing

### If the task is “change desktop top-level nav spacing/typography”
Inspect first:
- active header section inline CSS
- `snippets/menu_blocks.liquid`
- `assets/theme.css`

### If the task is “change dropdown submenu styling”
Inspect first:
- `snippets/menu_dropdown.liquid`
- `assets/t4s-submenu.css`
- `assets/theme.css`

### If the task is “change mega-menu content layout”
Inspect first:
- `sections/mega-menu.liquid`
- `assets/mega-menu.css`
- `snippets/menu_blocks.liquid`

### If the task is “change how merchants edit top-level nav items”
Inspect first:
- active header section schema blocks
- `snippets/menu_blocks.liquid`
- consider whether the split between top-level blocks and Shopify Navigation should be simplified

### If the task is “change sticky / transparent behavior”
Inspect first:
- active header section inline styles and scripts
- `assets/theme.css`
- runtime keyword search in minified JS

### If the task is “add side padding controls”
Inspect first:
- active header section inline style block
- `full_header` branch inside that section
- `assets/base.css` container contract for reference only
- do not start in global CSS

## 21. Practical answers to the seven priority questions

### 1. How to fully edit menu items and mega menu items
You need to use multiple surfaces:
- top-level desktop items: active header section blocks
- dropdown nested items: Shopify Navigation menus
- mega content: separate `Mega menu` section blocks

### 2. How menu items are connected to Shopify Navigation / linklists
Through explicit menu-handle settings:
- dropdown top-level blocks use `bk_stts.menu`
- mega link/link2 content blocks also use `bk_stts.menu`
- actual nested links come from `linklists[...]`

### 3. How mega menu blocks/images/promos are controlled
Through `sections/mega-menu.liquid` block types and settings.
The top-level header mega block only opens the mega and links it by matching `ID`.

### 4. What settings already exist
Already broad:
- header shell settings
- sticky/transparent settings
- nav typography/colors
- icon toggles
- top-level menu block settings
- mega-menu content settings
- mega width mode

### 5. Whether more settings are needed
Yes, but not broadly.
The main missing control is responsive horizontal padding / gutter control for header shell alignment.

### 6. How the current “Enable full width” setting works
It toggles the header shell container behavior to full-width vs contained behavior through section-inline CSS. It does not replace the mega submenu width system.

### 7. How to safely add desktop/tablet/mobile side padding controls
Add them per header section schema and apply them in that section’s inline CSS to the real container selectors already used there. Do not modify global `.t4s-container`.

## 22. Testing checklist for future header / mega-menu work

### Header shell
- homepage
- collection page
- product page
- sticky header on desktop
- transparent header on homepage
- hide-on-scroll behavior if enabled

### Menu system
- simple top-level item
- `drop` item with 2 levels
- `drop` item with 3 levels
- `mega` item with banner/product/link content
- `mega` item with matching `ID`
- `mega` item with wrong `ID` to confirm failure mode

### Merchant editing
- edit top-level item in header section
- change attached Shopify Navigation menu handle
- edit mega content in `Mega menu` section
- verify `link` / `link2` blocks reflect Shopify Navigation changes

### Width behavior
- `full_header` on/off
- mega `wid = cus`
- mega `wid = full`
- mega `wid = full nav_t4cnt`
- custom mega width values

### Responsive
- desktop
- tablet
- mobile
- mobile drawer trigger still works
- no overlap between desktop header changes and mobile drawer surfaces

### Icons and drawers
- search trigger / search form
- account login/account dropdown
- wishlist link
- cart drawer / cart page link

## 23. Unknowns from static search

Unknown from this audit without runtime inspection or deeper JS reverse-engineering:
- exact runtime function that reads `data-header-options`
- exact collision/position recalculation path for oversized mega panels
- exact interaction between some custom inline CSS and Kalles submenu positioning in all header designs
- complete lifecycle for lazy-loaded submenu content in storefront mode

These are not blockers for an audit or for adding side-padding controls, but they matter if behavior changes extend beyond presentation.

## 24. Recommended next safe implementation task

If the next task is implementation, the safest narrow task is:
- add responsive desktop/tablet/mobile side padding controls to the active header section only
- keep `full_header` logic intact
- do not modify global `.t4s-container`
- do not change `menu_blocks` / `menu_dropdown` / `mega-menu` behavior

## 25. Implementation note: responsive header side padding controls

Implemented for:
- `sections/header-inline.liquid`
- `sections/header-bottom.liquid`
- `sections/header-sidebar.liquid`
- `sections/header-categories-menu.liquid`
- `sections/header-vertical.liquid`

Controls added:
- `header_pad_x_desktop`
- `header_pad_x_tablet`
- `header_pad_x_mobile`

Implementation notes:
- `full_header` still controls shell width only
- new gutter controls act as internal container padding only
- inline, bottom, sidebar, and vertical headers apply the new variables to:
  - `.t4s-header__wrapper > .t4s-container`
- categories header applies them to:
  - `.t4s-section-header__mid > .t4s-container`
  - `.t4s-section-header__bot > .t4s-container`
- no changes were made to:
  - `snippets/menu_blocks.liquid`
  - `snippets/menu_dropdown.liquid`
  - mega menu logic
  - global JS
  - global container CSS in `assets/base.css`

Testing checklist:
- `full_header` on:
  - header remains full width
  - desktop/tablet/mobile side gutter still changes
- `full_header` off:
  - header remains contained
  - gutter settings still adjust internal left/right spacing cleanly
- dropdown menus still open
- mega menus still open
- mobile trigger still works
- desktop nav alignment changes only by the configured gutter

That gives alignment control without touching the shared navigation logic.
