# 10 — SEO & Metadata

The app is a private tool on the shop LAN. No page should be found by search engines, so classic SEO is skipped on purpose. Metadata still matters for tablets (tab titles, home-screen install).

### SEO-001: Default CRA title, description and manifest
- Severity: Low
- Where: `public/index.html:27` (`<title>React App</title>`), `public/manifest.json` ("Create React App Sample", theme `#000000`), CRA favicon/logos
- Evidence: semantics scan: `title = "React App"` on all 4 pages.
- Cause: Template never customised.
- Impact: Every tab is "React App"; adding the app to a tablet home screen shows the React logo and name.
- Suggested direction: App name, per-page titles ("Customers · <Shop name>"), brand icons and manifest so the app installs like a native app on tablets.
- Effort: S
- Related: K-015, UX-008

### SEO-002: Crawlers allowed
- Severity: Low
- Where: `public/robots.txt` (CRA default allows all)
- Evidence: `User-agent: * Disallow:`
- Cause: Template default.
- Impact: Only matters if the app is ever exposed publicly.
- Suggested direction: `Disallow: /` and `noindex` meta.
- Effort: S
- Related: SEC-001
