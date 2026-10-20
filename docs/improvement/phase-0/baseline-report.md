# Phase 0 Baseline Report — Frontend
Date: 2026-10-20   Commit: ab243af   Tag: v0-baseline

System = this repo (`tailor_Management_REACT`) + server repo (`tailor_Management_Server`). The server has its own baseline report at `docs/improvement/phase-0/baseline-report.md` in that repo.

## 1. Summary

- **Overall health:** Small Create React App (CRA) project, about 1,650 lines of JS/CSS in 4 routes. It installs cleanly from the lock file and the production build passes in about 16 s. Desktop Lighthouse performance is good (91–98). Mobile is weak (64–80) because of a 1.3 MB hero image and render-blocking Google Fonts. The mobile layout is broken. The only test fails. There is no authentication, and the API URL is hardcoded to `localhost:5000`.
- **Top 5 problems:**
  1. K-101 (server repo): server repo had no `package.json`, so it could not be installed. Reconstructed in Phase 0.
  2. K-001: API URL hardcoded to `http://localhost:5000`. On macOS that port belongs to AirPlay, so the UI shows no data.
  3. K-002 / K-102: no authentication anywhere; the UI promises Google login.
  4. K-003: delete customer runs on one click with no confirmation.
  5. K-004: mobile layout broken on dashboard, customer table and welcome page.
- **Blocked measurement:** The owner chose to keep AirPlay Receiver on, so nothing could listen on port 5000. Lighthouse ran against the real app, so data pages were measured in their "API unreachable" state. Screenshots used a Playwright reroute (`localhost:5000` to `localhost:5001`) in the test harness, with no app code change.

## 2. Repository

| Item | Value |
|---|---|
| Remote | `git@github.com:baigfaraz/tailor_Management_REACT.git` |
| Default branch | `master` |
| Working branches | `improvement` (integration), `phase-0/baseline` (this work) |
| Baseline tag | `v0-baseline` on `ab243af`, pushed to origin |
| Uncommitted work at start | None |
| Tracked secrets | None found |
| `.gitignore` | Covered `node_modules`, `build`, `coverage`, `.env.*.local`. Added `.env`, `.idea/`, `.vscode/`, `*.log` (with an exception for `docs/improvement/**`) in Phase 0. |
| Recommendation | Turn on branch protection for `master` on GitHub (no direct pushes, PR required). |

## 3. Stack

| Item | Status | Detail |
|---|---|---|
| Language / runtime | found | JavaScript (no TypeScript). Node not declared; pinned to `20` in `.nvmrc` in Phase 0 (code is 2023-era, CRA 5). |
| Package manager | found | npm (`package-lock.json`, lockfileVersion 3). Single lock file. |
| Framework / build | found | React 18.2.0, Create React App (`react-scripts` 5.0.1, webpack 5). Unmaintained. |
| Routing | found | `react-router-dom` 6.15.0 |
| Styling | found | Bootstrap 5.3.1 + `react-bootstrap` 2.8.0, one global `App.css`, Google Fonts (Dancing Script, Mogra, Montserrat). MUI + Emotion installed but unused. |
| State / data fetching | found | Local `useState` only. `axios` 1.4.0 called directly in components. |
| Testing | found, broken | Jest + Testing Library via CRA. 1 stale test file. |
| Lint / format / types | partial | ESLint via `eslintConfig: react-app`. No Prettier. No TypeScript. |
| Monorepo | not found | Frontend and backend are separate repos. |
| Backend / services | found | Express + MongoDB API in the server repo, called at `http://localhost:5000/api/customerDetail`. |
| Deployment | not found | Not deployed (owner confirmed). No CI. |
| Scripts | found | `start`, `build`, `test`, `eject` |
| Size | — | 28 tracked files, about 1,655 lines of JS/CSS. |

## 4. How to Run Locally

Prerequisites: Node 20 (`fnm` or `nvm`), Docker Desktop. Run the server repo first (see its CLAUDE.md).

```bash
# runtime
fnm install 20 && fnm use 20        # reads .nvmrc

# server repo (sibling folder)
docker run -d --name tailor-mongo -p 27017:27017 mongo:7
cd ../backend
cp .env.example .env                # MONGODB_URI=mongodb://localhost:27017/tailor
npm ci
npm start                           # http://localhost:5000

# this repo
cd ../frontend
npm ci
npm start                           # dev server, http://localhost:3000
npm run build && npx serve@14.2.4 -s build -l 3000   # production preview
```

Environment variables: none. The API URL is hardcoded (K-001), so no `.env.example` is needed yet.

macOS note: if port 5000 is taken (`lsof -nP -iTCP:5000`), turn off System Settings > General > AirDrop & Handoff > AirPlay Receiver. The frontend cannot use any other port.

Seed data: no seed script exists. Phase 0 created 5 fake customers through `POST /api/customerDetail`.

## 5. Health Checks

Node 20.20.2, npm 10. Raw logs in `raw/`.

| Check | Result | Detail |
|---|---|---|
| Install (`npm ci`) | ⚠️ pass | 1,566 packages in 58 s. 6 deprecation warnings. `raw/install.log` |
| Dev server (`npm start`) | ⚠️ pass | Ready in about 12 s. Babel preset warning. In browser: React warnings for `<text>` tag and `class` prop (K-009). `raw/dev-server.log`, `raw/dev-console.log` |
| Production build | ⚠️ pass | 16.4 s wall time. "Compiled successfully" with Babel preset + outdated `caniuse-lite` warnings. `raw/build.log` |
| Production preview | ✅ pass | `serve -s build`; all 4 routes return 200. |
| Lint (`eslint src`, react-app config) | ✅ pass | 0 errors, 0 warnings. `raw/lint.log` |
| Type check | ➖ | No TypeScript. |
| Unit tests | ❌ fail | 1 suite failed, 0 tests ran. Jest cannot parse ESM `axios`; the test itself is stale CRA boilerplate (K-008). `raw/test.log` |
| Coverage | ➖ | Not measurable (tests fail). |
| E2E | ➖ | Not configured. |
| Formatting | ➖ | Prettier not configured. |

Browser errors seen (`raw/browser-console.log`):
- With port 5000 blocked: CORS error on `GET /api/customerDetail/somedata`, then "Error fetching data". Table shows "No data availaible to show!".
- Search for a missing ID: 404, shown as "Customer Not Found." (expected).

## 6. Pages & Key Flows

4 routes, 6 key flows, no auth. See [pages-and-flows.md](pages-and-flows.md).

## 7. Performance Baseline

Production build served by `serve`, Lighthouse 12.8.2, headless Chrome, 3 runs per page and device, median shown. Median-run reports in `lighthouse/`.

| Page | Device | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| Welcome `/` | mobile | 64 | 80 | 96 | 92 | 9.91s | 0.000 | 0ms | 3.68s | 5.01s |
| Welcome `/` | desktop | 91 | 80 | 96 | 92 | 1.80s | 0.001 | 0ms | 0.97s | 0.97s |
| Dashboard `/Home` | mobile | 77 | 77 | 96 | 92 | 4.32s | 0.000 | 0ms | 3.72s | 3.72s |
| Dashboard `/Home` | desktop | 98 | 77 | 100 | 92 | 0.94s | 0.000 | 0ms | 0.87s | 0.87s |
| All Customers* | mobile | 80 | 95 | 96 | 100 | 3.92s | 0.000 | 0ms | 3.47s | 3.54s |
| All Customers* | desktop | 97 | 95 | 96 | 100 | 1.01s | 0.000 | 0ms | 0.93s | 0.93s |
| Search | mobile | 78 | 96 | 100 | 100 | 4.15s | 0.000 | 0ms | 3.70s | 3.70s |
| Search | desktop | 98 | 96 | 100 | 100 | 0.92s | 0.000 | 0ms | 0.88s | 0.88s |

\* API unreachable during Lighthouse (port 5000 blocked), so the table was empty. Re-measure with data in Phase 1.

Main mobile opportunities (Welcome): render-blocking fonts (est. 3.1 s), image delivery (est. 1.2 MB), no cache headers from the preview server (preview-specific).

**Bundle (gzip, from build output):** JS `main.js` 84.2 kB, CSS `main.css` 33.62 kB. Single JS chunk, no code splitting.

**Total `build/` size:** 3.7 MB (includes source maps).

Largest build files (KB on disk):

| File | KB |
|---|---|
| `static/media/mainImage.*.jpg` | 1,296 |
| `static/js/main.*.js.map` | 1,132 |
| `static/css/main.*.css.map` | 544 |
| `static/js/main.*.js` | 268 |
| `static/css/main.*.css` | 248 |
| `static/media/measure.*.png` | 100 |
| `static/media/customer.*.png` | 84 |
| `static/media/payment.*.png` | 72 |
| `logo512.png` | 12 |
| `logo192.png` | 8 |

**API timing** (local, 5 rows): every endpoint answered in under 25 ms. No slow calls at this data size.

**Runtime observations:** No layout shift (CLS ≈ 0). Mobile pages scroll sideways because of overflow (K-004).

## 8. Dependencies & Security

`raw/outdated.txt`, `raw/audit.txt`, `raw/audit.json`.

| Package | Current | Latest | Behind |
|---|---|---|---|
| react / react-dom | 18.2.0 | 19.3.1 | major |
| react-router-dom | 6.15.0 | 7.18.4 | major |
| @mui/material (unused) | 5.14.5 | 9.5.0 | major |
| @testing-library/react | 13.4.0 | 16.3.3 | major |
| @testing-library/jest-dom | 5.17.0 | 6.9.1 | major |
| @testing-library/user-event | 13.5.0 | 14.6.8 | major |
| web-vitals (unused) | 2.1.4 | 6.2.3 | major |
| axios | 1.4.0 | 1.20.0 | minor |
| react-bootstrap | 2.8.0 | 2.10.10 | minor |
| react-bootstrap-icons | 1.10.3 | 1.11.6 | minor |
| @emotion/react, @emotion/styled (unused) | 11.11.x | 11.14.x | minor |
| bootstrap | 5.3.1 | 5.3.8 | patch |
| react-scripts | 5.0.1 | 5.0.1 | framework unmaintained |

Totals: 14 outdated (8 major, 5 minor, 1 patch).

Vulnerabilities: **103** (5 critical, 37 high, 47 moderate, 14 low). Critical packages (all transitive): `@babel/traverse`, `form-data`, `proxy-addr`, `shell-quote`, `websocket-driver`. Direct high: `axios`, `react-router-dom`, `react-scripts`. Most are in the CRA dev toolchain and do not ship in the bundle.

Deprecated (install warnings): `svgo@1`, `rollup-plugin-terser`, `sourcemap-codec`, `w3c-hr-time`, `stable`, `workbox-cacheable-response`, plus `babel-preset-react-app` notice.

Unused (`depcheck`): `@mui/material`, `@emotion/react`, `@emotion/styled`, `web-vitals`, `@testing-library/jest-dom`, `@testing-library/user-event`.

Nothing was upgraded.

## 9. Visual Baseline

`screenshots/`: 30 full-page PNGs. 4 pages × mobile 375 / tablet 768 / desktop 1440, plus states:
- `dashboard-*-add-customer-modal`, `dashboard-*-add-confirm-modal`
- `all-customers-*-detail-modal`, `all-customers-*-api-unreachable`
- `search-*-result-modal`, `search-*-not-found`

Data: 5 fake customers. Dark mode: not supported (app has one dark theme). Loading states: none exist in the app.

Script: Playwright 1.48.2. It reroutes `localhost:5000` to `5001` in the browser context only.

## 10. Known Issues

22 frontend issues: 0 Critical, 4 High, 9 Medium, 9 Low. See [known-issues.md](known-issues.md). Server issues (K-1xx) are in the server repo.

## 11. Recommendations for Phase 1

Audit these first (no fixes yet):
1. API configuration: how the base URL should be set per environment and which port to use (K-001).
2. Authentication scope: decide whether Google login is in scope, since every route and endpoint is open (K-002, K-102).
3. Destructive actions and status updates: delete flow and `ShowDetailModal` state (K-003, K-005).
4. Responsive layout of all 4 pages (K-004), with the screenshots as reference.
5. Test strategy: CRA Jest config and which flows need tests first (K-008).
6. Toolchain: plan the path off Create React App (for example Vite) before the Phase 2 dependency work (K-012, K-013).
7. Re-run Lighthouse on All Customers with live data once port 5000 is free.
