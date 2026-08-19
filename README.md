# meretapp.com

The landing page for **Meret**, a second brain for musical creativity on Android.

Plain static site, no build step, no dependencies. Meant to be served by GitHub Pages, the same
way `debenapp/debenapp.github.io` serves debenapp.com. Create a repo named
`meretapp/meretapp.github.io`, push this folder, and point the `meretapp.com` DNS at GitHub Pages.

## Structure

- `index.html` - the landing page. Brand tokens follow the app repo's `docs/design/design.html` and `ui/theme/Color.kt`.
- `assets/styles.css` - the stylesheet. One dark canvas, coral for action, violet for the idea.
- `assets/duma-bold.ttf` - the Duma Bold wordmark face, self hosted so the site makes no external requests.
- `assets/site.js` - one small progressive enhancement for the waitlist forms.
- `assets/mark.svg`, `assets/favicon.svg` - the coral tile mark, the white Duma m on the coral gradient.
- `assets/og-image.svg` - the social share card. Rasterise to `og-image.png` (1200x630) if a platform refuses SVG previews, and update the `og:image` URLs.
- `CNAME`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.nojekyll` - hosting and metadata.

## Before it goes live

- The waitlist forms post to `hello@meretapp.com`, a placeholder. To collect signups without opening
  the visitor's mail client, point each form `action` at your own form endpoint and drop the handler
  in `assets/site.js`. See the note at the top of that file.
- Confirm the `meretapp.com` domain, or change every absolute URL in `index.html`, `CNAME`,
  `robots.txt`, and `sitemap.xml` to the domain you use.

## No external requests

System fonts plus one self hosted face. No web font CDN, no analytics, no trackers. The same
privacy promise the app makes.

## Local preview

Any static server works, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.
