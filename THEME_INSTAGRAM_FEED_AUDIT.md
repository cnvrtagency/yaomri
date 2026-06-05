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
