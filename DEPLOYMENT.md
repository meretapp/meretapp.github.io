# Deployment and operations

Maintainer notes for the meret.app site. None of this is needed to browse the site or run it locally, see the README for that.

## Hosting

The site is served by GitHub Pages from this repository (`meretapp/meretapp.github.io`) on the custom domain in `CNAME`, which is `meret.app`. GitHub Pages serves one custom domain, so any other domain redirect is set at the DNS or registrar level, not in this repo.

## Going live checklist

- Point `meret.app` DNS at GitHub Pages: four A records to 185.199.108.153 through 185.199.111.153, and a `www` CNAME to `meretapp.github.io`.
- Set the custom domain in repo Settings and enforce HTTPS once the certificate issues. `.app` is HSTS preloaded, so the site must be reachable over HTTPS before the domain is shared.
- Set up `meret.app` email. Forwarding is enough to receive `hello@` and `support@`.
- Have the privacy and terms wording reviewed for your region before relying on it.

## Domains

`meret.app` is the primary, canonical domain for the site and email. `meretapp.com` is owned too and should 301 redirect to `https://meret.app` at the registrar or via Cloudflare, so it never competes for SEO and cannot be squatted.

If the canonical domain ever changes, update every absolute URL in `index.html`, `CNAME`, `robots.txt`, and `sitemap.xml`.

## Contact inboxes

Two inboxes on the `meret.app` domain, split by function. Both must exist before launch.

- `hello@meret.app` - the friendly, generic inbox, named on the pages for general contact.
- `support@meret.app` - the formal inbox, used by the privacy, security, and terms pages, including security vulnerability reports.

## Waitlist

The waitlist forms POST to Buttondown (`https://buttondown.com/api/emails/embed-subscribe/meret`), which runs double opt-in: a signup triggers a confirmation email, and the person joins the list only after they click it.

The forms use a real form submission the browser follows, targeting a hidden iframe (`name="bd-sink"` near the end of `index.html`), so the response loads invisibly and the visitor never leaves the page. `assets/site.js` only shows the inline "check your email to confirm" message. It does not use `fetch`, because the embed endpoint cannot hand a subscriber off from a background request.

Trade-off: if Buttondown ever requires a CAPTCHA for a submission it cannot show in a hidden iframe, that one signup would not complete. Double opt-in already deters spam, so this is rare. With JavaScript off, the form still submits natively into the iframe. To change the account, update the `action` on both forms in `index.html`.

## File structure

- `index.html` - the landing page. Brand tokens follow the app repo's `docs/design/design.html` and `ui/theme/Color.kt`.
- `about/`, `privacy/`, `security/`, `terms/` - the supporting pages. Privacy follows the app repo's `docs/legal/PRIVACY_POLICY.md`.
- `assets/styles.css` - the stylesheet. One dark canvas, coral for action, violet for the idea.
- `assets/duma-bold.ttf` - the Duma Bold wordmark face, self hosted so the site makes no external requests.
- `assets/jetbrains-mono-regular.ttf`, `assets/jetbrains-mono-medium.ttf` - JetBrains Mono for every mono readout (the hero timer, kickers, data labels), self hosted and subset to Basic Latin so each file is tiny. Same face the Android app bundles, so the site and app read as one product. SIL Open Font License, see `assets/jetbrains-mono-OFL.txt`.
- `assets/site.js` - one small progressive enhancement for the waitlist forms.
- `assets/mark.svg`, `assets/favicon.svg` - the coral tile mark, the white Duma m on the coral gradient.
- `assets/og-image.png` - the social share card, 1200x630. Its source is `assets/og.html`.
- `assets/og.html` - build source for the share card. Not linked from the site.
- `CNAME`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.nojekyll` - hosting and metadata.

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
