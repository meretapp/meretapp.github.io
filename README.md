# meret.app

The landing page for **Meret**, a second brain for musical creativity on Android.

Plain static site, no build step, no dependencies. Meant to be served by GitHub Pages, the same
way `debenapp/debenapp.github.io` serves debenapp.com. Create a repo named
`meretapp/meretapp.github.io`, push this folder, and point the `meret.app` DNS at GitHub Pages.

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

## Waitlist

The waitlist forms POST to Buttondown (`https://buttondown.com/api/emails/embed-subscribe/meret`),
which runs double opt-in: a signup triggers a confirmation email, and the person joins the list only
after they click it. The forms use a real form submission the browser follows, targeting a hidden
iframe (`name="bd-sink"` near the end of `index.html`), so the response loads invisibly and the visitor
never leaves the page. `assets/site.js` only shows the inline "check your email to confirm" message; it
does not use `fetch`, because the embed endpoint cannot hand a subscriber off from a background request.
Trade-off: if Buttondown ever requires a CAPTCHA for a submission it cannot show in a hidden iframe, so
that one signup would not complete; double opt-in already deters spam, so this is rare. With JavaScript
off the form still submits natively into the iframe. To change the account, update the `action` on both
forms in `index.html`.

## Contact addresses

Two inboxes on the `meret.app` domain, split by function. Make sure both exist before launch.

- `hello@meret.app` - the friendly, generic inbox. Named on the pages for general contact.
- `support@meret.app` - the formal inbox. Used by the privacy, security, and terms pages, including security vulnerability reports.

## Domains

`meret.app` is the primary, canonical domain for the site and email. `meretapp.com` is owned too
and should 301-redirect to `https://meret.app` at the registrar or via Cloudflare, so it never
competes for SEO and cannot be squatted. GitHub Pages serves one custom domain (the `CNAME`,
`meret.app`), so the `.com` redirect is set up at the DNS/registrar level, not in this repo. Note
that `.app` is HSTS-preloaded, so the site must be reachable over HTTPS before the domain is shared.

## Before it goes live

- Point `meret.app` DNS at GitHub Pages (four A records to 185.199.108-111.153, `www` CNAME to
  `meretapp.github.io`), set the custom domain in repo Settings and enforce HTTPS once the cert issues.
- Set up `meret.app` email (forwarding is enough to receive `hello@` and `support@`).
- If you ever change the canonical domain, update every absolute URL in `index.html`, `CNAME`,
  `robots.txt`, and `sitemap.xml`.
- Have the privacy and terms wording reviewed for your region before relying on it. The visible draft
  notice has been removed, so the pages now read as final.

## Requests and privacy

The page itself loads with no external requests: system fonts plus one self hosted face, no web font
CDN, no analytics, no trackers, no cookies. The only outbound request is the one the visitor triggers
by submitting the waitlist form, which goes to Buttondown to record their signup.

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
