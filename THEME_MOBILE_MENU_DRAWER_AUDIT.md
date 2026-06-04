# THEME_MOBILE_MENU_DRAWER_AUDIT

## Purpose

This is an evidence-backed audit of the mobile menu drawer system in this Shopify Kalles/T4S theme.

This document is for future implementation work only. It does not propose code changes here. It maps the current mobile menu drawer render path, shared drawer dependencies, CSS/JS ownership, Theme Editor controls, risks, and the safest routing for future work.

## Latest implementation note

- Context: this pass assumed the latest saved Shopify theme had already been pulled locally, so schema edits were kept narrowly scoped to the Ya Omri mobile drawer controls only.
- Files changed in this pass:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `assets/yaomri-mobile-drawer-search.js`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- Image card controls added:
  - card height
  - card heading font size
  - card subtitle font size
  - card text weight
  - heading uppercase toggle
  - subtitle uppercase toggle
  - text alignment
  - overlay strength
  - existing card radius kept and wired through CSS variables
- Trust strip controls:
  - removed from the Ya Omri drawer section schemas
  - the custom drawer no longer exposes `Enable trust strip` in Theme Editor
- Search:
  - `Show drawer search` setting added
  - search row no longer renders when disabled
  - predictive search was implemented with a small isolated asset: `assets/yaomri-mobile-drawer-search.js`
  - the script reuses Shopify's predictive search endpoint and the existing `search-hidden` section response; it does not alter the global Kalles drawer/search runtime
- Close button:
  - visually integrated into the top-right of the custom drawer search area using scoped CSS only
  - the Kalles close button contract remains unchanged
- No changes were made to:
  - `assets/global.min.js`
  - `assets/theme.min.js`
  - `assets/predictive-search.min.js`
  - `assets/drawer.min.css`
  - `assets/mobile_nav.css`
- Remaining QA checks:
  - confirm predictive results layout on narrow mobile widths
  - confirm the close button alignment in both normal and categories-only mobile drawer modes
  - confirm Theme Editor visibility for the new card/search controls and the removal of the old trust-strip controls

## Follow-up fix note

- Search toggle fix:
  - `yaomri_mobile_drawer_search_enable` was not reliably hiding the search because the snippet used Liquid `| default: true` on a checkbox value, which turns explicit `false` back into `true`
  - the snippet now treats `false` as authoritative and only defaults to enabled when the setting is absent
- Image card typography controls added:
  - `yaomri_mobile_drawer_card_subtitle_weight`
  - `yaomri_mobile_drawer_card_subtitle_letter_spacing`
  - `yaomri_mobile_drawer_card_title_italic`
- Close X alignment:
  - removed the remaining inline border/background override from the snippet style block
  - the scoped custom drawer CSS now fully controls the icon-only close button presentation and alignment
- Files changed in this follow-up:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- Testing notes:
  - verify `Show drawer search` now actually removes the search row and predictive container
  - verify predictive search still works when enabled
  - verify subtitle weight/letter spacing and title italic respond in Theme Editor
  - verify the close X now sits visually centered on the same top row as the search input without a visible box

## Topbar alignment fix note

- Topbar/search/close alignment:
  - the custom drawer now keeps a permanent `.yo-mobile-drawer__topbar`
  - the topbar uses a reserved close slot so the real Kalles close button can align visually without overlapping the search field
- Search-disabled spacer behavior:
  - when `yaomri_mobile_drawer_search_enable` is off, the search UI does not render
  - an empty spacer remains in the left side of the topbar, so the close button alignment and top spacing stay stable
- Close icon color fix:
  - the scoped close-button CSS now forces the Kalles close svg/path to inherit `currentColor`
  - `yaomri_mobile_drawer_close_icon_color` now drives the icon through `--yo-mobile-drawer-close-icon`
- Close icon size control added:
  - `yaomri_mobile_drawer_close_icon_size`
- Files changed in this pass:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- Testing notes:
  - verify live preview and Theme Editor both keep the X and search row horizontally separated
  - verify search-disabled mode keeps the top spacing and close alignment clean
  - verify close icon size and color both respond in Theme Editor

## Close control sibling fix note

- The close button controls did not work reliably because `.t4s-drawer-menu__close` is an adjacent sibling outside `#t4s-menu-drawer`
- CSS variables emitted on `#t4s-menu-drawer` do not inherit into that sibling, so the close background, icon color, and icon size controls could not reliably drive the button
- Fixed by outputting direct Liquid-resolved CSS in `snippets/yaomri-mobile-drawer.liquid` for:
  - `#t4s-menu-drawer:has(.yo-mobile-drawer) + .t4s-drawer-menu__close`
  - its `svg`
  - its `path`
- Files changed in this fix:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- Testing notes:
  - verify close background color responds in Theme Editor
  - verify close icon color responds in Theme Editor
  - verify close icon size responds in Theme Editor
  - verify the close button still aligns with the topbar and still closes the drawer

## Bottom action panel note

- Bottom action panel added:
  - replaced the previous loose Sign in / Cart links with a full-width Ya Omri account/action panel
  - actions now include `Sign in / Account`, `Wishlist`, and `Cart`
- Wishlist added:
  - reuses the current theme wishlist route pattern from `mb_nav`
  - falls back to `/pages/wishlist` when needed
- Settings added:
  - `yaomri_mobile_drawer_actions_enable`
  - `yaomri_mobile_drawer_actions_bg_color`
  - `yaomri_mobile_drawer_actions_text_color`
  - `yaomri_mobile_drawer_actions_icon_color`
  - `yaomri_mobile_drawer_actions_border_color`
  - `yaomri_mobile_drawer_actions_button_bg`
  - `yaomri_mobile_drawer_actions_button_text`
  - `yaomri_mobile_drawer_actions_button_radius`
  - `yaomri_mobile_drawer_actions_padding`
- Files changed in this pass:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- Testing notes:
  - verify panel show/hide works
  - verify Sign in / Account, Wishlist, and Cart all link correctly
  - verify the new panel styles respond to Theme Editor color/radius/padding controls
  - verify nested menu behavior is unaffected

## Search simplification and width fix note

- Predictive search removed from the Ya Omri custom drawer:
  - in-drawer suggestions, product recommendations, and live predictive result panels were removed
  - the drawer search is now a simple form that submits to the normal Shopify search results page
  - `assets/yaomri-mobile-drawer-search.js` is no longer loaded by the custom drawer path
- Topbar / close alignment:
  - the topbar still reserves a fixed close slot
  - the search field now lives only as a simple form in the left lane
  - when search is disabled, the spacer remains so the close alignment and topbar height stay stable
- Action panel controls:
  - added `yaomri_mobile_drawer_actions_icon_size`
  - added `yaomri_mobile_drawer_actions_text_size`
  - added `yaomri_mobile_drawer_actions_text_weight`
  - added `yaomri_mobile_drawer_actions_gap_top`
  - removed visible `yaomri_mobile_drawer_actions_padding` from the section schemas
- Action panel layout:
  - moved inside the main content stack so it aligns with menu rows and image cards
  - removed the previous flex-bottom spacing behavior that caused a large gap above the panel
- Drawer width:
  - widened the control range
  - applied the width override directly to the actual `#t4s-menu-drawer` shell
  - capped visible width with `calc(100vw - 24px)` to avoid horizontal overflow
- Files changed in this pass:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- Testing notes:
  - verify search now only submits to the search results page
  - verify no suggestions or predictive result panel render in the drawer
  - verify the close X sits in the reserved topbar slot beside the search field
  - verify search-disabled mode keeps clean topbar spacing
  - verify the action panel icon size, text size, text weight, and top-gap controls respond in Theme Editor
  - verify the drawer width control now visibly changes the drawer shell width without horizontal overflow

## Embedded close button note

- Embedded close button added inside the Ya Omri custom drawer topbar:
  - uses `.yo-mobile-drawer__close`
  - preserves the Kalles close contract with `data-drawer-close`
- External Kalles sibling close handling:
  - `render_bottom.liquid` now adds `.yo-mobile-drawer__external-close` to the external sibling close button
  - the custom drawer snippet emits direct CSS for `.yo-mobile-drawer__external-close`, so it is hidden only when the custom drawer renders
  - the external sibling remains in the DOM
  - the original drawer fallback still uses the original Kalles close button when `yaomri_mobile_drawer_enable` is false
- Close settings now style the embedded button:
  - `yaomri_mobile_drawer_close_bg_color`
  - `yaomri_mobile_drawer_close_icon_color`
  - `yaomri_mobile_drawer_close_icon_size`
- Files changed in this pass:
  - `snippets/render_bottom.liquid`
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- Testing notes:
  - verify the embedded X closes the drawer
  - verify `.yo-mobile-drawer__external-close` is hidden only when the custom drawer is rendered
  - verify the external sibling X no longer appears or slides separately in the custom drawer
  - verify search-enabled and search-disabled topbar states stay aligned
  - verify close background, icon color, and icon size settings now affect the embedded button

## Action-panel gap fix note

- Gap source found:
  - `.yo-mobile-drawer__content-stack` still had a fixed `gap: 14px`
  - that stack gap was being added before the action panel, on top of `--yo-mobile-drawer-actions-gap-top`
- Fix applied:
  - removed the generic stack gap from the menu-to-action-panel boundary
  - kept explicit card-to-menu spacing with `.yo-mobile-drawer__cards + .yo-mobile-drawer__menu-panel`
  - the action panel top spacing is now owned by `margin-top: var(--yo-mobile-drawer-actions-gap-top, 8px)`
- Selectors changed:
  - `.yo-mobile-drawer__content-stack`
  - `.yo-mobile-drawer__cards + .yo-mobile-drawer__menu-panel`
  - `.yo-mobile-drawer__account-panel`
- Files changed in this pass:
  - `assets/yaomri-mobile-drawer.css`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- Testing notes:
  - verify `Space above action panel = 0` removes the visible gap above the panel
  - verify `Space above action panel = 20` adds visible spacing
  - verify cards still keep separation from the menu panel
  - verify the menu remains scrollable and the panel does not overlap content

## Row icon spacing and submenu italic note

- Row icon clipping fix:
  - top-level and submenu row anchors now reserve right-side breathing room
  - expandable plus icons and chevron arrows now have explicit end spacing and non-shrinking icon space
  - no global Kalles icon rules were changed
- Submenu italic control added:
  - `yaomri_mobile_drawer_sub_item_italic`
  - top-level item italic remains controlled by `yaomri_mobile_drawer_item_italic`
  - submenu items now use a separate CSS variable
- CSS variable added:
  - `--yo-mobile-drawer-sub-item-font-style`
- Selectors changed:
  - `.t4s-mb__menu > li > a`
  - `.t4s-mb__menu .t4s-sub-menu li > a`
  - `.t4s-mb__menu > li:not(.t4s-menu-item-has-children) > a::after`
  - `.t4s-mb__menu .t4s-sub-menu li:not(.t4s-menu-item-has-children) > a::after`
  - `.t4s-mb__menu .t4s-menu-item-has-children > a`
  - `.t4s-mb__menu .t4s-mb-nav__icon`
- Files changed in this pass:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- Testing notes:
  - verify chevron and plus icons no longer look clipped near the right edge
  - verify top-level italic and submenu italic can be toggled independently
  - verify nested submenu behaviour is unchanged

## Evidence used

- [theme-audit-data/asset-load-map.txt](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/theme-audit-data/asset-load-map.txt)
- [theme-audit-data/key-selector-hits.txt](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/theme-audit-data/key-selector-hits.txt)
- [theme-audit-data/js-keyword-file-map.txt](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/theme-audit-data/js-keyword-file-map.txt)
- [theme-audit-data/section-render-map.txt](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/theme-audit-data/section-render-map.txt)
- [theme-audit-data/snippet-reference-counts.txt](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/theme-audit-data/snippet-reference-counts.txt)

## 1. Mobile menu drawer overview

The mobile menu is not rendered directly inside one header section. The visible trigger lives in the active header section, but the actual drawer shell is mounted later from [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid).

The basic storefront chain is:

1. [layout/theme.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/layout/theme.liquid) renders [snippets/header.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/header.liquid).
2. `header.liquid` chooses one header section using global `settings.header_design`.
3. The chosen header section renders [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid) on mobile.
4. `push_menu.liquid` outputs a button with `data-menu-drawer` and `data-drawer-options='{ "id":"#t4s-menu-drawer" }'`.
5. [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid) mounts `#t4s-menu-drawer`, the close button `.t4s-drawer-menu__close`, and the inner mobile tabs/content areas.
6. `render_bottom.liquid` renders [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid) and [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid) into the drawer content.

The mobile drawer is part of a broader shared drawer system:

- `#t4s-menu-drawer` is the left-side menu drawer.
- `#t4s-search-hidden` is a right-side search drawer.
- `#t4s-mini_cart` is a right-side cart drawer.
- `#t4s-login-sidebar` is a right-side account/login drawer.

Shared drawer infrastructure appears to live in:

- [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css)
- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)
- the global overlay `.t4s-close-overlay` rendered in [layout/theme.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/layout/theme.liquid)

Desktop and mobile are structurally different:

- Desktop main navigation is rendered from [snippets/menu_blocks.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_blocks.liquid), [snippets/menu_splits.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_splits.liquid), [snippets/menu_dropdown.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_dropdown.liquid), and desktop submenu CSS.
- Mobile navigation is rendered from `mb_nav` and `mb_cat` sections inside `#t4s-menu-drawer`.
- Some classes and concepts are shared:
  - `t4s-menu-item`
  - nested submenu structures
  - title helpers like `title_menu` / `title_menu2`
  - shared logo and shared search/account/cart icon systems

## 2. File inventory

### Layout and global shell

| File | Purpose | Key selectors / attributes | Dependencies | Risk | Inspect before editing |
|---|---|---|---|---|---|
| [layout/theme.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/layout/theme.liquid) | Renders site shell, global overlay, header snippet, and bottom-mounted drawer systems | `.t4s-close-overlay`, `t4s-op-0`, `t4s-header__*` classes on `<html>` | `header`, `head_assets`, `render_bottom`, `global.min.js`, `theme.css`, `custom.css` | High | Confirm whether the change belongs in the shell or in a mounted drawer/section |
| [snippets/head_assets.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/head_assets.liquid) | Defines root CSS variables and global typography/color setup | `:root`, body/header variables | `base.css`, `theme_rtl.css`, optional `bootstrap.min.css` | Medium | Check only if the mobile drawer depends on a root variable or header color variable |
| [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid) | Mounts the actual mobile menu drawer, search drawer, mini cart drawer, login drawer, toolbar, and late CSS/JS | `#t4s-menu-drawer`, `.t4s-drawer-menu__close`, `data-tab-mb-nav`, `data-tab-mb-item`, `data-tab-mb-content`, `#t4s-search-hidden`, `#t4s-mini_cart`, `#t4s-login-sidebar` | `mobile_nav.css`, `drawer.min.css`, `theme.css`, `predictive-search.min.js`, `theme.min.js`, `global.min.js`, sections `mb_nav`, `mb_cat`, `mini_cart`, `login-sidebar`, `search-hidden` | Very high | Confirm whether the work is the menu drawer shell, tab mode, or another right-side drawer |

### Header sections

| File | Purpose | Key selectors / render refs | Key settings | Dependencies | Risk | Inspect before editing |
|---|---|---|---|---|---|---|
| [sections/header-inline.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-inline.liquid) | One of the active header designs chosen by `settings.header_design` | renders `push_menu`, `t4s_logo`, `t4s_group_btns`, desktop menu markup | `h_navmb`, `show_search`, `show_acc`, `show_wis`, `cart_des`, `sticky_header`, `scroll_header`, `transparent_header`, `space_transparent_header` | header wrapper CSS, shared button snippets | High | Check mobile trigger placement and icon visibility |
| [sections/header-bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-bottom.liquid) | Header design with desktop bottom nav row | renders `push_menu`, `t4s_logo`, `t4s_group_btns`, `menu_blocks`, optional `search_form_header`/social | same core mobile/header settings as inline | shared header/menu snippets | High | Confirm whether the mobile issue is in the mobile trigger row or desktop bottom row |
| [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid) | Sidebar-style header design with custom drawer positioning rules | direct CSS for `#t4s-menu-drawer` and `.t4s-drawer-menu__close`; renders predictive search form and group buttons | same core mobile/header settings plus layout-specific settings | shared drawer shell, shared icons, sidebar-specific header CSS | Very high | Check this first if `header_design=sidebar`; it overrides menu drawer positioning |
| [sections/header-categories-menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-categories-menu.liquid) | Header design with categories navigation | renders `push_menu`, `t4s_logo`, `t4s_group_btns`, predictive search form; paired with `header-categories` | `header_design`, `h_navmb`, `show_search`, `show_acc`, `show_wis`, `cart_des`, sticky/transparent controls | categories desktop nav, shared icon system | High | Confirm whether the issue is mobile drawer only or categories header specific |
| [sections/header-categories.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-categories.liquid) | Desktop categories/mega/dropdown content section | uses `menu_dropdown`, `title_menu`, `title_menu2` | category/mega menu blocks | `mega-menu.css`, dropdown helpers | Medium for mobile, high for desktop | Only inspect if shared menu item semantics affect mobile parity |
| [sections/header-vertical.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-vertical.liquid) | Vertical header design | renders `push_menu`, `t4s_logo`, `menu_blocks`, group buttons | `h_navmb`, `show_search`, `show_acc`, `show_wis`, `cart_des`, nav typography settings | shared mobile trigger, shared icon system | High | Check if mobile work must preserve vertical header behavior |
| [sections/main-password-header.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/main-password-header.liquid) | Separate password-page drawer behavior | custom drawer sidebar and overlay handling | password logo width | custom inline script, `drawer.min.css` | Low for main mobile menu, high as a separate drawer example | Use only as a separate drawer pattern; do not treat as the main mobile menu system |

### Core snippets

| File | Purpose | Key selectors / refs | Shared-risk evidence | Dependencies | Risk | Inspect before editing |
|---|---|---|---|---|---|---|
| [snippets/header.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/header.liquid) | Chooses the active header section from `settings.header_design` | `section 'header-inline'`, `section 'header-sidebar'`, `section 'header-bottom'`, `section 'header-categories-menu'`, `section 'header-vertical'` | `header` snippet shows `1` ref in evidence because it is a root router, not a low-risk file | all header sections | Very high | Start here when header design ambiguity exists |
| [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid) | Mobile drawer trigger button | `.t4s-push-menu-btn`, `data-menu-drawer`, `data-drawer-options` | `push_menu` has `12` references | `#t4s-menu-drawer`, global drawer JS | High | Confirm trigger target and placement before changing icon/button treatment |
| [snippets/t4s_logo.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_logo.liquid) | Shared logo output for desktop, sticky, and mobile | `.t4s-header__logo`, `.header__normal-logo`, `.header__sticky-logo`, `.header__mobile-logo` | `t4s_logo` has `11` references | global header settings `logo_width`, `logos_width`, `logo_mb_width`, transparent logo settings | High | Check whether the change is mobile-only, sticky-only, or transparent-header-related |
| [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid) | Shared search/account/wishlist/cart icon cluster | `.t4s-site-nav__search`, `.t4s-site-nav__account`, `.t4s-site-nav__cart`, `data-drawer-options`, embedded predictive search form | not counted directly in evidence file, but used by several header sections | search/login/cart drawers, icon settings, search settings | Very high | Check icon visibility rules and responsive classes before changing mobile shortcuts |
| [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid) | Split version of shared header buttons | same core selectors as `t4s_group_btns` | shared header dependency | search/login/cart drawers | High | Needed when header design uses split group buttons |
| [snippets/menu_blocks.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_blocks.liquid) | Desktop top-level nav and lazy submenu containers | `[data-menu-nav]`, `.t4s-nav__ul`, `.t4s-menu-item`, `.t4s-sub-menu`, `.t4s-lazy_menu` | `menu_blocks` has `6` refs | `menu_dropdown`, `title_menu`, mega/dropdown CSS, editor blocks | High | Desktop/menu shared semantics live here; useful for parity but not the mobile drawer content itself |
| [snippets/menu_splits.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_splits.liquid) | Split desktop navigation variant | `[data-menu-nav]`, `.t4s-nav__ul`, `.t4s-menu-item`, `.t4s-sub-menu` | shared across split header designs | desktop nav | Medium | Relevant if a future design wants mobile/desktop menu consistency |
| [snippets/menu_dropdown.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_dropdown.liquid) | Desktop dropdown submenu markup | `.t4s-menu-item`, `.t4s-sub-menu`, `.t4s-sub-menu-2`, `.t4s-sub-menu-3` | `menu_dropdown` has `3` refs | `t4s-submenu.css`, `title_menu2` | Medium | Desktop-only primary use, but menu hierarchy patterns inform mobile submenu design |
| [snippets/title_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/title_menu.liquid) | Desktop top-level title helper | label pill and arrow output | `title_menu` has `9` refs | desktop nav blocks | Medium | Relevant for label/icon parity only |
| [snippets/title_menu2.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/title_menu2.liquid) | Desktop dropdown title helper with parsed labels/icons | `.t4s_lb_nav` style label output | `title_menu2` has `12` refs | desktop dropdown and categories systems | High shared-risk for labels | Use when auditing shared menu label behavior |

### Mobile drawer content sections

| File | Purpose | Key selectors / refs | Key settings / blocks | Dependencies | Risk | Inspect before editing |
|---|---|---|---|---|---|---|
| [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid) | Main mobile menu content | `#menu-mb__ul`, `.t4s-mb__menu`, `.t4s-menu-item-has-children`, `.t4s-sub-menu`, `.t4s-sub-sub-menu`, `.t4s-mb-nav__icon`, `data-drawer-options` on search/account items | block types `menu`, `Collection Image List`, `Wishlist`, `Compare`, `Search`, `Account`, `Help text`, `Currency`, `Languages` | `mobile_nav.css`, `global.min.js`, right-side drawers, `lb_inc_mb`/`img_svg` helpers | Very high | This is the main mobile nav content file |
| [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid) | Mobile categories drawer tab content | `#menu-mb__cat`, `.t4s-mb__menu`, `.t4s-mb-nav__icon` | block types `Collection Link List`, `Collection image list`; repeated collection/image/url slots | `mobile_nav.css`, category helpers | High | Check when `mobile_nav_type` includes categories |

### Related drawer sections

| File | Purpose | Key selectors / refs | Dependencies | Risk | Inspect before editing |
|---|---|---|---|---|---|
| [sections/search-hidden.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/search-hidden.liquid) | Right-side search drawer used by header and mobile menu search triggers | `.t4s-drawer__header`, `.t4s-drawer__content`, `.t4s-drawer__bottom`, `data-predictive-search`, `data-input-search`, `data-submit-search`, `data-t4s-scroll-me` | `predictive-search.min.js`, search settings | High | Needed if mobile drawer design should include or reposition search |
| [sections/login-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/login-sidebar.liquid) | Right-side login/account drawer | `.t4s-drawer__header`, `.t4s-drawer__content`, `data-drawer-close` | `login_side` setting, shared drawer JS/CSS | Medium | Needed if account entry should open inside drawer from mobile menu |
| [sections/mini_cart.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mini_cart.liquid) | Right-side cart drawer | `.t4s-drawer__header`, `.t4s-drawer__bottom`, cart count/upsell areas | `cart_des`, `cart_type`, shared drawer JS/CSS | Medium | Needed if cart shortcut placement should change in the mobile drawer |

### CSS

| File | Purpose | Key selectors/classes | Risk | Inspect before editing |
|---|---|---|---|---|
| [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css) | Primary mobile menu drawer presentation | `#t4s-menu-drawer`, `.t4s-mb-tab__content`, `.t4s-mb-tab__title`, `.t4s-mb__menu`, `.t4s-mb-nav__icon`, `.t4s-drawer-menu__close`, `.is--opend` | Very high | Start here for menu layout, spacing, submenu styling, close button positioning |
| [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css) | Shared base drawer panel system | `.t4s-drawer`, `.t4s-drawer__right`, `.t4s-drawer__content`, `.t4s-drawer__header`, `.t4s-drawer__bottom`, `[aria-hidden=false]` | Very high | Start here for base width, slide direction, transition, shared shell |
| [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css) | Global overlay, body lock, sticky utility, shared drawer utility rules | `.t4s-close-overlay`, `.t4s-close-overlay.is--visible`, `.t4s-lock-scroll`, `.shopify-section-header-hidden`, `.t4s-drawer`, `.t4s-count-box` | Very high | Needed when changing overlay/body lock/sticky interactions |
| [assets/mega-menu.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mega-menu.css) | Desktop mega-menu styling | `.t4s-menu-item .t4s-sub-menu` | Medium | Desktop-only primary role; inspect for shared class collisions |
| [assets/t4s-submenu.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/t4s-submenu.css) | Desktop dropdown submenu styling | `.t4s-type__drop > .t4s-sub-menu`, nested submenu positioning, `.t4s-menu-item.has--children` | Medium | Desktop-only primary role; useful for understanding shared hierarchy classes |
| [assets/theme.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/theme.css) | Global theme styling and some shared header/drawer utilities | no high-signal mobile-menu-specific hits from the narrow selector search | High because global | Only inspect when the target selector is confirmed here from search |

### JS

| File | Purpose from static search | Evidence | Risk | Inspect before editing |
|---|---|---|---|---|
| [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js) | Likely primary storefront drawer controller | exact keyword hits: `data-drawer-options`, `data-drawer-close`, `data-t4s-scroll-me`, `t4s-close-overlay`, `t4s-lock-scroll`, `opendDrawer`, `is--opend`, `aria-hidden` | Very high | Start here for open/close, overlay, lock-scroll, submenu toggle logic |
| [assets/predictive-search.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/predictive-search.min.js) | Predictive search drawer controller | exact keyword hits: `data-predictive-search`, `data-input-search`, `t4s-search-hidden`, `opendDrawer`; static search shows it focuses input on drawer open and computes results max height from the header | High | Needed when drawer search placement or open behavior changes |
| [assets/des_adm.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/des_adm.min.js) | Theme Editor / admin mode section reload support | exact hits: `data-menu-drawer`, `data-drawer-options`, `t4s-close-overlay`, `t4s-menu-drawer`, `is--opend`, `aria-hidden`; static search shows it rehydrates `mb_nav` / `mb_cat` and drawer states in editor | High in editor mode | Important when a change works live but breaks Theme Editor preview |
| [assets/theme.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/theme.min.js) | Loaded globally in `render_bottom`; candidate from keyword file map | narrow search did not produce high-signal mobile drawer tokens | High because global runtime | Inspect only after `global.min.js` if the behavior is still unresolved |
| [assets/custom.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/custom.js) | Loaded globally from `render_bottom` | no high-signal mobile drawer ownership from this pass | Medium | Unknown from static search |
| [assets/interactable.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/interactable.min.js) | Candidate from JS keyword evidence | no direct mobile drawer ownership proven in this pass | Medium | Unknown from static search |
| [assets/t4s-currencies.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/t4s-currencies.min.js) | Currency drawer support candidate | referenced by keyword map, and `mb_nav` contains currency items | Medium | Needed only if mobile nav currency rows are in scope |

## 3. Render path

### Likely storefront render chain

1. [layout/theme.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/layout/theme.liquid)
   - renders the global overlay: `.t4s-close-overlay t4s-op-0`
   - renders [snippets/header.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/header.liquid)
   - renders [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid)

2. [snippets/header.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/header.liquid)
   - selects one section using `settings.header_design`
   - possible paths:
     - `header-inline`
     - `header-sidebar`
     - `header-bottom`
     - `header-categories-menu`
     - `header-vertical`

3. Active header section
   - renders [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid) in the mobile header row
   - typically mobile-only via `t4s-d-lg-none`
   - renders [snippets/t4s_logo.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_logo.liquid)
   - renders [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid) or [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid)

4. [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid)
   - outputs the mobile trigger
   - exact trigger pattern:
     - `data-menu-drawer`
     - `data-drawer-options='{ "id":"#t4s-menu-drawer" }'`

5. [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid)
   - mounts `<div id="t4s-menu-drawer" class="t4s-drawer t4s-drawer__left ...">`
   - mounts sibling close button `.t4s-drawer-menu__close`
   - builds tab header depending on `settings.mobile_nav_type`
   - mounts:
     - `#shopify-mb_nav`
     - `#shopify-mb_cat`
   - renders:
     - `{% section 'mb_nav' %}`
     - `{% section 'mb_cat' %}`

### Mobile trigger owner

The mobile trigger is rendered by:

- [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid)

The trigger is placed by:

- active header section such as:
  - [sections/header-inline.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-inline.liquid)
  - [sections/header-bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-bottom.liquid)
  - [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid)
  - [sections/header-categories-menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-categories-menu.liquid)
  - [sections/header-vertical.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-vertical.liquid)

### Drawer content owner

The drawer content is rendered by:

- [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
- [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)

### Menu item and submenu owner

Mobile menu items and nested submenu levels are rendered in:

- [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
- [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)

Desktop menu items and dropdown/mega structures are rendered in:

- [snippets/menu_blocks.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_blocks.liquid)
- [snippets/menu_splits.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_splits.liquid)
- [snippets/menu_dropdown.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/menu_dropdown.liquid)

### Logo and icon owner

The logo is rendered by:

- [snippets/t4s_logo.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_logo.liquid)

Search, account, wishlist, and cart header icons are rendered by:

- [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid)
- [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid)

The mobile drawer itself can also include search/account/wishlist/compare/currency/language items as `mb_nav` blocks.

### Alternate paths and ambiguity

- `header_design=categories` uses both `header-categories-menu` and, in editor contexts, `header-categories`.
- `header_design=sidebar` adds its own positioning CSS for `#t4s-menu-drawer` and the close button.
- `render_bottom` contains an `admin_sp` branch and a non-`admin_sp` skeleton branch for the menu drawer.
- `des_adm.min.js` shows special handling for `mb_nav` and `mb_cat` in Theme Editor / section reload flows.
- Homepage/index behavior has an extra admin/static-copy path in `des_adm.min.js`; exact runtime effect is partly editor-specific and should be runtime-checked if homepage drawer content behaves differently from inner pages.

## 4. CSS map

### Mobile header shell

Primary owners:

- [sections/header-inline.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-inline.liquid)
- [sections/header-bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-bottom.liquid)
- [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid)
- [sections/header-categories-menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-categories-menu.liquid)
- [sections/header-vertical.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-vertical.liquid)

Shared selectors:

- `.t4s-header__wrapper`
- `[data-header-options]`
- `.t4s-header__logo`
- `.header__mobile-logo`
- `.t4s-site-nav__icons`
- `.t4s-push-menu-btn`

Header state classes from static search:

- `.is-header--stuck`
- `.shopify-section-header-hidden`
- `.t4s-section-header.animate`

### Menu drawer panel

Primary owners:

- [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css)
- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

Key selectors:

- `#t4s-menu-drawer`
- `.t4s-drawer`
- `.t4s-drawer__left`
- `[aria-hidden=false]`

Base behavior from static CSS:

- width defaults to `calc(100vw - 65px)`
- becomes `340px` from `641px` up
- slides in from left by default
- is visible/open when `aria-hidden=false`

### Drawer overlay

Primary owner:

- [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)

Key selectors:

- `.t4s-close-overlay`
- `.t4s-close-overlay.is--visible`

Behavior:

- fixed fullscreen overlay
- hidden by default
- becomes clickable/visible with `.is--visible`

### Open/close states

Primary owners:

- [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css)
- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

Key selectors:

- `.t4s-drawer[aria-hidden=false]`
- `.t4s-drawer-menu__close`
- `#t4s-menu-drawer[aria-hidden=false] + .t4s-drawer-menu__close`
- `.t4s-menu-item-has-children.is--opend`

### Nested menu levels

Primary owner:

- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

Key selectors:

- `.t4s-mb__menu .t4s-sub-menu`
- `.t4s-mb__menu .t4s-sub-sub-menu`
- `.t4s-mb__menu .t4s-sub-sub-sub-menu`
- `.t4s-mb__menu .t4s-menu-item-has-children`
- `.t4s-mb-nav__icon`

Behavior from static CSS:

- nested lists are `display:none` by default
- open state is driven by `.is--opend`
- left padding increases by level
- plus/minus chevron effect is made with `:before` and `:after` on `.t4s-mb-nav__icon`

### Menu item typography and spacing

Primary owner:

- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

Key selectors:

- `.t4s-mb__menu > li > a`
- `.t4s-mb__menu .t4s-sub-menu li > a`
- `.t4s-mb__menu .t4s-menu-item a i`
- `.t4s-lb_nav_mb`

Behavior from static CSS:

- top-level font size `14px`
- min height `50px`
- horizontal padding `20px`
- nested levels use `30px`, `40px`, `50px` left padding

### Icons

Primary owners:

- [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid)
- [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid)
- [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid)
- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

Key selectors:

- `.t4s-push-menu-btn`
- `.t4s-site-nav__icon`
- `.t4s-icon`
- `.t4s-count-box`
- `.t4s-menu-item-wishlist`
- `.t4s-menu-item-sea`
- `.t4s-menu-item-acount`

### Logo

Primary owners:

- [snippets/t4s_logo.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_logo.liquid)
- header section inline styles

Key selectors:

- `.t4s-header__logo`
- `.header__normal-logo`
- `.header__sticky-logo`
- `.header__mobile-logo`

### Search / account / cart areas

Primary owners:

- [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid)
- [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid)
- [sections/search-hidden.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/search-hidden.liquid)
- [sections/login-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/login-sidebar.liquid)
- [sections/mini_cart.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mini_cart.liquid)

### Animation and transitions

Primary owners:

- [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css)
- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

Evidence:

- drawer shell uses transform/visibility transitions
- menu tabs use fade-in animation
- close button uses transform/opacity transition
- submenu icon strokes rotate/fade via `.is--opend`

### Mobile breakpoints

Key evidence:

- `drawer.min.css`
  - `641px` width breakpoint for drawer width
  - `360px` special-case compact width
- `mobile_nav.css`
  - `641px` close-button position
  - `360px` compact adjustments
- header sections
  - many mobile/desktop switches rely on `t4s-d-lg-none`, `t4s-d-lg-block`, `t4s-d-md-inline-block`

### Body/page locking

Primary owner:

- [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)

Evidence:

- `.t4s-lock-scroll { overflow:hidden }`

Exact JS owner of when that class is applied is not shown directly in CSS; likely handled by [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js) based on keyword hits.

## 5. JS map

### Drawer open

Likely primary owner:

- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)

Evidence:

- exact hits for:
  - `data-drawer-options`
  - `t4s-close-overlay`
  - `t4s-lock-scroll`
  - `aria-hidden`
  - `opendDrawer`

Static interpretation:

- this file likely binds click handlers to elements with `data-drawer-options`
- likely opens the target drawer by updating `aria-hidden`
- likely shows the overlay and locks body scroll

### Drawer close

Likely primary owner:

- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)

Evidence:

- exact hit for `data-drawer-close`
- overlay and lock-scroll tokens in the same file

Static interpretation:

- likely closes drawers from:
  - close button click
  - overlay click
  - possibly escape key

Exact key handling is unknown from static search in the storefront runtime file.

### Overlay click

Likely owners:

- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)
- [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)

Evidence:

- JS hit: `t4s-close-overlay`
- CSS hit: `.t4s-close-overlay.is--visible`

### Nested submenu expand/collapse

Likely primary owner:

- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)

Evidence:

- exact hit: `is--opend`
- mobile nav CSS depends on `.t4s-menu-item-has-children.is--opend`

Static interpretation:

- storefront JS likely toggles `.is--opend` on nested menu items
- nested list show/hide probably happens via inline style toggling or JS slide behavior

Exact method is unknown from static search.

### Body scroll lock

Likely primary owner:

- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)

Evidence:

- exact hit: `t4s-lock-scroll`
- CSS utility exists in `base.css`

### Sticky/mobile header state

Likely owner:

- [assets/des_adm.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/des_adm.min.js) in editor support
- storefront runtime likely also uses shared header logic, but the clearest visible static evidence from this pass is in `des_adm.min.js`

Evidence:

- static search shows header sticky initialization and transparent/top-bar state handling in `des_adm.min.js`
- header sections emit `data-header-options='{ "isTransparent": ..., "isSticky": ..., "hideScroldown": ... }'`

### Search / predictive search trigger

Primary owner:

- [assets/predictive-search.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/predictive-search.min.js)

Evidence:

- exact hits:
  - `data-predictive-search`
  - `data-input-search`
  - `t4s-search-hidden`
  - `opendDrawer`

Static interpretation:

- search drawer instances bind to `[data-predictive-search]`
- the script focuses the input when the drawer fires `opendDrawer`
- results max-height is computed against `.t4s-section-header`

### Cart/account icon interactions

Primary trigger markup:

- [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid)
- [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid)

Shared drawer infrastructure likely handled by:

- [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)

Evidence:

- search, account, and cart links use `data-drawer-options` targeting:
  - `#t4s-search-hidden`
  - `#t4s-login-sidebar`
  - `#t4s-mini_cart`

### Theme Editor / section reload support

Primary owner:

- [assets/des_adm.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/des_adm.min.js)

Evidence from static search:

- recognizes `mb_nav` and `mb_cat`
- copies or rehydrates those sections for index/editor flows
- handles section load/unload/select interactions for drawer-related sections

### Unknowns from static search

- exact storefront function names that toggle `aria-hidden`
- exact implementation of submenu open/close animation in `global.min.js`
- whether `theme.min.js` has secondary mobile drawer responsibilities
- whether body lock is applied only on open or also on nested drawer states

## 6. Theme Editor / settings map

### Global Theme Settings

From [config/settings_schema.json](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/config/settings_schema.json):

- `header_design`
  - selects the active header section
- `logo_width`
- `logos_width`
- `logo_mb_width`
- `logo_tr_svg`
- `logo_tr`
- `logo_tr_width`
- `mobile_nav_type`
  - values from static search:
    - `1` mobile only
    - `2` categories only
    - `3` mobile + categories
    - `4` categories + mobile
- `only_icon`
  - affects mobile nav item presentation in `mb_nav`
- `login_side`
  - controls availability of the login sidebar drawer trigger
- `predictive_search`
- `filter_type_search`
- `show_search_suggest`
- `search_prs_suggest`
- `show_search_hotkey`
- `lang_pos`
- `currency_type`
- `flag_currency`
- `size_currency`
- `currency_pos`

### Header section settings

Repeated across several header sections:

- `h_navmb`
  - mobile header height
- `show_search`
- `show_acc`
- `show_wis`
- `cart_des`
- `sticky_header`
- `scroll_header`
- `transparent_header`
- `space_transparent_header`
- color/icon/search form related settings depending on header design

These are section settings, not global theme settings, and they change how the currently selected header design behaves.

### Mobile nav content settings

In [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid):

- section name: `Mobile Menu`
- block types include:
  - `menu`
  - `Collection Image List`
  - `Wishlist`
  - `Compare`
  - `Search`
  - `Account`
  - `Help text`
  - `Currency`
  - `Languages`

Important block fields include:

- `menu`
- `title`
- `url`
- `open_link`
- `icons_op`
- `image`
- `icon`
- repeated collection/image/url slots for collection-image-list blocks

Default block set includes:

- multiple `menu` blocks
- `wis`
- `sea`
- `acc`
- `help`
- `lang`
- `cur`

### Mobile categories settings

In [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid):

- section name: `Mobile Categories`
- block types include:
  - `Collection Link List`
  - `Collection image list`

Important fields include:

- `cat`
- `show_pr`
- `show_va`
- `txt_va`
- `title`
- `url`
- `menu`
- `icons_op`
- `image`
- `icon`
- repeated collection/image/url slots

## 7. Current mobile menu improvement opportunities

These are audit findings only. No implementation is proposed here.

| Opportunity | Likely files | Risk | What to test |
|---|---|---|---|
| Improve drawer width/background treatment | [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css), [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css), [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid) for sidebar mode | High | all header designs, especially sidebar mode and small screens under `360px` |
| Improve menu typography | [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css), [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid), [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid) | Medium | long labels, badge labels, multi-level items |
| Improve menu spacing / touch target size | [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css) | Medium | touch usability, long menus, nested levels |
| Improve menu hierarchy clarity | [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css), [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid) | Medium | nested submenu readability and open-state clarity |
| Improve drawer overlay treatment | [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css), [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js) | High | open/close, overlay click, body lock, all shared drawers |
| Improve close button treatment | [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css), [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid), [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid) | High | position in RTL/LTR, sidebar header mode, small screens |
| Improve logo area / mobile logo sizing | [snippets/t4s_logo.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_logo.liquid), [config/settings_schema.json](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/config/settings_schema.json), active header section CSS | High | sticky header, transparent header, mobile logo width, desktop unaffected |
| Move or emphasize search inside drawer | [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid), [sections/search-hidden.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/search-hidden.liquid), [assets/predictive-search.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/predictive-search.min.js) | High | search trigger behavior, predictive search, drawer layering |
| Add account/cart shortcuts inside drawer | [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid), shared right-side drawer sections | Medium | account guest vs customer, cart count, login drawer |
| Improve submenu animation | [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css), [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js) | High | open/close reliability, nested levels, performance |
| Improve active state styling | [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css), [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid), [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid) | Low to medium | active trail, nested current item indication |
| Improve sticky mobile header behavior | active header section, [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css), shared runtime JS | High | scroll down/up, drawer open while sticky, transparent header home page |
| Improve accessibility / ARIA | [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js), [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid), [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid) | High | keyboard close, focus, screen reader state, submenu state |
| Improve mobile performance | [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid), [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js), [assets/predictive-search.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/predictive-search.min.js) | High | drawer first open, predictive search load, homepage vs inner pages |

## 8. High-risk mobile menu files

1. [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid)
   - owns the actual menu drawer shell and the related right-side drawers
   - also owns late CSS/JS loading

2. [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)
   - strongest storefront evidence for generic drawer open/close, overlay, body lock, submenu state

3. [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css)
   - shared shell for menu, search, cart, and login drawers

4. [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
   - owns the visual structure of the mobile menu, tabs, nested levels, and close button

5. [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
   - primary mobile menu content owner

6. [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)
   - categories tab content owner when enabled by `mobile_nav_type`

7. [snippets/header.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/header.liquid)
   - header router; changing the wrong header path can make the drawer trigger appear missing

8. [snippets/t4s_group_btns.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns.liquid)
   - shared icon cluster for search/account/cart and embedded desktop predictive search form

9. [snippets/t4s_group_btns_split.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_group_btns_split.liquid)
   - same risk in split-header variants

10. [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid)
   - adds sidebar-specific positioning rules for the menu drawer and close button

11. [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)
   - overlay, lock-scroll, sticky utility classes are global

12. [assets/des_adm.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/des_adm.min.js)
   - editor-mode behavior for `mb_nav` / `mb_cat` can diverge from storefront if not respected

## 9. Future implementation routing

### Change mobile drawer width/background

- Inspect first:
  - [assets/drawer.min.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/drawer.min.css)
  - [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
  - [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid)
- Key selectors:
  - `#t4s-menu-drawer`
  - `.t4s-drawer`
  - `.t4s-drawer__left`
  - `.t4s-drawer-menu__close`

### Change mobile menu typography

- Inspect first:
  - [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
  - [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
  - [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)
- Key selectors:
  - `.t4s-mb__menu > li > a`
  - `.t4s-mb__menu .t4s-sub-menu li > a`
  - `.t4s-lb_nav_mb`

### Change menu item spacing

- Inspect first:
  - [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
- Key selectors:
  - `.t4s-mb__menu > li > a`
  - `.t4s-mb__menu .t4s-sub-menu li > a`
  - `.t4s-sub-sub-menu`
  - `.t4s-sub-sub-sub-menu`

### Change submenu expand/collapse styling

- Inspect first:
  - [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
  - [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)
  - [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
- Key selectors/classes:
  - `.t4s-menu-item-has-children`
  - `.is--opend`
  - `.t4s-mb-nav__icon`

### Add icons/shortcuts to drawer

- Inspect first:
  - [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
  - [theme-audit-data/snippet-reference-counts.txt](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/theme-audit-data/snippet-reference-counts.txt)
- Key block types:
  - `sea`
  - `acc`
  - `wis`
  - `compe`
  - `cur`
  - `lang`

### Move search into drawer

- Inspect first:
  - [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
  - [sections/search-hidden.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/search-hidden.liquid)
  - [assets/predictive-search.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/predictive-search.min.js)
  - [config/settings_schema.json](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/config/settings_schema.json)

### Change close button

- Inspect first:
  - [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid)
  - [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
  - [sections/header-sidebar.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/header-sidebar.liquid)
- Key selectors:
  - `.t4s-drawer-menu__close`
  - `#t4s-menu-drawer[aria-hidden=false] + .t4s-drawer-menu__close`

### Change overlay

- Inspect first:
  - [layout/theme.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/layout/theme.liquid)
  - [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)
  - [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)
- Key selectors:
  - `.t4s-close-overlay`
  - `.t4s-close-overlay.is--visible`

### Change mobile logo sizing

- Inspect first:
  - [snippets/t4s_logo.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/t4s_logo.liquid)
  - [config/settings_schema.json](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/config/settings_schema.json)
  - active header section CSS
- Key settings:
  - `logo_mb_width`
  - `logo_mb`
  - transparent/sticky logo settings

### Change sticky mobile header

- Inspect first:
  - active header section
  - [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)
  - [assets/des_adm.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/des_adm.min.js)
- Key selectors/settings:
  - `[data-header-options]`
  - `.is-header--stuck`
  - `.shopify-section-header-hidden`
  - `sticky_header`
  - `scroll_header`

### Fix drawer open/close issue

- Inspect first:
  - [snippets/push_menu.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/push_menu.liquid)
  - [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid)
  - [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)
  - [assets/base.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/base.css)

### Fix nested menu issue

- Inspect first:
  - [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
  - [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)
  - [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)
  - [assets/global.min.js](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/global.min.js)

## 10. Testing checklist after mobile menu edits

- iPhone width
  - especially narrow widths near the `360px` CSS branch
- Android width if possible
- Safari mobile if possible
- drawer open from the hamburger trigger
- drawer close from the close button
- drawer close from overlay click
- drawer close from escape key if keyboard is available
- nested submenu expand/collapse for level 1, 2, and 3
- scrolling inside the menu drawer
- body scroll lock while drawer is open
- tabs if `mobile_nav_type` includes both menu and categories
- logo display in mobile header
- search icon trigger in header
- search row inside mobile menu if present
- predictive search drawer behavior
- account icon / account drawer behavior
- cart icon / mini cart drawer behavior
- sticky header state while drawer opens/closes
- transparent header behavior on homepage if enabled
- desktop header remains unaffected
- collection page header remains unaffected
- product page header remains unaffected
- cart page header remains unaffected
- Theme Editor preview / section reload behavior if the change touches `mb_nav`, `mb_cat`, or shared drawer JS/CSS

## Summary judgment

The mobile menu drawer is a composed system, not a single file:

- trigger placement lives in the active header section through `push_menu`
- drawer shell lives in `render_bottom`
- content lives in `mb_nav` and `mb_cat`
- visual presentation lives mainly in `mobile_nav.css` on top of shared `drawer.min.css`
- storefront drawer behavior likely lives mainly in `global.min.js`
- predictive search and Theme Editor support add extra layers through `predictive-search.min.js` and `des_adm.min.js`

Future intricate redesign work should start by deciding which layer is actually being changed:

- header trigger layer
- drawer shell layer
- content layer
- visual layer
- shared drawer runtime layer

Mixing those layers casually will create regressions quickly in this theme.

## Phase 1 implementation notes

This audit now has a matching Phase 1 implementation in the mobile menu layer only.

### Files changed

- [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
- [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)
- [assets/mobile_nav.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/mobile_nav.css)

### Theme Editor controls added

Added to both mobile menu sections so the shared drawer can be styled without code:

- `mobile_drawer_bg_color`
- `mobile_drawer_text_color`
- `mobile_drawer_accent_color`
- `mobile_drawer_border_color`
- `mobile_drawer_top_item_font_size`
- `mobile_drawer_sub_item_font_size`
- `mobile_drawer_item_spacing`
- `mobile_drawer_submenu_indent`
- `mobile_drawer_letter_spacing`
- `mobile_drawer_uppercase`
- `mobile_drawer_close_bg_color`
- `mobile_drawer_close_icon_color`
- `mobile_drawer_radius`

Practical ownership:

- [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid) is the style owner for normal mobile and mixed menu/categories modes.
- [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid) is the fallback style owner for categories-only mode (`mobile_nav_type == '2'`).

### CSS variables added

The implementation outputs these scoped variables onto `#t4s-menu-drawer`:

- `--yo-mobile-drawer-bg`
- `--yo-mobile-drawer-text`
- `--yo-mobile-drawer-accent`
- `--yo-mobile-drawer-border`
- `--yo-mobile-drawer-top-item-size`
- `--yo-mobile-drawer-sub-item-size`
- `--yo-mobile-drawer-item-spacing`
- `--yo-mobile-drawer-submenu-indent`
- `--yo-mobile-drawer-letter-spacing`
- `--yo-mobile-drawer-uppercase`
- `--yo-mobile-drawer-close-bg`
- `--yo-mobile-drawer-close-icon`
- `--yo-mobile-drawer-radius`

### Selectors touched

Phase 1 styling was intentionally limited to the mobile drawer surface:

- `#t4s-menu-drawer`
- `#t4s-menu-drawer .t4s-drawer__content`
- `#t4s-menu-drawer .t4s-drawer__header.t4s-mb-nav__tabs`
- `#t4s-menu-drawer .t4s-mb-tab__title`
- `#menu-mb__ul`
- `#menu-mb__cat`
- `.t4s-mb__menu > li > a`
- `.t4s-mb__menu .t4s-sub-menu li > a`
- `.t4s-mb__menu .t4s-sub-sub-menu li > a`
- `.t4s-mb__menu .t4s-sub-sub-sub-menu li > a`
- `.t4s-mb__menu .t4s-menu-item-has-children.is--opend > a`
- `.t4s-mb__menu .t4s-mb-nav__icon`
- `.t4s-lb_nav_mb`
- `.t4s-drawer-menu__close`

### Phase 2 ideas

If a later pass is needed, the safest next layer would be:

- stronger active-trail styling for current menu items
- dedicated styling for search/account/cart utility rows
- optional merchant controls for overlay treatment
- optional merchant controls for drawer width and internal section spacing
- accessibility review of focus/escape behavior if runtime work is approved later

### Testing notes

After Phase 1 changes, test:

- menu-only mode
- categories-only mode
- mixed menu/categories mode
- narrow mobile widths near `360px`
- close button visibility/position in standard and sidebar header designs
- nested submenu readability at levels 1 to 3
- search/account/cart rows still functioning unchanged
- desktop header and desktop nav unaffected

## Ya Omri custom drawer implementation notes

This theme now also has a safer toggleable custom inner drawer path that keeps the existing Kalles/T4S drawer runtime and nested menu contract intact.

### Files changed

- [snippets/yaomri-mobile-drawer.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/yaomri-mobile-drawer.liquid)
- [assets/yaomri-mobile-drawer.css](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/assets/yaomri-mobile-drawer.css)
- [snippets/render_bottom.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/snippets/render_bottom.liquid)
- [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid)
- [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid)

### Toggle behavior

- `yaomri_mobile_drawer_enable = false`
  - original Kalles mobile menu markup renders exactly as before
- `yaomri_mobile_drawer_enable = true`
  - the original menu tree is captured and rendered inside the Ya Omri wrapper
  - drawer shell ID, close button contract, trigger contract, and nested menu classes remain intact

### Theme Editor controls added

Added to both mobile drawer content sections:

- `yaomri_mobile_drawer_enable`
- `yaomri_mobile_drawer_bg_color`
- `yaomri_mobile_drawer_text_color`
- `yaomri_mobile_drawer_accent_color`
- `yaomri_mobile_drawer_border_color`
- `yaomri_mobile_drawer_top_item_font_size`
- `yaomri_mobile_drawer_sub_item_font_size`
- `yaomri_mobile_drawer_item_spacing`
- `yaomri_mobile_drawer_submenu_indent`
- `yaomri_mobile_drawer_uppercase`
- `yaomri_mobile_drawer_close_bg_color`
- `yaomri_mobile_drawer_close_icon_color`
- `yaomri_mobile_drawer_width`
- `yaomri_mobile_drawer_radius`

Practical ownership:

- [sections/mb_nav.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_nav.liquid) is the main owner for menu-only and mixed modes.
- [sections/mb_cat.liquid](/Users/danny/Desktop/shopify-themes/yaomri-kalles-edit/sections/mb_cat.liquid) mirrors the same settings so categories-only mode can opt into the custom drawer too.

### Nested submenu contract preserved

The custom drawer does not rebuild the menu tree. It preserves:

- `.t4s-mb__menu`
- `li.t4s-menu-item`
- `.t4s-menu-item-has-children`
- `.t4s-item-level-0`
- `.t4s-item-level-1`
- `.t4s-item-level-2`
- anchor then immediate nested `ul`
- `.t4s-sub-menu`
- `.t4s-sub-sub-menu`
- `.t4s-sub-sub-sub-menu`
- `.t4s-mb-nav__icon`
- `.is--opend`

### Safety notes

- `#t4s-menu-drawer` remains the shared drawer shell
- `data-drawer-options` trigger contract remains unchanged
- `.t4s-drawer-menu__close[data-drawer-close]` remains unchanged
- `assets/drawer.min.css` is untouched
- storefront JS is untouched

### Phase 2 ideas

- optional merchant-controlled logo treatment inside the custom intro area
- optional current-trail styling for active menu branches
- optional cart/search/account visual refinement if runtime-safe
- optional categories tab-specific intro treatment

## Visual QA fixes

- Full-height background fix:
  - the selected `yaomri_mobile_drawer_bg_color` now fills the custom drawer top-to-bottom through the scoped custom layer on `#t4s-menu-drawer .t4s-mb-tab__content:has(.yo-mobile-drawer)`, `.yo-mobile-drawer`, and `.yo-mobile-drawer__inner`
  - this keeps the shared drawer shell and `assets/drawer.min.css` untouched
- Title / translation key fix:
  - the custom intro now uses the eyebrow `YA OMRI SWIMWEAR`
  - the custom render path now passes readable literal titles (`Menu` / `Categories`) instead of outputting the raw translation key
- Popup separation:
  - the floating `10% OFF` popup is a separate popup and was intentionally left untouched in this pass
- Files changed for this visual QA pass:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- Remaining QA checks:
  - confirm full-height background at short and tall mobile viewport heights
  - confirm menu and categories variants both render readable titles
  - confirm submenu open states remain clear at levels 1 to 3

## Selected mockup direction

- clean, premium, app-like mobile drawer
- soft ivory / off-white full-height background
- confident black typography
- muted rose accents only
- large editorial `Menu` heading
- top search pill plus compact action pills
- two image-led category cards
- refined menu list underneath
- bottom trust strip

## Current custom implementation

- Files changed:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `assets/yaomri-mobile-drawer-search.js`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- New settings added:
  - `yaomri_mobile_drawer_search_enable`
  - `yaomri_mobile_drawer_cards_enable`
  - `yaomri_mobile_drawer_card_1_image`
  - `yaomri_mobile_drawer_card_1_heading`
  - `yaomri_mobile_drawer_card_1_subtitle`
  - `yaomri_mobile_drawer_card_1_link`
  - `yaomri_mobile_drawer_card_2_image`
  - `yaomri_mobile_drawer_card_2_heading`
  - `yaomri_mobile_drawer_card_2_subtitle`
  - `yaomri_mobile_drawer_card_2_link`
  - `yaomri_mobile_drawer_card_height`
  - `yaomri_mobile_drawer_card_heading_font_size`
  - `yaomri_mobile_drawer_card_subtitle_font_size`
  - `yaomri_mobile_drawer_card_text_weight`
  - `yaomri_mobile_drawer_card_heading_uppercase`
  - `yaomri_mobile_drawer_card_subtitle_uppercase`
  - `yaomri_mobile_drawer_card_text_align`
  - `yaomri_mobile_drawer_card_overlay_strength`
- Visual structure added inside the custom wrapper:
  - optional real search form
  - optional in-drawer predictive search results via isolated Ya Omri script
  - two image-led collection cards
  - wrapped menu panel using the preserved Kalles menu tree
  - bottom account/action panel

## Testing checklist

- `yaomri_mobile_drawer_enable = false`
  - original drawer renders unchanged
- `yaomri_mobile_drawer_enable = true`
  - custom wrapper renders
- verify drawer open / close / overlay close
- verify body scroll lock still works
- verify nested submenus still expand and collapse at levels 1 to 3
- verify cards render with and without uploaded images
- verify trust strip text wraps cleanly at narrow widths
- verify categories-only mode still renders correctly
- verify desktop header remains unaffected

## Known limitations

- search, sign in, and cart pills use safe link targets, not custom JS triggers
- the custom drawer preserves the original menu tree instead of rebuilding item markup, so some native menu-row icon availability still depends on the existing section content

## Clean modern refinement

- Reduced boxed styling:
  - removed the boxed menu panel treatment
  - reduced heavy borders and shadows across search/actions/menu areas
- Softened radius and borders:
  - lower default radius
  - smaller card and control rounding
  - thinner divider treatment
- Cleaner rows:
  - full-width menu rows
  - quieter hover/open states
  - lighter chevron and plus treatment
- Sleeker cards and actions:
  - lighter image-card fallback background
  - less pill-heavy action controls
  - quieter trust strip
- Files changed:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- Testing notes:
  - verify the action controls still fit on one row at 360px
  - verify cards remain readable with and without uploaded images
  - verify submenu indentation still reads clearly after the row simplification

## Phase 1 visual cleanup

- Borrowed visual ideas from the Lovable reference:
  - root-view composition
  - cleaner search/action hierarchy
  - lighter feature-card placement
  - flatter, divider-led menu rows
  - quieter footer/trust treatment
- Rejected from the Lovable reference:
  - standalone drawer runtime
  - separate overlay and body-lock handling
  - custom JS close / ESC / focus-trap system
  - separate drill-panel runtime for Phase 1
- Files changed:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `THEME_MOBILE_MENU_DRAWER_AUDIT.md`
- No JS changed in this phase.
- Phase 2 option remains:
  - optional JS-involved drill-panel navigation only if explicitly approved after the current Kalles-based drawer is visually stable

## Search and typography refinement

- Typography controls added:
  - `yaomri_mobile_drawer_font_family`
  - `yaomri_mobile_drawer_top_item_weight`
  - `yaomri_mobile_drawer_sub_item_weight`
  - `yaomri_mobile_drawer_item_italic`
  - `yaomri_mobile_drawer_heading_letter_spacing`
- Image card radius control added:
  - `yaomri_mobile_drawer_card_radius`
- Top custom eyebrow/title removed from the custom drawer.
- The custom search surface is now a real search form:
  - `action="{{ routes.search_url }}"`
  - `method="get"`
  - input `name="q"`
- Utilities moved to a bottom account/action panel.
- Trust strip removed from the custom drawer render.
  - trust settings remain in schema for now to avoid unnecessary settings churn
- Default custom drawer background changed to white.
- Files changed:
  - `snippets/yaomri-mobile-drawer.liquid`
  - `assets/yaomri-mobile-drawer.css`
  - `sections/mb_nav.liquid`
  - `sections/mb_cat.liquid`
- Testing notes:
  - verify the search form submits correctly to the storefront search page
  - verify the close button now feels visually integrated with the top-right of the custom drawer
  - verify the bottom account/action panel stays clean on `360px`
