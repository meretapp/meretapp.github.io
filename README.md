# meretapp.com

The landing page for **Meret**, a second brain for musical creativity on Android.

Plain static site, no build step, no dependencies. Meant to be served by GitHub Pages, the same
way `debenapp/debenapp.github.io` serves debenapp.com. Create a repo named
`meretapp/meretapp.github.io`, push this folder, and point the `meretapp.com` DNS at GitHub Pages.

## Structure

- `index.html` - the landing page. Brand tokens follow the app repo's `docs/design/design.html` and `ui/theme/Color.kt`.
- `about/`, `privacy/`, `security/`, `terms/` - the supporting pages, in a shared dark prose layout. Privacy follows the app repo's `docs/legal/PRIVACY_POLICY.md`.
- `assets/styles.css` - the stylesheet. One dark canvas, coral for action, violet for the idea.
- `assets/duma-bold.ttf` - the Duma Bold wordmark face, self hosted so the site makes no external requests.
- `assets/site.js` - one small progressive enhancement for the waitlist forms.
- `assets/mark.svg`, `assets/favicon.svg` - the coral tile mark, the white Duma m on the coral gradient.
- `assets/og-image.png` - the social share card, 1200x630. Its source is `assets/og.html`, rendered with the site's real wordmark component. To regenerate, serve the folder and run headless Chrome against `og.html` (see below), then downscale to 1200x630.
- `assets/og.html` - build source for the share card. Not linked from the site.
- `CNAME`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.nojekyll` - hosting and metadata.

## Contact addresses

Two inboxes on the `meretapp.com` domain, split by function. Make sure both exist before launch.

- `hello@meretapp.com` - the friendly, generic inbox. Used by the waitlist forms.
- `support@meretapp.com` - the formal inbox. Used by the privacy, security, and terms pages, including security vulnerability reports.

## Before it goes live

- To collect waitlist signups without opening the visitor's mail client, point each form `action`
  at your own form endpoint and drop the handler in `assets/site.js`. See the note at the top of that file.
- Confirm the `meretapp.com` domain, or change every absolute URL in `index.html`, `CNAME`,
  `robots.txt`, and `sitemap.xml` to the domain you use.
- Have the privacy and terms wording reviewed for your region before relying on it. The visible draft
  notice has been removed, so the pages now read as final.

## No external requests

System fonts plus one self hosted face. No web font CDN, no analytics, no trackers. The same
privacy promise the app makes.

## Local preview

Any static server works, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Regenerating the share image

With the folder served locally, render `assets/og.html` to a PNG and downscale to 1200x630:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,630 \
  --virtual-time-budget=2500 \
  --screenshot=assets/og-image@2x.png \
  http://localhost:8000/assets/og.html
sips -z 630 1200 assets/og-image@2x.png --out assets/og-image.png
rm assets/og-image@2x.png
```
