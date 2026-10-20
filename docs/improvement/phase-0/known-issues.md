# Known Issues — Frontend (Phase 0)

Recorded, not fixed. Fixing starts in Phase 2. Backend issues live in the server repo (`tailor_Management_Server`, `docs/improvement/phase-0/known-issues.md`, IDs K-1xx).

The owner reported no previously known bugs (asked 2026-10-20).

Severity: **Critical** security leak, data loss, crash, key flow broken. **High** key flow partly broken, major perf problem, build failing. **Medium** visible bug or UX problem with a workaround, many warnings. **Low** cosmetic, minor warnings, cleanup.

| ID | Area | Description | Where (page/file) | Severity | Found in step |
|----|------|-------------|-------------------|----------|---------------|
| K-001 | Config | API base URL hardcoded as `http://localhost:5000` in 6 places. No env config, so the app cannot point at any other server. On macOS 12+ the AirPlay Receiver holds port 5000, so the UI gets a 403/CORS error and shows "No data". Phase 0 screenshots used a test-harness reroute to port 5001. | `AllCustomer.js` (×3), `DetailModal.js`, `SearchScreen.js`, `ShowDetailModal.js` (×2) | High | 3, 6 |
| K-002 | Security / Feature | No authentication. Welcome page says "login with Google", but no login exists. "Logout" is a link to `/`. Every page and every API call is open. | `WelcomePage.js`, `Header.js` | High | 5 |
| K-003 | Data loss | Trash icon deletes a customer immediately. No confirmation, no undo, errors only go to the console. | `/Home/AllCustomer`, `AllCustomer.js:44` | High | 5 |
| K-004 | Responsive | Mobile layout broken at 375px. Dashboard card row does not wrap (page ≈650px wide, "Add Customer" card off-screen). Header does not span full width. Customer table overflows. Description text overflows its pill. Welcome image is squashed. | `/Home`, `/Home/AllCustomer`, `/`; `App.css` (`.cards`, `.description`, `.mainImage`) | High | 8 |
| K-005 | Bug (from code, confirm in Phase 1) | `ShowDetailModal` keeps `updatedOrderStatus` / `updatedPaymentStatus` across customers. After one status change, other customers may show the wrong status. Modal also opens before the fetch finishes, so the previous customer's data can flash. | `ShowDetailModal.js:15-16`, `AllCustomer.js:64` | Medium | 5 |
| K-006 | UX / Forms | Add-customer form has no client-side validation and no success or error message. Numeric fields are free text. After success the large modal stays open. API errors only reach `console.error`. | `DetailModal.js` | Medium | 5 |
| K-007 | UX | Search text says "by Name or Customer-ID", but only numeric ID works. Every error (including 500) shows "Customer Not Found." | `SearchScreen.js:47`, `Searchbar.js` | Medium | 5 |
| K-008 | Tests | Test suite fails: 1 suite, 0 tests run. `App.test.js` is the CRA default ("learn react"), `setupTests.js` was deleted, and Jest cannot parse ESM `axios` ("Cannot use import statement outside a module"). | `src/App.test.js` | Medium | 4 |
| K-009 | Code quality | Invalid JSX: `<text>` element (unknown tag) and `class=` instead of `className`. React logs warnings in dev. | `AllCustomer.js`, `DetailModal.js`, `ShowDetailModal.js`, `HomePage.js`, `WelcomePage.js` | Medium | 4 |
| K-010 | Performance | `mainImage.jpg` is 1.3 MB, unoptimized, not responsive. Welcome page mobile LCP 9.9 s, Perf 64. Lighthouse estimates 1.2 MB image savings. | `src/assets/mainImage.jpg`, `/` | Medium | 6 |
| K-011 | Performance | Google Fonts `@import` duplicated and render-blocking (3 families). Lighthouse estimates 3 s savings on mobile. | `App.css:2-3` | Medium | 6 |
| K-012 | Security / Deps | `npm audit`: 103 vulnerabilities (5 critical, 37 high, 47 moderate, 14 low). Most come through `react-scripts` dev tooling. Direct runtime: `axios` 1.4.0 (high), `react-router-dom` 6.15.0 (high). | `package-lock.json` | Medium | 7 |
| K-013 | Tooling | Create React App is unmaintained (`babel-preset-react-app` warns on every build/test). `caniuse-lite` outdated. | `react-scripts` 5.0.1 | Medium | 4 |
| K-014 | Deps | Unused dependencies: `@mui/material`, `@emotion/react`, `@emotion/styled`, `web-vitals`. Two UI kits installed (Bootstrap + MUI), only Bootstrap used. | `package.json` | Low | 7 |
| K-015 | SEO / Branding | `<title>` is "React App". Meta description and `manifest.json` are CRA defaults. | `public/index.html`, `public/manifest.json` | Low | 6 |
| K-016 | Accessibility | Lighthouse A11y 77–80 on Welcome and Dashboard. Images without real alt text. Bootstrap `Button` wraps a router `Link` (nested interactive). Clickable `<td>` rows and trash icon are not keyboard reachable. Small tap targets. | `WelcomePage.js`, `Card.js`, `AllCustomer.js` | Low | 6 |
| K-017 | Copy | Typos and grammar: "availaible", "Our Platform give ease", "every details", "such like". | `AllCustomer.js`, `HomePage.js`, `WelcomePage.js` | Low | 8 |
| K-018 | Routing | No 404 route. Unknown URLs render a blank page. Mixed-case paths (`/Home/AllCustomer`). | `App.js` | Low | 5 |
| K-019 | Code quality | Invalid `Modal` props (`size="l"`, `halfscreen`). Dead CSS (`.CustomerDetails`, `.Measurement*`, `.CompleteButton`, etc.). Empty `searchCustomer` handler. | `ShowDetailModal.js:82-83`, `App.css`, `HomePage.js:24` | Low | 5 |
| K-020 | Docs | `README.md` is CRA boilerplate. No setup docs. | `README.md` | Low | 2 |
| K-021 | Tooling | No Prettier, no TypeScript, no E2E tests, no CI, no deploy config. | repo | Low | 2 |
| K-022 | Git hygiene | `.gitignore` did not ignore plain `.env` or editor folders. Added in Phase 0. | `.gitignore` | Low | 1 |

## Count by severity

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 4 |
| Medium | 9 |
| Low | 9 |
