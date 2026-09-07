# Titan Ridge Company Website

Production website for **Titan Ridge Company** (`titanridgeksa.com`), delivering general contracting, civil works, mechanical and piping, electrical and cable, solar EPC support, material supply, manpower, and equipment across the Kingdom of Saudi Arabia.

## Tech Stack & Architecture

- **Single-File Pure Static App**: Zero external build steps, no Node/PHP server runtime required.
- **Client-Side SPA Engine**: Custom design-canvas runtime loaded from `assets/js/dc-runtime.js` paired with React 18.3.1.
- **Iconography**: Vendored Lucide icon subset in `assets/js/lucide-icons.js`.
- **Styling & Typography**: Vanilla CSS embedded in `index.html` using Figtree and IBM Plex Mono fonts.
- **High-Performance Images**: Dual-resolution responsive web images (`.jpg` 1400w and `@sm.jpg` 760w) with lazy loading.

## Local Development

To run the local preview server:

```bash
node preview.mjs
```

Or using npm:

```bash
npm start
```

Then visit: [http://localhost:4321](http://localhost:4321)

## Deployment on Vercel

The repository includes a pre-configured `vercel.json` for immediate deployment:
- Single-page application rewrites (`/(.*) -> /index.html`) for clean direct route navigation (`/expertise`, `/gallery`, `/division/:key`, `/contact`, `/quote`).
- Automatic clean URLs without `.html` extensions or trailing slashes.
- Static asset caching headers (`max-age=2592000, immutable`).
- Comprehensive security headers (`CSP`, `X-Frame-Options`, `X-Content-Type-Options`).

To deploy:
1. Import this repository in [Vercel](https://vercel.com).
2. Framework Preset: **Other**.
3. Build & Output Settings: Default (leave empty).
4. Click **Deploy**.
