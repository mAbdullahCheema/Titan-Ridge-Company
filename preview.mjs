/* Local preview server. Development only — do NOT upload this file.
 *
 *   node preview.mjs        then open http://localhost:4321
 *
 * The site cannot be opened by double-clicking index.html: every asset and
 * route is referenced from the site root (/assets/..., /expertise), which a
 * file:// URL resolves against the drive root instead. Serving over HTTP is
 * also what the live host does, so this is the accurate way to check a change.
 *
 * Unknown paths fall back to index.html, mirroring the ErrorDocument rule in
 * .htaccess, so a hard refresh on /division/civil works the same as it will
 * in production.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4321;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2"
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, urlPath);

    // Never serve anything above the site root.
    if (!file.startsWith(ROOT)) file = path.join(ROOT, "index.html");

    if (urlPath === "/" || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(ROOT, "index.html");
    }

    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log("Titan Ridge preview → http://localhost:" + PORT));
