# Mobile Menu — Shopify Handoff (for Codex)

Build the mobile drawer menu in a Shopify Online Store 2.0 theme to match the React reference at `src/components/site/MobileMenu.tsx` (trigger button lives in `src/components/site/Header.tsx`). The data shape it mirrors is in `src/lib/nav.ts`.

This handoff is self-contained. Copy the code blocks verbatim, then wire the trigger snippet into your theme header. No build step required.

---

## 1. Behavior (read this first)

- Burger icon shown on `<lg` screens, top-left of the header. Tapping opens a **left-side drawer**.
- Drawer panel: `88%` of viewport width, capped at `384px`. Slides in from the left over a dark overlay.
- Drawer **header** (64px, bordered bottom):
  - Root view → shows the logo.
  - Drill view → shows a "← Back" button (extrabold italic uppercase).
- **Search** input (sand bg, 44px tall): visible **only at root**.
- **Root list**: each top-level menu item is a full-width row, 56px tall, `extrabold italic uppercase tracking-wider`, with a chevron-right if it has children, divided by bottom borders. A row labelled `SALE` is rendered in destructive red.
- **Drill view** (after tapping a parent item):
  1. A highlighted "Shop all {label}" row at the top (sand bg).
  2. One or more **column groups**: small eyebrow label + a vertical list of links (each row has a small chevron-right at the end).
  3. Optional **feature tiles**: 2-col grid, 4:5 image on sand bg, eyebrow + bold italic uppercase title.
- **Footer** (root only): Sign in / Wishlist / Shipping rows, then an Instagram strip on a sand background.
- Drill panel slides in from the right by 8px with a fade (200ms).
- ESC + overlay click + close button all close the drawer. Body scroll is locked while open.

---

## 2. Files to create

```
sections/mobile-menu.liquid
snippets/mobile-menu-trigger.liquid
assets/section-mobile-menu.css
assets/section-mobile-menu.js
```

Render the section once in `layout/theme.liquid` (so it's available on every page):

```liquid
{% section 'mobile-menu' %}
```

Drop the trigger snippet into your header where the burger should appear:

```liquid
{% render 'mobile-menu-trigger' %}
```

---

## 3. CSS tokens consumed

Make sure these CSS custom properties exist in your theme (most are already in `assets/section-hero-banner.css`). Sensible fallbacks are baked into the CSS below, so missing ones won't break the layout.

| Token | Default | Notes |
|---|---|---|
| `--color-background` | `#ffffff` | Panel bg |
| `--color-foreground` | `#0a0a0a` | Text |
| `--color-foreground-secondary` | `#6b6b6b` | Eyebrows / muted |
| `--color-border` | `#e7e5e0` | Dividers |
| `--color-secondary` | `#f4f2ee` | Search bg, row hover |
| `--color-sand` | `#efeae1` | Feature image bg, IG strip |
| `--color-destructive` | `#b91c1c` | SALE row |

Font: the reference uses Inter; weights 800 italic for headings/rows. Theme should already load it.

---

## 4. `sections/mobile-menu.liquid`

```liquid
<link rel="stylesheet" href="{{ 'section-mobile-menu.css' | asset_url }}">
<script src="{{ 'section-mobile-menu.js' | asset_url }}" defer></script>

{%- liquid
  assign show_search = section.settings.show_search
  assign search_placeholder = section.settings.search_placeholder | default: 'Search'
  assign country_label = section.settings.country_label | default: 'United Arab Emirates · AED'
  assign ig_url = section.settings.instagram_url
  assign ig_handle = section.settings.instagram_handle | default: '@yaomri'
-%}

<div id="mobile-menu" class="mm" hidden aria-hidden="true">
  <div class="mm__overlay" data-mm-close></div>

  <aside class="mm__panel" role="dialog" aria-modal="true" aria-label="Main menu">
    <header class="mm__header">
      <div class="mm__header-root" data-mm-header-root>
        {%- if section.settings.logo != blank -%}
          <a href="{{ routes.root_url }}" class="mm__logo">
            <img src="{{ section.settings.logo | image_url: width: 200 }}"
                 alt="{{ shop.name }}" width="200" height="40" loading="eager">
          </a>
        {%- else -%}
          <a href="{{ routes.root_url }}" class="mm__logo mm__logo--text">{{ shop.name }}</a>
        {%- endif -%}
        <button type="button" class="mm__close" data-mm-close aria-label="Close menu">
          {%- render 'mm-icon', name: 'x' -%}
        </button>
      </div>
      <button type="button" class="mm__back" data-mm-back hidden>
        {%- render 'mm-icon', name: 'chevron-left' -%} Back
      </button>
    </header>

    {%- if show_search -%}
      <div class="mm__search" data-mm-search>
        <form action="{{ routes.search_url }}" method="get" role="search">
          {%- render 'mm-icon', name: 'search' -%}
          <input type="search" name="q" placeholder="{{ search_placeholder }}" aria-label="Search">
        </form>
      </div>
    {%- endif -%}

    <div class="mm__body">
      {%- comment -%} Root list {%- endcomment -%}
      <ul class="mm__root" data-mm-root>
        {%- for block in section.blocks -%}
          {%- case block.type -%}
            {%- when 'link_group' -%}
              <li class="mm__row-wrap">
                <button type="button" class="mm__row {% if block.settings.is_sale %}mm__row--sale{% endif %}"
                        data-drill-to="{{ block.id }}">
                  <span>{{ block.settings.label }}</span>
                  {%- render 'mm-icon', name: 'chevron-right' -%}
                </button>
              </li>
            {%- when 'simple_link' -%}
              <li class="mm__row-wrap">
                <a href="{{ block.settings.url }}"
                   class="mm__row {% if block.settings.is_sale %}mm__row--sale{% endif %}">
                  <span>{{ block.settings.label }}</span>
                </a>
              </li>
          {%- endcase -%}
        {%- endfor -%}
      </ul>

      {%- comment -%} Drill panels (one per link_group) {%- endcomment -%}
      {%- for block in section.blocks -%}
        {%- if block.type == 'link_group' -%}
          <div class="mm__drill" data-drill="{{ block.id }}" data-label="{{ block.settings.label | escape }}" hidden>
            <a href="{{ block.settings.url | default: '#' }}" class="mm__drill-all">
              Shop all {{ block.settings.label | downcase }}
            </a>

            {%- if block.settings.link_list != blank -%}
              {%- assign linklist = linklists[block.settings.link_list] -%}
              <div class="mm__group">
                {%- if block.settings.eyebrow != blank -%}
                  <p class="mm__eyebrow">{{ block.settings.eyebrow }}</p>
                {%- endif -%}
                <ul class="mm__sublist">
                  {%- for link in linklist.links -%}
                    <li>
                      <a href="{{ link.url }}" class="mm__sublink">
                        <span>{{ link.title }}</span>
                        {%- render 'mm-icon', name: 'chevron-right-sm' -%}
                      </a>
                    </li>
                  {%- endfor -%}
                </ul>
              </div>
            {%- endif -%}

            {%- comment -%} Feature tiles tagged with this block's id {%- endcomment -%}
            {%- assign tiles = '' | split: '' -%}
            {%- for b in section.blocks -%}
              {%- if b.type == 'feature_tile' and b.settings.parent_block_id == block.id -%}
                {%- assign tiles = tiles | concat: b -%}
              {%- endif -%}
            {%- endfor -%}

            {%- if tiles.size > 0 -%}
              <div class="mm__features">
                {%- for tile in tiles -%}
                  <a href="{{ tile.settings.url | default: '#' }}" class="mm__feature">
                    <div class="mm__feature-img">
                      {%- if tile.settings.image != blank -%}
                        <img src="{{ tile.settings.image | image_url: width: 600 }}"
                             alt="{{ tile.settings.title | escape }}" loading="lazy">
                      {%- endif -%}
                    </div>
                    {%- if tile.settings.eyebrow != blank -%}
                      <p class="mm__eyebrow">{{ tile.settings.eyebrow }}</p>
                    {%- endif -%}
                    <p class="mm__feature-title">{{ tile.settings.title }}</p>
                  </a>
                {%- endfor -%}
              </div>
            {%- endif -%}
          </div>
        {%- endif -%}
      {%- endfor -%}
    </div>

    <footer class="mm__footer" data-mm-footer>
      <ul class="mm__util">
        <li><a href="{{ routes.account_login_url }}">{%- render 'mm-icon', name: 'user' -%} Sign in / Register</a></li>
        <li><a href="/pages/wishlist">{%- render 'mm-icon', name: 'heart' -%} Wishlist</a></li>
        <li>
          <a href="#" class="mm__util-row">
            <span>{%- render 'mm-icon', name: 'pin' -%} Shipping to</span>
            <span class="mm__country">{{ country_label }}</span>
          </a>
        </li>
      </ul>
      {%- if ig_url != blank -%}
        <div class="mm__ig">
          <span>Follow {{ ig_handle }}</span>
          <a href="{{ ig_url }}" target="_blank" rel="noopener" aria-label="Instagram">
            {%- render 'mm-icon', name: 'instagram' -%}
          </a>
        </div>
      {%- endif -%}
    </footer>
  </aside>
</div>

{% schema %}
{
  "name": "Mobile menu",
  "tag": "section",
  "class": "mm-section",
  "settings": [
    { "type": "image_picker", "id": "logo", "label": "Logo" },
    { "type": "checkbox", "id": "show_search", "label": "Show search", "default": true },
    { "type": "text", "id": "search_placeholder", "label": "Search placeholder", "default": "Search" },
    { "type": "text", "id": "country_label", "label": "Shipping country label", "default": "United Arab Emirates · AED" },
    { "type": "url", "id": "instagram_url", "label": "Instagram URL" },
    { "type": "text", "id": "instagram_handle", "label": "Instagram handle", "default": "@yaomri" }
  ],
  "blocks": [
    {
      "type": "link_group",
      "name": "Link group (drillable)",
      "limit": 8,
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "WOMEN" },
        { "type": "url", "id": "url", "label": "'Shop all' URL" },
        { "type": "link_list", "id": "link_list", "label": "Menu (link list)" },
        { "type": "text", "id": "eyebrow", "label": "Eyebrow above sublinks", "default": "Featured" },
        { "type": "checkbox", "id": "is_sale", "label": "Style as SALE (red)", "default": false }
      ]
    },
    {
      "type": "simple_link",
      "name": "Simple link",
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "BEST SELLERS" },
        { "type": "url", "id": "url", "label": "URL" },
        { "type": "checkbox", "id": "is_sale", "label": "Style as SALE (red)", "default": false }
      ]
    },
    {
      "type": "feature_tile",
      "name": "Feature tile",
      "settings": [
        { "type": "text", "id": "parent_block_id", "label": "Parent link_group block ID", "info": "Paste the block ID of the link_group this tile belongs to." },
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "New Collection" },
        { "type": "text", "id": "title", "label": "Title", "default": "Solara — Summer '26" },
        { "type": "url", "id": "url", "label": "URL" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Mobile menu",
      "blocks": [
        { "type": "link_group", "settings": { "label": "WOMEN" } },
        { "type": "link_group", "settings": { "label": "NEW IN" } },
        { "type": "link_group", "settings": { "label": "SWIMWEAR" } },
        { "type": "link_group", "settings": { "label": "RESORTWEAR" } },
        { "type": "simple_link", "settings": { "label": "BEST SELLERS" } },
        { "type": "simple_link", "settings": { "label": "LOOKBOOK" } },
        { "type": "simple_link", "settings": { "label": "SALE", "is_sale": true } }
      ]
    }
  ]
}
{% endschema %}
```

> **Note on `parent_block_id`**: Shopify doesn't let one block reference another via a picker, so we use a text field. Merchants copy the link_group's block ID from the section editor URL or use the small "block id" label shown in dev tools. If you'd rather hard-wire feature tiles, replace this with `select` settings (one per group).

---

## 5. `snippets/mobile-menu-trigger.liquid`

```liquid
<button type="button" class="mm-trigger" data-mm-open
        aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu">
  {%- render 'mm-icon', name: 'menu' -%}
</button>

<style>
  .mm-trigger { display:inline-flex; align-items:center; justify-content:center;
    width:40px; height:40px; margin-left:-8px; background:none; border:0; cursor:pointer; color:var(--color-foreground, #0a0a0a); }
  .mm-trigger svg { width:20px; height:20px; }
  @media (min-width: 1024px) { .mm-trigger { display:none; } }
</style>
```

---

## 6. `snippets/mm-icon.liquid` (inline SVGs)

Create one snippet that renders any icon by name — avoids depending on Dawn.

```liquid
{%- case name -%}
  {%- when 'menu' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  {%- when 'x' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
  {%- when 'search' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
  {%- when 'chevron-right' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
  {%- when 'chevron-right-sm' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="14" height="14"><path d="M9 6l6 6-6 6"/></svg>
  {%- when 'chevron-left' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
  {%- when 'user' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
  {%- when 'heart' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.8 6.6a5 5 0 0 0-8.8-1.5 5 5 0 0 0-8.8 1.5c-1 3 .5 6 3 8.4l5.8 5 5.8-5c2.5-2.4 4-5.4 3-8.4z"/></svg>
  {%- when 'pin' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
  {%- when 'instagram' -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
{%- endcase -%}
```

---

## 7. `assets/section-mobile-menu.css`

```css
/* ---------- Mobile menu ---------- */
.mm {
  position: fixed; inset: 0; z-index: 60;
  display: block;
}
.mm[hidden] { display: none; }

.mm__overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.4);
  opacity: 0; transition: opacity .25s ease;
}
.mm[data-open="true"] .mm__overlay { opacity: 1; }

.mm__panel {
  position: absolute; top: 0; left: 0;
  width: 88%; max-width: 384px; height: 100%;
  background: var(--color-background, #fff);
  border-right: 1px solid var(--color-border, #e7e5e0);
  display: flex; flex-direction: column;
  transform: translateX(-100%);
  transition: transform .3s ease;
  will-change: transform;
}
.mm[data-open="true"] .mm__panel { transform: translateX(0); }

/* Header */
.mm__header {
  height: 64px; padding: 0 16px;
  border-bottom: 1px solid var(--color-border, #e7e5e0);
  display: flex; align-items: center;
  flex: 0 0 auto;
}
.mm__header-root { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.mm__logo img { height: 36px; width: auto; display: block; }
.mm__logo--text { font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .05em; font-size: 16px; color: var(--color-foreground, #0a0a0a); text-decoration: none; }
.mm__close { background: none; border: 0; padding: 8px; cursor: pointer; color: var(--color-foreground, #0a0a0a); display: inline-flex; }
.mm__close svg { width: 20px; height: 20px; }

.mm__back {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: 0; padding: 4px 0; cursor: pointer;
  font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .05em;
  font-size: 12px; color: var(--color-foreground, #0a0a0a);
}
.mm__back svg { width: 16px; height: 16px; }

/* Search */
.mm__search { padding: 16px; border-bottom: 1px solid var(--color-border, #e7e5e0); flex: 0 0 auto; }
.mm__search form { display: flex; align-items: center; height: 44px; padding: 0 12px;
  background: var(--color-secondary, #f4f2ee); }
.mm__search svg { width: 16px; height: 16px; color: var(--color-foreground-secondary, #6b6b6b); flex: 0 0 auto; }
.mm__search input { flex: 1; background: transparent; border: 0; outline: none; padding: 0 8px; font-size: 14px;
  color: var(--color-foreground, #0a0a0a); }
.mm__search input::placeholder { color: var(--color-foreground-secondary, #6b6b6b); }

/* Body */
.mm__body { flex: 1 1 auto; overflow-y: auto; -webkit-overflow-scrolling: touch; position: relative; }

/* Root rows */
.mm__root { list-style: none; margin: 0; padding: 0; }
.mm__row {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  background: transparent; border: 0; border-bottom: 1px solid var(--color-border, #e7e5e0);
  font-size: 14px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .05em;
  color: var(--color-foreground, #0a0a0a); text-decoration: none; cursor: pointer;
  text-align: left;
}
.mm__row:hover { background: var(--color-secondary, #f4f2ee); }
.mm__row svg { width: 16px; height: 16px; color: var(--color-foreground-secondary, #6b6b6b); }
.mm__row--sale { color: var(--color-destructive, #b91c1c); }

/* Drill panel */
.mm__drill {
  position: absolute; inset: 0;
  background: var(--color-background, #fff);
  overflow-y: auto;
  animation: mm-slide-in .2s ease both;
}
@keyframes mm-slide-in {
  from { transform: translateX(8px); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}

.mm__drill-all {
  display: block; padding: 16px 20px;
  background: color-mix(in oklab, var(--color-sand, #efeae1) 60%, transparent);
  border-bottom: 1px solid var(--color-border, #e7e5e0);
  font-size: 14px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .05em;
  color: var(--color-foreground, #0a0a0a); text-decoration: none;
}
.mm__drill-all:hover { background: var(--color-sand, #efeae1); }

.mm__group { border-bottom: 1px solid var(--color-border, #e7e5e0); padding-bottom: 12px; }
.mm__eyebrow {
  margin: 0; padding: 20px 20px 8px;
  font-size: 11px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--color-foreground-secondary, #6b6b6b);
}
.mm__sublist { list-style: none; margin: 0; padding: 0; }
.mm__sublink {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 20px; font-size: 14px; color: var(--color-foreground, #0a0a0a); text-decoration: none;
}
.mm__sublink:hover { background: var(--color-secondary, #f4f2ee); }

.mm__features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 20px; }
.mm__feature { display: block; text-decoration: none; color: inherit; }
.mm__feature-img { aspect-ratio: 4/5; background: var(--color-sand, #efeae1); overflow: hidden; }
.mm__feature-img img { width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .5s ease; }
.mm__feature:hover .mm__feature-img img { transform: scale(1.04); }
.mm__feature-title { margin: 4px 0 0; font-size: 12px; font-weight: 800; font-style: italic;
  text-transform: uppercase; letter-spacing: .03em; line-height: 1.2; }
.mm__feature .mm__eyebrow { padding: 12px 0 0; }

/* Footer */
.mm__footer { flex: 0 0 auto; border-top: 1px solid var(--color-border, #e7e5e0); }
.mm__util { list-style: none; margin: 0; padding: 0; }
.mm__util li + li { border-top: 1px solid var(--color-border, #e7e5e0); }
.mm__util a {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; font-size: 14px; color: var(--color-foreground, #0a0a0a); text-decoration: none;
}
.mm__util a:hover { background: var(--color-secondary, #f4f2ee); }
.mm__util svg { width: 16px; height: 16px; }
.mm__util-row { justify-content: space-between !important; }
.mm__country { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; font-weight: 600;
  color: var(--color-foreground-secondary, #6b6b6b); }

.mm__ig {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; background: color-mix(in oklab, var(--color-sand, #efeae1) 60%, transparent);
  font-size: 11px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--color-foreground-secondary, #6b6b6b);
}
.mm__ig a { color: var(--color-foreground-secondary, #6b6b6b); padding: 6px; }
.mm__ig a:hover { color: var(--color-foreground, #0a0a0a); }
.mm__ig svg { width: 16px; height: 16px; }

/* Body scroll lock when open */
html.mm-open, html.mm-open body { overflow: hidden; }

/* Focus */
.mm :focus-visible { outline: 2px solid var(--color-foreground, #0a0a0a); outline-offset: -2px; }

/* Desktop: hide drawer entirely */
@media (min-width: 1024px) {
  .mm { display: none !important; }
}
```

---

## 8. `assets/section-mobile-menu.js`

```js
(function () {
  const root = document.getElementById('mobile-menu');
  if (!root) return;

  const panel    = root.querySelector('.mm__panel');
  const headerR  = root.querySelector('[data-mm-header-root]');
  const backBtn  = root.querySelector('[data-mm-back]');
  const searchEl = root.querySelector('[data-mm-search]');
  const footerEl = root.querySelector('[data-mm-footer]');
  const rootList = root.querySelector('[data-mm-root]');
  const drills   = root.querySelectorAll('[data-drill]');

  const open = () => {
    root.hidden = false;
    requestAnimationFrame(() => root.setAttribute('data-open', 'true'));
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('mm-open');
    document.querySelectorAll('[data-mm-open]').forEach(b => b.setAttribute('aria-expanded', 'true'));
    setTimeout(() => root.querySelector('.mm__close')?.focus(), 50);
  };

  const close = () => {
    root.removeAttribute('data-open');
    root.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('mm-open');
    document.querySelectorAll('[data-mm-open]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    setTimeout(() => { root.hidden = true; resetDrill(); }, 300);
  };

  const drillIn = (id) => {
    const target = root.querySelector(`[data-drill="${CSS.escape(id)}"]`);
    if (!target) return;
    rootList.hidden = true;
    if (searchEl) searchEl.hidden = true;
    if (footerEl) footerEl.hidden = true;
    drills.forEach(d => d.hidden = true);
    target.hidden = false;
    headerR.hidden = true;
    backBtn.hidden = false;
    root.querySelector('.mm__body').scrollTop = 0;
  };

  const resetDrill = () => {
    rootList.hidden = false;
    if (searchEl) searchEl.hidden = false;
    if (footerEl) footerEl.hidden = false;
    drills.forEach(d => d.hidden = true);
    headerR.hidden = false;
    backBtn.hidden = true;
  };

  document.addEventListener('click', (e) => {
    const openBtn  = e.target.closest('[data-mm-open]');
    const closeBtn = e.target.closest('[data-mm-close]');
    const drillBtn = e.target.closest('[data-drill-to]');
    const back     = e.target.closest('[data-mm-back]');
    if (openBtn)  { e.preventDefault(); open(); }
    if (closeBtn) { e.preventDefault(); close(); }
    if (drillBtn) { e.preventDefault(); drillIn(drillBtn.dataset.drillTo); }
    if (back)     { e.preventDefault(); resetDrill(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.getAttribute('data-open') === 'true') close();
  });

  // Simple focus trap
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = panel.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
    const visible = Array.from(focusables).filter(el => el.offsetParent !== null);
    if (!visible.length) return;
    const first = visible[0], last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Theme editor re-init
  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.querySelector('#mobile-menu')) location.reload();
  });
})();
```

---

## 9. Wiring in the header

In your header section (e.g. `sections/header.liquid`) add the trigger button on the far left, before the logo:

```liquid
<div class="header__inner">
  {% render 'mobile-menu-trigger' %}
  <a href="{{ routes.root_url }}" class="header__logo">…</a>
  …
</div>
```

The drawer itself is rendered once globally from `layout/theme.liquid`:

```liquid
<body>
  {% section 'header' %}
  {% section 'mobile-menu' %}
  …
</body>
```

---

## 10. Mapping from React reference

| React (`src/lib/nav.ts` / `MobileMenu.tsx`) | Shopify equivalent |
|---|---|
| `nav[]` array | Section `blocks[]` (link_group + simple_link) |
| `MegaColumn.links` | A Shopify **Link list** (Navigation > Menus), assigned to the `link_list` setting on the group block |
| `MegaFeature` (image + label + title) | `feature_tile` block referencing the parent group's block id |
| `isSale` (red `SALE`) | `is_sale` checkbox |
| `setDrillLabel` state | `data-drill-to="{block.id}"` + JS toggling panels |
| `Sheet` (vaul) animation | CSS `transform: translateX` + overlay opacity |

---

## 11. QA checklist

- [ ] Trigger only visible below `1024px`.
- [ ] Drawer opens from the left, overlay fades in, body scroll locked.
- [ ] ESC, overlay click, and × button all close it.
- [ ] Search bar only shows on root view; hidden in drill view.
- [ ] Tapping a `link_group` row reveals the correct drill panel and "Back" appears.
- [ ] "Back" returns to root with search + footer visible again.
- [ ] `SALE` row renders red.
- [ ] Feature tiles render in a 2-col grid with 4:5 images; only those whose `parent_block_id` matches the active group.
- [ ] Footer shows Sign in / Wishlist / Shipping rows + IG strip on sand.
- [ ] No horizontal scroll on `<body>` at 320 / 375 / 414 widths.
- [ ] Works inside Shopify theme editor (changing settings triggers a reload).
- [ ] Lighthouse a11y ≥ 95 on the homepage.

---

## 12. Out of scope (leave hooks)

- Country / currency picker logic — currently a static label. Wire up to `localization` form when ready.
- Account state (Sign in vs. account name) — replace `{{ routes.account_login_url }}` with a `{% if customer %}` branch when needed.
- Predictive search results — the form posts to `routes.search_url`; add predictive search separately.

---

That's it — paste the four files, drop `{% render 'mobile-menu-trigger' %}` into the header, add `{% section 'mobile-menu' %}` to `theme.liquid`, and the drawer is live.
