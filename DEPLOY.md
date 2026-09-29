# Deploying the Titan Ridge website to Namecheap cPanel

The site is plain static files. There is no build step, no database, no Node or
PHP runtime — you upload the files and it runs.

Target domain: **titanridgeksa.com** (no `www`).

---

## 1. What to upload

Everything in this folder **except** these four, which are working files and
must stay off the server:

| Leave behind | Why |
| --- | --- |
| `brand-source/` | Logo masters and unused brand variants — 1.9 MB of files no page loads |
| `preview.mjs` | Local preview server, development only |
| `CLAUDE.md` | Internal notes |
| `DEPLOY.md` | This file |

Anything else that has landed in the folder — downloads, PDFs, `.crdownload`
files — is not part of the site either. Upload only the list below.

So the upload is:

```
.htaccess
index.html
favicon.ico
apple-touch-icon.png
robots.txt
sitemap.xml
site.webmanifest
assets/          (fonts, images, js)
```

Total: about 6 MB.

`.htaccess` is critical. Without it the home page works but `/expertise`,
`/gallery`, `/division/civil` and every other page returns a 404, and you get no
compression, caching, HTTPS redirect or security headers.

### Checking the site before you upload

Do not open `index.html` by double-clicking it. Every asset and link is
referenced from the site root (`/assets/…`, `/expertise`), and a `file://` URL
resolves those against your drive root, so the page appears as raw template
markup (`{{ n.label }}` and similar). Serve it over HTTP instead — the same way
the host will:

```
node preview.mjs
```

Then open <http://localhost:4321>.

---

## 2. Point the domain at Namecheap hosting

If the domain is registered with Namecheap and hosted on the same account this
is usually already done. Otherwise, in **Namecheap Dashboard → Domain List →
Manage → Nameservers**, set the nameservers your hosting welcome email lists
(typically `dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`).

DNS changes take anywhere from a few minutes to 24 hours to propagate.

---

## 3. Upload the files

### Option A — cPanel File Manager (no extra software)

1. Log in to cPanel (`https://titanridgeksa.com/cpanel`, or the direct server
   URL in your welcome email).
2. Open **Files → File Manager**.
3. Click **Settings** (top right) and tick **Show Hidden Files (dotfiles)**.
   Do this first — otherwise `.htaccess` stays invisible and you will think the
   upload failed.
4. Go into `public_html`.
5. Delete anything already there (`default.html`, `index.php`, a placeholder
   `cgi-bin`, etc.). Leave `cgi-bin` alone if you are unsure.
6. On your computer, select the files listed in step 1 and put them in a single
   ZIP archive. Make sure the files sit at the **top level** of the ZIP, not
   inside a wrapper folder.
7. In File Manager click **Upload**, drop the ZIP in, wait for 100%.
8. Back in `public_html`, right-click the ZIP → **Extract** → extract into
   `public_html`.
9. Delete the ZIP.
10. Confirm `index.html` and `.htaccess` are directly inside `public_html`, not
    inside a subfolder.

### Option B — FTP (better for repeat updates)

Create an FTP account in **cPanel → Files → FTP Accounts**, then connect with
FileZilla:

- Host: `ftp.titanridgeksa.com`
- Username / password: as created
- Port: `21`, encryption: **Require explicit FTP over TLS**

Upload into `/public_html`. In FileZilla, enable
**Server → Force showing hidden files** so `.htaccess` transfers.

### Option C — cPanel Git Version Control (Automated via GitHub)

The repository includes `.cpanel.yml` pre-configured to automatically deploy
production files (`index.html`, `.htaccess`, `assets/`, icons, etc.) to
`public_html/`.

1. In cPanel, navigate to **Files → Git Version Control**.
2. Click **Create** (top right).
3. Set **Clone URL**: `https://github.com/mAbdullahCheema/Titan-Ridge-Company.git`
4. Set **Repository Path**: `repositories/titan-ridge` (keep it outside `public_html`).
5. Set **Repository Name**: `titan-ridge`
6. Click **Create** and wait for cPanel to finish cloning.
7. Click **Manage** next to the cloned repository.
8. Go to the **Pull or Deploy** tab.
9. Click **Deploy Head**. cPanel executes `.cpanel.yml` and copies the live files directly to `public_html/`.

**For future updates**:
After pushing new commits to GitHub, open **Git Version Control → Manage → Pull or Deploy**, click **Update from Remote**, then click **Deploy Head**.

---

## 4. Turn on HTTPS

1. **cPanel → Security → SSL/TLS Status**.
2. Select the domain and click **Run AutoSSL**. Namecheap shared hosting issues
   a free certificate; it usually completes in a few minutes.
3. Once the certificate shows as valid, load `http://titanridgeksa.com` — it
   should redirect to `https://titanridgeksa.com`.

The `.htaccess` file forces HTTPS. **Do not enable it before the certificate
exists** or you will get a redirect to a broken-certificate warning. If you need
to upload before the cert is ready, comment out the three `RewriteCond`/
`RewriteRule` lines under "Force HTTPS" and restore them afterwards.

---

## 5. Check it worked

Open each of these. Every one should render its own page — not a 404, and not
the home page:

```
https://titanridgeksa.com/
https://titanridgeksa.com/expertise
https://titanridgeksa.com/gallery
https://titanridgeksa.com/contact
https://titanridgeksa.com/quote
https://titanridgeksa.com/privacy
https://titanridgeksa.com/terms
https://titanridgeksa.com/division/civil
https://titanridgeksa.com/division/solar
```

Then check these behave correctly:

- `https://www.titanridgeksa.com/` redirects to the non-`www` address.
- `https://titanridgeksa.com/does-not-exist` shows the designed 404 page.
- `https://titanridgeksa.com/robots.txt` and `/sitemap.xml` return plain text/XML.
- Reload a deep page such as `/division/solar` with F5 — it must still work.
  If it 404s, `.htaccess` did not upload.

---

## 6. Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console) and
   add the property `https://titanridgeksa.com`.
2. Verify by DNS TXT record (**Namecheap → Domain List → Manage → Advanced
   DNS**) or by uploading the HTML verification file to `public_html`.
3. Under **Sitemaps**, submit `sitemap.xml`.

All 17 pages have their own URL, title, description, canonical tag and Open
Graph tags, so each one can rank and share independently.

---

## 7. Making changes later

`index.html` is the whole site — markup, styling and behaviour. Everything the
site displays lives in the data arrays near the top of the `<script
type="text/x-dc">` block at the bottom of that file:

| To change | Edit |
| --- | --- |
| Phone, WhatsApp, SMS, email | The four constants at the top: `PHONE_DISPLAY`, `PHONE_E164`, `PHONE_WA`, `EMAIL` |
| Division names and scope lists | `DIVISIONS` |
| Division card summaries and counts | `DIVS` |
| Gallery photos and captions | `SHOTS` |
| Gallery filter buttons | `FILTERS` |
| FAQ entries | `FAQS` |
| Privacy policy text | `PRIVACY` |
| Terms text | `TERMS` |
| Page titles and meta descriptions | `ROUTE_META` |

If you **add or remove a page route**, three files must agree:

1. `index.html` — the `PAGE_ROUTES` array
2. `.htaccess` — the `RewriteRule` whitelist
3. `sitemap.xml` — the `<url>` entries

### Replacing an image

Asset filenames are not content-hashed, and `.htaccess` caches images for 30
days. If you overwrite `division-civil.jpg` in place, returning visitors keep
seeing the old one until their cache expires.

To publish an image change immediately, upload it under a **new filename** and
update the reference in `index.html`.

Each division photo exists in two sizes — `division-civil.jpg` (1400 px wide)
and `division-civil@sm.jpg` (760 px). Replace both, or the responsive `srcset`
will serve the old picture to small screens. Keep new photos under about
300 KB; the originals in this set were near 1 MB each and made the home page
17.6 MB.

---

## Notes and known limits

- **The phone number `+966 50 069 3067`** appears on every page, in the WhatsApp
  and SMS links, and in the structured data Google reads.
  It is defined in `index.html` — search for `PHONE_DISPLAY`.

- **The quote form does not send email.** It assembles the enquiry and hands it
  to the visitor's own mail app, WhatsApp or SMS. Nothing is stored on the
  server, which is why no PHP or database is needed — and it is what the privacy
  policy on the site describes. If you later want submissions delivered straight
  to an inbox, that needs a server-side form handler and a matching update to
  the privacy policy.

- **Pages are rendered in the browser.** Google and Bing execute JavaScript and
  will index every route. The `<noscript>` block in `index.html` gives crawlers
  and no-JavaScript visitors the company summary, contact details and links to
  all ten divisions as a fallback.

- **Content Security Policy.** `.htaccess` restricts scripts, styles, fonts,
  images and network calls to this domain. If you ever add Google Analytics, a
  chat widget or an embedded map, its domain must be added to the
  `Content-Security-Policy` header or the browser will block it silently.
