# meret.app

Source for the marketing site at [meret.app](https://meret.app), the home of **Meret**, a second brain for musical creativity on Android.

Meret is a creative vault for musicians. Capture a musical idea the moment it strikes, then organize, rediscover, and evolve it later. Recording comes first, and everything stays on the phone.

- Live site: https://meret.app
- The app: the Meret Android app, in development.

This repository is only the marketing site. It is not the app.

## About this repo

A plain static site. No build step, no framework, no dependencies. It is served by GitHub Pages and loads with no external requests: system fonts plus two self hosted faces, no web font CDN, no analytics, no trackers, no cookies. The only outbound request is the one a visitor triggers by joining the waitlist.

- `index.html` - the landing page.
- `about/`, `privacy/`, `security/`, `terms/` - the supporting pages, in a shared dark prose layout.
- `assets/` - the stylesheet, the self hosted fonts, the brand mark, and the social share image.

## Run locally

Any static server works, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Deployment and operations

Maintainer notes for hosting, DNS, the contact inboxes, the waitlist, and regenerating the share image live in [DEPLOYMENT.md](DEPLOYMENT.md). They are not needed to browse or run the site locally.

## License

All rights reserved. The site content, the copy, and the brand assets, including the Meret name, the wordmark, and the mark, are proprietary and may not be reused without permission.

The bundled fonts carry their own licenses. JetBrains Mono is under the SIL Open Font License, see `assets/jetbrains-mono-OFL.txt`. Duma Bold is licensed from its foundry.

This is the live marketing site, not an open contribution project, so it does not accept feature pull requests. Reports of bugs or typos are welcome as issues.
