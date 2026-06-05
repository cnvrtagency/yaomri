# Instagram Feed Audit

Date: 2026-06-05

Scope: audit only. No existing theme files were changed. The active Instagram feed logic, API/proxy behavior, JavaScript, and section schema should remain untouched until an implementation task explicitly targets them.

## 1. Active Implementation Summary

The homepage uses the custom hyphenated section:

- `sections/instagram-feed.liquid`
- homepage section instance: `templates/index.json` section key `instagram_feed_PzgAaw`
- homepage section type: `instagram-feed`

Important distinction:

- `sections/instagram-feed.liquid` is the active Claude-created feed section on the homepage.
- `sections/instagram_feed.liquid`, `sections/instagram_feed_api.liquid`, and `sections/instagram-shop.liquid` are older/native Kalles/T4S Instagram sections. They are not the active homepage section in `templates/index.json`.

## 2. Files Involved

Active feed files:

- `sections/instagram-feed.liquid`
  - owns markup, inline CSS, inline JavaScript, schema, and fetch/render logic
- `templates/index.json`
  - places the section on the homepage and stores its configured settings

Related but not active for the current homepage feed:

- `sections/instagram_feed.liquid`
  - native/static-image Kalles section using `assets/instagram.css`
- `sections/instagram_feed_api.liquid`
  - native app/API Kalles section using `assets/instagram.css`
- `sections/instagram-shop.liquid`
  - native Instagram shop/pin section using `assets/instagram-pin.css`
- `assets/instagram.css`
  - native underscore-section styling, not loaded by `sections/instagram-feed.liquid`
- `assets/instagram-pin.css`
  - native `instagram-shop` styling, not loaded by `sections/instagram-feed.liquid`

No snippets are rendered by the active `sections/instagram-feed.liquid`.

No external theme JS asset is loaded specifically by the active section. Its JavaScript is inline in the section file.

## 3. Homepage Placement

`templates/index.json` defines:

- section key: `instagram_feed_PzgAaw`
- type: `instagram-feed`
- name: `Instagram Feed`
- order position: after `featured_collection_RYCjmA` and before `featured_collection_eCFnCq`

The saved homepage settings include:

- eyebrow: `Follow our journey`
- title: `Tag us @yaomriswimwear`
- handle: `yaomriswimwear`
- access token: present in template settings; do not copy, expose, move, or alter
- Instagram Business Account ID: present
- post count: `4`
- desktop columns: `4`
- gap: `4`
- background color: `#000000`
- show follow button: `true`

## 4. Current Render Structure

`sections/instagram-feed.liquid` outputs:

- `<section class="instagram-feed" style="padding: 60px 0; background: ...">`
- `.container`
- optional header when `section.settings.title` is not blank:
  - `.instagram-feed__header`
  - `.instagram-feed__eyebrow`
  - `.instagram-feed__title`
- feed mount:
  - `.instagram-feed__grid`
  - `id="instagram-grid"`
  - initial `.instagram-feed__loading`
- optional footer when `show_follow` is true:
  - `.instagram-feed__footer`
  - `.instagram-feed__follow`
  - hardcoded URL pattern `https://instagram.com/{{ section.settings.handle }}`

The JavaScript replaces the contents of `#instagram-grid` with fetched post items.

Generated item markup from JavaScript:

- `<a href="${post.permalink}" target="_blank" class="instagram-feed__item">`
- `<img src="${img}" alt="Instagram" loading="lazy">`
- `.instagram-feed__overlay`
- inline Instagram SVG icon with class `.instagram-feed__overlay-icon`
- optional `.instagram-feed__video-badge` with text `Reel`
- optional `.instagram-feed__video-badge` with text `Album`

Video handling:

- if `post.media_type === 'VIDEO'`, the image source uses `post.thumbnail_url`
- video posts get a `Reel` badge

Carousel handling:

- if `post.media_type === 'CAROUSEL_ALBUM'`, the image source uses `post.media_url`
- carousel posts get an `Album` badge

Image handling:

- non-video posts use `post.media_url`
- all rendered media URLs are proxied through the worker image route before being used as `<img src>`

Permalink handling:

- every rendered item links directly to `post.permalink`
- links open in a new tab

## 5. Current Logic And Data Ownership

The active feed is JavaScript/API driven, not static Liquid blocks.

Logic path:

- inline script reads:
  - `section.settings.access_token`
  - `section.settings.ig_account_id`
  - `section.settings.post_count`
- inline script uses the Cloudflare Worker proxy:
  - `https://black-darkness-b2ec.danlyons20.workers.dev`
- fetch URL shape:
  - `/?token=...&ig_id=...&count=...`
- expected JSON shape:
  - `data.data` array
  - `data.error` indicates failure
- item render fields:
  - `media_type`
  - `thumbnail_url`
  - `media_url`
  - `permalink`

What must not be touched in a visual redesign:

- `proxyUrl`
- `access_token` setting behavior
- `ig_account_id` setting behavior
- fetch URL and query parameters
- `post_count` data ownership
- `data.data` / `data.error` handling
- media-type branching for VIDEO and CAROUSEL_ALBUM
- `post.permalink` link behavior
- proxied image route
- the `id="instagram-grid"` mount unless the JavaScript is deliberately updated in the same task

Safe styling-only surface:

- wrapping static section/header/grid/footer markup around the existing mount
- CSS for `.instagram-feed`, `.instagram-feed__header`, `.instagram-feed__grid`, `.instagram-feed__item`, overlay, badges, and follow button
- visual-only inline style variables derived from existing or future section settings

## 6. Current Theme Editor Settings

Existing active section settings:

- `eyebrow`
  - type: `text`
  - label: `Eyebrow text`
  - default: `Follow our journey`
- `title`
  - type: `text`
  - label: `Section title`
  - default: `Tag us @yaomriswimwear`
- `handle`
  - type: `text`
  - label: `Instagram handle (without @)`
  - default: `yaomriswimwear`
- `access_token`
  - type: `textarea`
  - label: `Instagram access token`
- `ig_account_id`
  - type: `text`
  - label: `Instagram Business Account ID`
  - default: present in schema
- `post_count`
  - type: `range`
  - label: `Number of posts`
  - min: `4`
  - max: `12`
  - step: `1`
  - default: `6`
- `columns`
  - type: `range`
  - label: `Columns (desktop)`
  - min: `3`
  - max: `6`
  - step: `1`
  - default: `4`
- `gap`
  - type: `range`
  - label: `Gap between posts (px)`
  - min: `0`
  - max: `16`
  - step: `2`
  - default: `4`
- `background_color`
  - type: `color`
  - label: `Background colour`
  - default: `#ffffff`
- `show_follow`
  - type: `checkbox`
  - label: `Show follow button`
  - default: `true`

No current settings exist for:

- body/copy text
- CTA label text
- CTA link override
- split layout
- grid aspect ratio
- image/card radius
- section padding
- text alignment
- left-panel width
- dark/light mode preset
- mobile columns

## 7. Current Styling Ownership

The active section has inline CSS in `sections/instagram-feed.liquid`.

Current selectors:

- `.instagram-feed__header`
  - centered text
  - bottom margin
- `.instagram-feed__eyebrow`
  - small uppercase text
  - brown/beige color `#a08060`
- `.instagram-feed__title`
  - 28px
  - very heavy weight
  - italic
  - dark warm color `#1a1208`
- `.instagram-feed__grid`
  - CSS grid
  - desktop columns from `section.settings.columns`
  - gap from `section.settings.gap`
- mobile grid media queries:
  - max-width 768px: 2 columns
  - max-width 480px: 2 columns
- `.instagram-feed__item`
  - relative positioned link card
  - hidden overflow
  - square `aspect-ratio: 1`
  - warm placeholder background
- `.instagram-feed__item img`
  - full cover image
  - hover scale transition
- `.instagram-feed__overlay`
  - absolute overlay
  - transparent by default
  - darkens on item hover
- `.instagram-feed__overlay-icon`
  - hidden until hover
  - white icon
- `.instagram-feed__video-badge`
  - top-right small badge
  - black translucent background
  - reused for Reel and Album
- `.instagram-feed__footer`
  - centered footer
- `.instagram-feed__follow`
  - outlined uppercase button
  - black text/border
  - black-fill hover
- `.instagram-feed__loading`
  - full grid row
  - centered uppercase status text

External CSS note:

- `assets/instagram.css` and `assets/instagram-pin.css` are not loaded by the active hyphenated `instagram-feed` section. They belong to older/native sections and should not be edited for the planned visual redesign unless that scope changes.

## 8. Current JavaScript

The active JavaScript is inline inside `sections/instagram-feed.liquid`.

It does:

- defines a Cloudflare Worker proxy URL
- reads token, Instagram account ID, and count from section settings
- finds the mount with `document.getElementById('instagram-grid')`
- exits early with a loading message if token or account ID are missing
- fetches feed JSON from the worker
- validates `data.data` and `data.error`
- maps returned posts into anchor cards
- uses proxied image URLs
- handles videos via `thumbnail_url`
- labels videos as `Reel`
- labels carousel albums as `Album`
- catches fetch/render errors and shows `Could not load feed.`

Selectors/IDs the JavaScript depends on:

- `#instagram-grid`
- `.instagram-feed__loading`
- `.instagram-feed__item`
- `.instagram-feed__overlay`
- `.instagram-feed__overlay-icon`
- `.instagram-feed__video-badge`

The most critical selector is `id="instagram-grid"` because the script mounts the fetched cards there. Class names are also embedded in the generated HTML, so changing them requires updating both CSS and the template string.

Layout can be changed without breaking fetch logic if:

- `#instagram-grid` remains present before the script runs
- the script remains after the markup or is made robust in the same implementation
- generated item markup keeps a single clickable item per post
- the proxy/fetch/token/media branches remain unchanged

## 9. Safe Design Opportunities

The requested split layout can be achieved without touching feed logic.

Safe markup changes:

- add `.instagram-feed__inner` inside `.container`
- add `.instagram-feed__intro` around the existing eyebrow/title/follow text area
- add `.instagram-feed__media` around the existing `#instagram-grid`
- optionally move the follow button into the left intro panel on desktop
- keep the same `#instagram-grid` element as the JS mount
- keep generated post item markup unchanged for Phase 1

Safe CSS changes:

- make `.instagram-feed__inner` a two-column grid on desktop
- left column: editorial intro panel, handle, body copy, CTA/follow button
- right column: image grid
- use a black/white/soft blush palette without changing data logic
- use section-scoped CSS variables on `.instagram-feed`
- set `.instagram-feed__grid` columns independently for split mode
- adjust card gap, radius, aspect ratio, and overlay styling
- use responsive stacking on mobile

Safe schema additions for design only:

- layout style selector
- design copy fields
- colors
- spacing
- grid/card presentation controls

Avoid:

- changing token/API fields
- changing fetch URL
- changing proxy URL
- changing item generation logic
- changing media type handling
- changing `id="instagram-grid"`
- moving feed rendering to Liquid blocks

## 10. Suggested Design Controls For Later

Recommended later Theme Editor controls:

- `layout_style`
  - options: `grid`, `split`, `carousel`, `dark_strip`
  - default: current visual behavior or `grid` for backwards compatibility
- `background_color`
  - already exists; can keep
- `eyebrow`
  - already exists
- `title`
  - already exists
- `body_text`
  - new textarea/richtext for left intro panel copy
- `handle`
  - already exists
- `cta_label`
  - new text; default could mirror `Follow @...`
- `cta_link`
  - optional URL override; fallback to Instagram handle URL
- `image_radius`
  - range 0-24px
- `grid_gap`
  - current `gap` exists; may keep or rename only with migration care
- `image_aspect_ratio`
  - options: square, portrait, landscape, natural
- `columns_desktop`
  - current `columns` exists; keep for compatibility or add only if needed
- `columns_tablet`
  - range 2-4
- `columns_mobile`
  - range 1-2
- `left_panel_width`
  - range or select such as 32%, 36%, 40%
- `text_alignment`
  - left, center
- `section_padding_desktop`
  - top/bottom ranges
- `section_padding_mobile`
  - top/bottom ranges
- `dark_mode`
  - checkbox or style preset
- `accent_color`
  - soft blush accent
- `text_color`
  - primary text
- `button_style`
  - outline, solid, text

Keep Shopify range settings within 101 steps.

## 11. Risks

High-risk areas:

- `access_token` is stored in `templates/index.json`; do not expose it in docs, diffs, logs, or screenshots
- `proxyUrl` is hardcoded and externally owned; changing it changes feed behavior
- fetch query parameters are part of the worker contract
- `id="instagram-grid"` is required by `document.getElementById`
- generated item class names are duplicated between inline CSS and JS template strings
- moving the script before the grid markup would break the current mount lookup
- changing anchor wrapping can affect click-through behavior to Instagram
- changing image URL handling can break video thumbnails or proxy caching
- changing settings IDs can orphan existing Theme Editor data
- editing older/native Instagram sections could affect unrelated templates or future section uses

Moderate-risk areas:

- changing the section wrapper class from `.instagram-feed`
- moving the follow button without checking mobile order
- adding too many schema controls before the desired design is finalized
- introducing global CSS instead of section-scoped CSS

Low-risk areas:

- adding wrapper divs around existing header/grid/footer
- adding section-scoped CSS variables
- adjusting visual CSS for the active selectors
- adding design-only settings with new IDs

## 12. Phase 1 Implementation Recommendation

Goal for Phase 1:

- create the split visual presentation while preserving feed logic exactly

Files to edit:

- `sections/instagram-feed.liquid`
- optionally this audit doc after implementation notes are needed

Files to avoid:

- `sections/instagram_feed.liquid`
- `sections/instagram_feed_api.liquid`
- `sections/instagram-shop.liquid`
- `assets/instagram.css`
- `assets/instagram-pin.css`
- global JS files
- `templates/index.json` unless only changing Theme Editor settings through Shopify
- any token/API/proxy configuration

Exact safe approach:

1. Keep the existing section type and setting IDs.
2. Keep `#instagram-grid` and the inline JavaScript fetch/render logic unchanged.
3. Wrap existing static markup into:
   - `.instagram-feed__inner`
   - `.instagram-feed__intro`
   - `.instagram-feed__media`
4. Put heading, optional body copy, handle, and follow CTA in the left intro panel.
5. Put the existing `#instagram-grid` inside the right media panel.
6. Replace the current centered grid styling with a desktop split grid.
7. Keep mobile as a single-column stack: intro first, feed grid second, CTA near intro or below grid depending on final design.
8. Add only design settings needed for Phase 1, preferably:
   - layout style
   - body text
   - CTA label
   - image/card radius
   - image aspect ratio
   - section padding desktop/mobile
   - left panel width
9. Use CSS variables on `.instagram-feed` rather than global CSS.
10. Do not alter token, proxy, fetch, or media-type branches.

Testing checklist:

- homepage still renders the section in the same order
- `#instagram-grid` exists before the script runs
- valid token/account ID still loads posts
- missing token/account ID still shows the existing setup message
- fetch failure still shows `Could not load feed.`
- image posts render
- video posts render with thumbnail and `Reel` badge
- carousel posts render with `Album` badge
- each item links to Instagram permalink
- follow CTA links to the configured handle
- desktop split layout matches Ya Omri premium direction
- mobile stack is clean and does not overflow
- no global CSS/JS or old native Instagram sections are affected

## 13. Suggested Next Implementation Prompt

Read `THEME_WORKING_GUIDE.md` first.
Read `THEME_INSTAGRAM_FEED_AUDIT.md`.

This is an implementation task.

Redesign only the visual presentation of the active homepage Instagram section in `sections/instagram-feed.liquid`.

Hard rules:
- Do not change fetch logic.
- Do not change the Cloudflare Worker proxy URL.
- Do not change token/account ID behavior.
- Do not change `post_count` behavior.
- Do not change media type handling for VIDEO or CAROUSEL_ALBUM.
- Do not change `id="instagram-grid"`.
- Do not edit `sections/instagram_feed.liquid`, `sections/instagram_feed_api.liquid`, `sections/instagram-shop.liquid`, `assets/instagram.css`, or `assets/instagram-pin.css`.
- Do not edit global JS.

Goal:
- create a premium split layout:
  - left intro/content panel
  - right image grid
  - black/white/soft blush Ya Omri styling
  - sharp luxury swimwear ecommerce feel
  - natural homepage fit

Implementation:
- add safe wrapper markup around the existing header/grid/footer
- keep the same JavaScript mount and render logic
- add section-scoped CSS only
- add minimal design-only schema settings if needed
- preserve existing settings IDs for compatibility

Report files changed, selectors added, settings added, logic preserved, and browser testing checklist.

## 14. Implementation Update: Layout And Carousel Controls

Date: 2026-06-05

Files changed:

- `sections/instagram-feed.liquid`
- `THEME_INSTAGRAM_FEED_AUDIT.md`

Protected files left untouched:

- `sections/instagram_feed.liquid`
- `sections/instagram_feed_api.liquid`
- `sections/instagram-shop.liquid`
- `assets/instagram.css`
- `assets/instagram-pin.css`
- global JavaScript files
- `templates/index.json`

Controls added to the active hyphenated section:

- `layout_style`
  - `grid`
  - `split`
- `desktop_display_mode`
  - `grid`
  - `carousel`
- `mobile_display_mode`
  - `grid`
  - `carousel`
- `posts_per_row_desktop`
- `posts_per_row_tablet`
- `posts_per_row_mobile`
- `carousel_gap`
- `show_carousel_arrows`
- `carousel_snap`
- `carousel_peek`
- `text_color`
- `accent_color`
- `card_radius`
- `image_aspect_ratio`
  - `square`
  - `portrait`
  - `landscape`
- `section_padding_desktop`
- `section_padding_mobile`
- `intro_width`
- `body_text`
- `cta_label`

Existing settings preserved:

- `eyebrow`
- `title`
- `handle`
- `access_token`
- `ig_account_id`
- `post_count`
- `columns`
- `gap`
- `background_color`
- `show_follow`

Backward compatibility note:

- `columns` remains in schema as `Columns (desktop, legacy)`.
- New `posts_per_row_*` settings drive the new layout.
- The section still falls back to `columns` for desktop posts-per-row if the new setting is absent in existing saved data.

Presentation changes:

- Added section state classes:
  - `.instagram-feed--layout-grid`
  - `.instagram-feed--layout-split`
  - `.instagram-feed--desktop-grid`
  - `.instagram-feed--desktop-carousel`
  - `.instagram-feed--mobile-grid`
  - `.instagram-feed--mobile-carousel`
  - `.instagram-feed--aspect-square`
  - `.instagram-feed--aspect-portrait`
  - `.instagram-feed--aspect-landscape`
  - `.instagram-feed--snap`
- Added wrapper structure:
  - `.instagram-feed__inner`
  - `.instagram-feed__intro`
  - `.instagram-feed__media`
  - `.instagram-feed__arrows`
  - `.instagram-feed__arrow`
- Preserved `id="instagram-grid"` as the feed mount.

Carousel behavior:

- Carousel mode is CSS horizontal scroll.
- `carousel_snap` enables `scroll-snap-type`.
- `carousel_peek` adds side peek/scroll padding.
- Desktop item widths are calculated from `posts_per_row_desktop`.
- Tablet item widths are calculated from `posts_per_row_tablet`.
- Mobile item widths are calculated from `posts_per_row_mobile`.
- Optional arrows use a small section-scoped click handler that only calls `scrollBy` on `#instagram-grid`.

Feed logic preserved:

- Cloudflare Worker `proxyUrl` is unchanged.
- `access_token` behavior is unchanged.
- `ig_account_id` behavior is unchanged.
- `post_count` behavior is unchanged.
- fetch URL/query shape is unchanged.
- `VIDEO` still uses `thumbnail_url`.
- non-video media still uses `media_url`.
- `CAROUSEL_ALBUM` still gets the `Album` badge.
- `VIDEO` still gets the `Reel` badge.
- generated item links still use `post.permalink`.
- feed is still JavaScript/API driven, not static blocks.

Testing checklist:

- Section schema parses.
- `#instagram-grid` exists in rendered HTML.
- Feed still loads with valid token/account ID.
- Missing token/account ID still shows the setup message.
- Fetch failure still shows the failure message.
- Video posts render thumbnail and `Reel` badge.
- Carousel album posts render `Album` badge.
- Item links still open Instagram permalinks.
- `layout_style = split` shows intro left and feed right on desktop.
- `layout_style = grid` keeps a single-column/centered intro layout.
- `desktop_display_mode = grid` uses `posts_per_row_desktop`.
- `desktop_display_mode = carousel` scrolls horizontally and respects arrows/snap/peek.
- Tablet width uses `posts_per_row_tablet`.
- `mobile_display_mode = grid` uses `posts_per_row_mobile`.
- `mobile_display_mode = carousel` scrolls horizontally and respects arrows/snap/peek.
- `card_radius`, `image_aspect_ratio`, colors, and section padding controls visibly apply.
- No old/native Instagram section behavior changes.
- No global JS changes.

## 15. Implementation Update: Split Containment And Typography Controls

Date: 2026-06-05

Files changed:

- `sections/instagram-feed.liquid`
- `THEME_INSTAGRAM_FEED_AUDIT.md`

Protected behavior preserved:

- Cloudflare Worker `proxyUrl` unchanged
- `access_token` behavior unchanged
- `ig_account_id` behavior unchanged
- `post_count` behavior unchanged
- fetch URL/query shape unchanged
- `VIDEO` / `CAROUSEL_ALBUM` media branching unchanged
- `media_url`, `thumbnail_url`, and `post.permalink` usage unchanged
- `id="instagram-grid"` preserved
- old/native Instagram sections untouched
- global JavaScript untouched

Controls added:

- `padding_x_desktop`
- `padding_x_tablet`
- `padding_x_mobile`
- `split_column_gap`
- `text_align_desktop`
- `text_align_mobile`
- `eyebrow_font_size`
- `eyebrow_font_weight`
- `eyebrow_letter_spacing`
- `title_font_size_desktop`
- `title_font_size_mobile`
- `title_font_weight`
- `title_line_height`
- `title_letter_spacing`
- `body_font_size`
- `body_line_height`
- `body_font_weight`
- `handle_font_size`
- `handle_font_weight`
- `handle_letter_spacing`
- `cta_font_size`
- `cta_font_weight`
- `cta_letter_spacing`
- `cta_uppercase`

CSS variables added:

- `--instagram-padding-x-desktop`
- `--instagram-padding-x-tablet`
- `--instagram-padding-x-mobile`
- `--instagram-split-gap`
- `--instagram-eyebrow-size`
- `--instagram-eyebrow-weight`
- `--instagram-eyebrow-letter-spacing`
- `--instagram-title-size-desktop`
- `--instagram-title-size-mobile`
- `--instagram-title-weight`
- `--instagram-title-line-height`
- `--instagram-title-letter-spacing`
- `--instagram-body-size`
- `--instagram-body-line-height`
- `--instagram-body-weight`
- `--instagram-handle-size`
- `--instagram-handle-weight`
- `--instagram-handle-letter-spacing`
- `--instagram-cta-size`
- `--instagram-cta-weight`
- `--instagram-cta-letter-spacing`
- `--instagram-cta-text-transform`
- `--instagram-text-align-desktop`
- `--instagram-text-align-mobile`

Split overflow fix:

- `.instagram-feed` now hides horizontal overflow at the section boundary.
- `.instagram-feed > .container` receives responsive side padding from the new padding controls.
- `.instagram-feed__inner` uses `--instagram-split-gap` instead of a hardcoded clamp gap.
- split mode uses `grid-template-columns: minmax(0, min(var(--instagram-intro-width), 520px)) minmax(0, 1fr)`.
- `.instagram-feed__intro` has `min-width: 0`, a real max-width, overflow wrapping, and hidden overflow on desktop to prevent text bleed.
- `.instagram-feed__media` has `min-width: 0`, `max-width: 100%`, and hidden overflow so grid/carousel content stays inside its column.
- title/body/handle/footer are capped at `max-width: 100%`.
- title uses `overflow-wrap: anywhere` to prevent long text from crossing into the media column.

Mobile alignment:

- desktop intro alignment is controlled by `text_align_desktop`.
- mobile intro and CTA alignment are controlled by `text_align_mobile`.
- mobile defaults to centered text.

Testing checklist:

- Section schema parses.
- All new range settings are Shopify-valid.
- Split desktop layout no longer lets title/body text overlap the feed.
- Media grid/carousel remains inside the right column.
- Side padding controls change left/right spacing on desktop, tablet, and mobile.
- Mobile center alignment centers eyebrow, title, body, handle, and CTA.
- Typography controls visibly affect eyebrow, title, body, handle, and CTA.
- Feed still loads real posts.
- Grid and carousel modes still work.
- No old/native Instagram sections changed.
- No global JavaScript changed.

## 17. Implementation Update: Grid Layout Repair

Date: 2026-06-05

Files changed:

- `sections/instagram-feed.liquid`
- `THEME_INSTAGRAM_FEED_AUDIT.md`

Protected behavior preserved:

- Cloudflare Worker `proxyUrl` unchanged
- `access_token`, `ig_account_id`, and `post_count` behavior unchanged
- fetch URL/query shape unchanged
- `VIDEO`, `CAROUSEL_ALBUM`, `media_url`, `thumbnail_url`, and `post.permalink` handling unchanged
- `id="instagram-grid"` preserved
- old/native Instagram sections untouched
- global JavaScript untouched

Cause of broken desktop grid:

- Grid mode was using CSS grid columns, but grid items were also constrained by `max-width: min(100%, var(--instagram-card-size-*))` and centered with `justify-self: center`.
- That made the actual card width smaller than the grid track width, so the visible spacing looked inconsistent and could create large black gaps.
- The split wrapper also used `align-items: center`, which vertically centered the media column beside a taller intro column and pushed the cards down the section.

Repair:

- `.instagram-feed__inner` now uses `align-items: start` so the intro and feed start together.
- Desktop grid mode now keeps card width controlled by grid tracks:
  - `.instagram-feed--desktop-grid .instagram-feed__grid`
  - `.instagram-feed--desktop-grid .instagram-feed__item`
- Mobile grid mode uses the same separation:
  - `.instagram-feed--mobile-grid .instagram-feed__grid`
  - `.instagram-feed--mobile-grid .instagram-feed__item`
- Grid items now use:
  - `width: 100%`
  - `max-width: none`
  - `justify-self: stretch`
- Grid gaps are explicit and equal:
  - `column-gap: var(--instagram-gap)`
  - `row-gap: var(--instagram-gap)`
- Carousel modes remain isolated to:
  - `.instagram-feed--desktop-carousel ...`
  - `.instagram-feed--mobile-carousel ...`

Card size behavior after repair:

- Grid mode: card width is controlled by posts-per-row and available media column width. `card_size_*` does not constrain grid card width.
- Carousel mode: `card_size_*` controls horizontal carousel item width.
- `image_aspect_ratio` still controls card shape in both modes.

Testing checklist:

- Desktop split + grid starts cards at the top of the media column.
- Desktop split + grid has equal row and column gaps.
- Desktop grid layout + grid has equal row and column gaps.
- Desktop split + carousel still scrolls cleanly.
- Desktop grid layout + carousel still scrolls cleanly.
- Mobile grid has equal gaps.
- Mobile carousel scrolls cleanly.
- No large empty black area appears above the cards.
- No page-level horizontal overflow.
- Feed still loads real posts.
- Reel/Album badges and Instagram permalinks still work.

## 18. Implementation Update: Simplified Grid/Split Model

Date: 2026-06-05

Files changed:

- `sections/instagram-feed.liquid`
- `THEME_INSTAGRAM_FEED_AUDIT.md`

Protected behavior preserved:

- Cloudflare Worker `proxyUrl` unchanged
- `access_token`, `ig_account_id`, and `post_count` behavior unchanged
- fetch URL/query shape unchanged
- `VIDEO`, `CAROUSEL_ALBUM`, `media_url`, `thumbnail_url`, and `post.permalink` handling unchanged
- `id="instagram-grid"` preserved
- old/native Instagram sections untouched
- global JavaScript untouched

Layout correction:

- `layout_style = grid` is now the stacked layout:
  - intro/text first
  - Instagram feed underneath
- `layout_style = split` is the only side-by-side desktop layout:
  - intro/text column
  - media column containing grid or carousel
- mobile remains stacked.

Grid/carousel behavior:

- Grid mode uses posts-per-row only for width:
  - desktop: `posts_per_row_desktop`
  - tablet: `posts_per_row_tablet`
  - mobile: `posts_per_row_mobile`
- Grid mode does not use `card_size_*` for card width.
- Carousel mode uses `card_size_desktop`, `card_size_tablet`, and `card_size_mobile` for item width.
- Carousel scroll/peek/snap styles stay scoped to carousel mode.
- Grid mode uses equal `row-gap` and `column-gap` from `--instagram-gap`.
- Carousel mode uses `--instagram-carousel-gap`.

Split controls:

- `split_column_gap` now supports `0px` minimum.
- New range:
  - min `0`
  - max `96`
  - step `4`
  - default `10`
- `intro_vertical_align` added with:
  - `top`
  - `center`
- split layout defaults to centered vertical alignment.

Text and width controls:

- `heading_width_desktop`
- `heading_width_mobile`
- `body_width_desktop`
- `body_width_mobile`
- desktop/mobile alignment classes now drive centering:
  - `.instagram-feed--text-desktop-left`
  - `.instagram-feed--text-desktop-center`
  - `.instagram-feed--text-mobile-left`
  - `.instagram-feed--text-mobile-center`

Body opacity fix:

- The previous body text opacity was removed.
- Body text now uses `text_color` at full opacity by default.

Eyebrow icon:

- Optional inline Instagram SVG can render beside eyebrow text.
- Controls added:
  - `show_eyebrow_icon`
  - `eyebrow_icon_style`
  - `eyebrow_icon_size`
  - `eyebrow_icon_gap`
  - `eyebrow_icon_color`
- Icon uses the same inline section markup; no external icon dependency was added.

CTA controls added:

- `cta_font_size_desktop`
- `cta_font_size_mobile`
- `cta_padding_x_desktop`
- `cta_padding_y_desktop`
- `cta_padding_x_mobile`
- `cta_padding_y_mobile`
- `cta_font_weight`
- `cta_letter_spacing`
- `cta_uppercase`
- `cta_text_color`
- `cta_border_color`
- `cta_background_color`
- `cta_hover_text_color`
- `cta_hover_background_color`
- `cta_radius`

Testing checklist:

- `layout_style = grid` renders intro above feed on desktop.
- `layout_style = split` renders side-by-side only on desktop.
- desktop grid display mode forms clean rows/columns.
- desktop carousel display mode uses card size.
- grid mode ignores card size for width and uses posts-per-row.
- split gap can be reduced to `0`.
- desktop center alignment centers eyebrow, title, body, handle, and CTA consistently.
- body text appears at full selected color opacity.
- eyebrow icon aligns beside eyebrow text.
- CTA color, padding, size, weight, radius, uppercase, and hover controls work.
- feed still loads real posts.
- Reel/Album badges and Instagram permalinks still work.

## 19. Implementation Update: Handle Display And Dual-Colour Title

Date: 2026-06-05

Files changed:

- `sections/instagram-feed.liquid`
- `THEME_INSTAGRAM_FEED_AUDIT.md`

Protected behavior preserved:

- Cloudflare Worker `proxyUrl` unchanged
- `access_token`, `ig_account_id`, and `post_count` behavior unchanged
- fetch URL/query shape unchanged
- `VIDEO`, `CAROUSEL_ALBUM`, `media_url`, `thumbnail_url`, and `post.permalink` handling unchanged
- `id="instagram-grid"` preserved
- old/native Instagram sections untouched
- global JavaScript untouched

Schema note:

- `split_column_gap` already had a valid `default` of `8` for `min: 0`, `max: 96`, `step: 4`.

Handle display separation:

- Existing `handle` remains the Instagram profile handle used by the follow CTA URL:
  - `https://instagram.com/{{ section.settings.handle }}`
- New visible handle controls:
  - `show_handle_text`
  - `handle_display_text`
- If `show_handle_text` is enabled, the section renders `handle_display_text`.
- If `handle_display_text` is blank, the visible fallback is `@` plus the existing `handle`.
- If `show_handle_text` is disabled, no standalone handle text renders.
- `cta_label` behavior is preserved.

Dual-colour title:

- New controls:
  - `title_dual_colour_enable`
  - `title_colour_1`
  - `title_colour_2`
  - `title_highlight_text`
- When enabled and `title_highlight_text` exactly matches part of the title, matching text is wrapped with:
  - `.instagram-feed__title-highlight`
- Normal title text uses `--instagram-title-color-1`.
- Highlight text uses `--instagram-title-color-2`.
- Merchant title and highlight text are escaped before output; merchants do not need to write HTML.
- If dual colour is disabled, the highlight text is blank, or no exact match exists, the title renders normally.

Testing checklist:

- Section schema parses.
- Existing `handle` still controls the follow CTA URL.
- `show_handle_text` hides and shows standalone handle text.
- `handle_display_text` changes only the visible handle text.
- Blank `handle_display_text` falls back to `@` plus `handle`.
- Dual-colour title applies only when enabled and exact highlight text matches.
- Title typography, alignment, and width controls still apply.
- Feed still loads real posts.
- Reel/Album badges and Instagram permalinks still work.

## 16. Implementation Update: Desktop Grid Fix And Card Size Controls

Date: 2026-06-05

Files changed:

- `sections/instagram-feed.liquid`
- `THEME_INSTAGRAM_FEED_AUDIT.md`

Protected behavior preserved:

- Cloudflare Worker `proxyUrl` unchanged
- `access_token`, `ig_account_id`, and `post_count` behavior unchanged
- fetch URL/query shape unchanged
- `VIDEO`, `CAROUSEL_ALBUM`, `media_url`, `thumbnail_url`, and `post.permalink` handling unchanged
- `id="instagram-grid"` preserved
- old/native Instagram sections untouched
- global JavaScript untouched
- `templates/index.json` untouched

Desktop grid mode fix:

- Grid and carousel display rules are now separated by state class.
- Grid layout rules apply through:
  - `.instagram-feed--desktop-grid .instagram-feed__grid`
  - `.instagram-feed--mobile-grid .instagram-feed__grid`
- Carousel layout rules remain scoped to:
  - `.instagram-feed--desktop-carousel .instagram-feed__grid`
  - `.instagram-feed--mobile-carousel .instagram-feed__grid`
- Carousel item width rules no longer apply to grid mode.
- Grid item sizing stays inside columns with `max-width: min(100%, var(--instagram-card-size-*))`.
- Media containment remains on `.instagram-feed__media` with `min-width: 0`, `max-width: 100%`, and hidden overflow.

Intro width change:

- `intro_width` range max increased from `45%` to `60%`.
- Split grid now uses:
  - `grid-template-columns: minmax(0, var(--instagram-intro-width)) minmax(0, 1fr)`
- The old 520px intro cap was removed so wider intro settings can take effect.
- Split layout stacks at the tablet/narrow desktop breakpoint before the two columns become cramped.

Card size controls added:

- `card_size_desktop`
- `card_size_tablet`
- `card_size_mobile`

CSS variables added:

- `--instagram-card-size-desktop`
- `--instagram-card-size-tablet`
- `--instagram-card-size-mobile`

How card size interacts with posts per row:

- In grid mode, posts-per-row remains the primary column control.
- Card size acts as a safe max width on each card and cannot force overflow because it is capped with `min(100%, var(--instagram-card-size-*))`.
- In carousel mode, card size drives the horizontal card width using responsive `flex-basis` values.
- The existing `image_aspect_ratio` setting still controls card shape in both grid and carousel modes.

Testing checklist:

- Section schema parses.
- `intro_width` max is `60`.
- Desktop split + grid renders posts as a contained grid.
- Desktop split + carousel scrolls cleanly.
- Desktop grid layout + grid renders posts as a contained grid.
- Mobile grid uses mobile posts-per-row.
- Mobile carousel uses mobile card size and scrolls cleanly.
- Large card sizes do not cause page-level horizontal overflow.
- Reel/Album badges still render.
- Instagram item links still use post permalinks.
- No old/native Instagram sections changed.
- No global JavaScript changed.
