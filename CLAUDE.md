# Titan Ridge Company website

Production static site for **titanridgeksa.com** (no `www`). Deployment steps
are in `DEPLOY.md`.

## Layout

- **`index.html`** is the entire site — markup, styles and behaviour. Edit this
  file. It keeps the design-canvas structure: a `<x-dc>` template followed by a
  `<script type="text/x-dc">` block holding `class Component extends DCLogic`
  and all page data (`DIVISIONS`, `DIVS`, `SHOTS`, `FILTERS`, `FAQS`, `PRIVACY`,
  `TERMS`, `ROUTE_META`).
- `assets/js/dc-runtime.js` is the vendored design runtime, patched to load
  React 18.3.1 from `assets/js/` instead of unpkg. Nothing on the page reaches
  a third-party origin.
- `assets/js/lucide-icons.js` is a 51-icon subset of lucide 0.451.0 (11 KB,
  down from the 347 KB full set). **Adding a new `data-lucide="…"` name means
  regenerating this file** — the icon will simply not render otherwise.
  `createIcons()` draws each icon *inside* its `<i data-lucide>` host instead of
  replacing it, and returns early when the host already holds that icon. The
  host therefore stays under React's control (so `{{ navIcon }}` can switch
  between `menu` and `x`) and the repeat calls made on every re-render cost
  nothing.
- `brand-source/` holds logo masters and unused brand variants. Not part of the
  site; do not upload it.

## Routes

Real URLs via the History API, not hash fragments: `/`, `/expertise`,
`/gallery`, `/contact`, `/quote`, `/privacy`, `/terms`, `/division/<key>`.
Anything else renders the 404 page with `noindex`.

Legacy `#/route` links still resolve and are rewritten to the real path on load.

Every asset and route is referenced from the site root (`/assets/…`,
`/expertise`), so **the site must be served over HTTP** — double-clicking
`index.html` resolves those against the drive root and the page renders as its
raw, unhydrated template. Run `node preview.mjs` and open
<http://localhost:4321>. `preview.mjs` is development-only; it is not uploaded.
(The `HASH_MODE` branch in `index.html` was written for `file://` and is now
unreachable, since the runtime itself cannot load there.)

Adding or removing a route means updating three files together: `PAGE_ROUTES`
in `index.html`, the `RewriteRule` whitelist in `.htaccess`, and `sitemap.xml`.

Scroll and resize both re-render the whole page, so their listeners in
`componentDidMount` are coalesced — scroll through `requestAnimationFrame`,
resize only when the width actually changes. Mobile browsers fire resize on
every address-bar collapse; without the guard a single swipe queues hundreds
of renders.

## Images

Every photo ships in two widths — `name.jpg` (1400 px) and `name@sm.jpg`
(760 px) — wired through `srcset`. Replace both or small screens keep the old
picture. Budget under ~300 KB per photo.

Templated images (`src="{{ … }}"`) **must** carry `loading="lazy"`. The raw
`<x-dc>` template is live DOM before the runtime replaces it, so an eager
templated image makes the browser fetch the literal `{{ … }}` string.

## Design vocabulary

Figtree + IBM Plex Mono (+ IBM Plex Sans Arabic for Arabic), base `#0B0E13`,
alternating panel `#101419`, card gradient `#181D26 → #111620`, accent blue
`#2E7BD6 → #1256A6`, light accent `#8FC0F2`, hairline `rgba(255,255,255,.08)`,
pill/radius language: 999px pills, 28–30px cards, 16–22px chips.
