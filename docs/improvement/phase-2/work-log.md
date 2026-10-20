# Phase 2 Work Log

One entry per backlog item. Both repos: FE = `tailor_Management_REACT`, BE = `tailor_Management_Server`. Workflow: branch `phase-2/<id>-<name>` from `improvement`, full checks, fast-forward merge (solo).

### TEST-003: CI pipeline

- Branch / commit: FE `phase-2/test-003-ci`, BE `phase-2/test-003-ci`
- Root cause: no CI, no lint/format scripts in BE.
- Fix: GitHub Actions in both repos (install from lock file, lint, Prettier check, tests, build; FE E2E job added with TEST-001). BE got ESLint 9 flat config. Prettier formatted once per repo in a dedicated commit, listed in `.git-blame-ignore-revs`.
- Tests added: —
- Verified: CI green on `improvement` in both repos.
- Side effects / follow-ups: BE lint non-blocking until SEC-002 (6 swallowed `catch (error)` vars); FE unit-test step non-blocking until ARCH-005.

### TEST-001: Safety net

- Branch / commit: BE `phase-2/test-001-api-safety-net`, FE `phase-2/test-001-e2e`
- Root cause: no tests (Phase 1 TEST-001).
- Fix: BE split `src/app.js` (Express app) from `src/server.js` (connect + listen), behavior unchanged. 18 Vitest + Supertest characterization tests on an in-memory MongoDB. `scripts/e2e-server.js` runs the API on in-memory MongoDB with test-only reset/health endpoints. FE Playwright E2E for all 6 key flows (happy + failure paths) on desktop 1440 and tablet 768, plus a local-only visual baseline (`@visual`).
- Tests added: BE 18 API tests; FE 14 E2E tests × 2 viewports, 4 visual × 2.
- Verified: suites run 3× with no flakes (BE 18/18, FE 28/28).
- Side effects / follow-ups: Safety incident during development: one E2E handler used `route.continue()` and bypassed the 5000→5100 reroute, so a single read-only `GET /api/customerDetail/2` reached the developer's API on port 5000 (Atlas). No writes. Fixed with `route.fallback()` and `e2e/global-setup.js`, which refuses to run while anything listens on port 5000. ARCH-001 removes the hardcoded port.

### UX-001 (+ UX-002): Wrong and stale data in customer detail

- Branch / commit: FE `phase-2/ux-001-stale-detail`
- Root cause: `ShowDetailModal` kept `updatedOrderStatus`/`updatedPaymentStatus` in local state; the modal stays mounted and is reused for every customer, so the last update overrode later customers' real status. `AllCustomer` opened the modal before the detail request finished, showing the previous customer's data.
- Fix: status is rendered from server data only; the list opens the modal after the customer has loaded.
- Tests added: E2E "detail shows the stored status after another customer was updated (UX-001)" (was `test.fail`), "never shows the previous customer while the next one loads (UX-002)" (non-retrying check during a 1.5 s delayed response).
- Verified: tests ✅ lint ✅ build ✅ E2E 38/38 incl. visual ✅ (desktop + tablet).
- Side effects / follow-ups: on a slow network the click now waits for data before the modal appears; UX-003 adds a loading state.

### UX-005: Confirm before deleting a customer

- Branch / commit: FE `phase-2/ux-005-delete-confirm`
- Root cause: trash icon called `DELETE` directly; confirmation existed only for status changes.
- Fix: confirmation dialog naming the customer and number, with Cancel / Delete, styled with the existing modal classes.
- Tests added: E2E "asks for confirmation, then removes the customer", "cancel keeps the customer".
- Verified: tests ✅ lint ✅ build ✅ E2E 40/40 incl. visual ✅ (desktop + tablet).
- Side effects / follow-ups: trash icon is still not keyboard reachable (A11Y-001, Phase 3). Soft delete/undo can come with SEC-006 thinking later.

### ARCH-001: API module and same-origin serving

- Branch / commit: BE `phase-2/arch-001-serve-web`, FE `phase-2/arch-001-api-module`
- Root cause: 7 components called `axios` with a hardcoded `http://localhost:5000` URL; on a tablet `localhost` is the tablet itself.
- Fix: FE `src/api/client.js` (base `/api`, optional `REACT_APP_API_BASE`) + `src/api/customers.js` (6 functions); components call functions. CRA dev server proxies `/api` to `http://localhost:5000`. BE `createApp({ webDist })` serves the frontend build and SPA fallback when `WEB_DIST` is set (shop PC: one address for UI and API). Removed a `console.log` of the customer name (personal data).
- Tests added: BE 5 tests for static serving and SPA fallback (`test/web.test.js`). FE E2E now runs production-like: API serves the build on one origin; the 5000→5100 reroute and port-5000 guard were removed, and any request to port 5000 is aborted as a defense.
- Verified: BE 23/23 ✅ lint (new files) ✅; FE lint ✅ build ✅ E2E 40/40 incl. visual ✅; dev proxy checked (`/api` via port 3001 → 5000 returned 200).
- Side effects / follow-ups: dev API must run on port 5000 for `npm start` (unchanged). E2E can now run while the dev API is up.

### SEC-001: Shop PIN per device (+ env validation)

- Branch / commit: BE `phase-2/sec-001-shop-pin`, FE `phase-2/sec-001-pin-screen`
- Root cause: no access control and `cors()` allowing every origin; anyone on the shop Wi-Fi could read or delete all customers.
- Fix: BE `src/middleware/deviceAuth.js`: `POST /api/session` with the shop PIN sets a signed httpOnly, SameSite=Strict cookie (1 year); `/api/customerDetail/*` returns 401 without it; 5 wrong PINs per IP → 429 for 15 min; signing key includes the PIN, so a PIN change signs out every device; `DELETE /api/session` forgets a device. CORS limited to `CORS_ORIGINS` (default none). `src/config/env.js` validates `MONGODB_URI`, `SHOP_PIN` (4–8 digits), `SESSION_SECRET` (≥32 chars) at start-up. Only `src/server.js` loads `.env`. FE `DeviceGate` shows a PIN screen (existing styles) until unlocked; any 401 re-locks.
- Tests added: BE `test/session.test.js` (15: 401 on all 6 endpoints, wrong/missing PIN, cookie flags, forget device, forged cookie, PIN change, lockout, CORS allowlist), `test/env.test.js` (3); CORS characterization test flipped. FE E2E `device-pin.spec.js` (unlock + persists after reload; wrong PIN error); all E2E fixtures unlock via the API.
- Verified: BE 41/41 ✅ lint ✅; FE lint ✅ build ✅ E2E 44/44 incl. visual ✅ (desktop + tablet); real `.env` start-up ✅; missing env → clear error ✅.
- Side effects / follow-ups: the owner's local `.env` got `SHOP_PIN=1234` (temporary, owner to change) and a random `SESSION_SECRET`. The E2E server briefly read the dev `.env` PIN while developing this; fixed by removing dotenv from `db.js` and fixing E2E values.

### SEC-006: Backups and a tested restore

- Branch / commit: BE `phase-2/sec-006-backups`
- Root cause: free Atlas M0 has no backups; nothing exported the data.
- Fix: `src/backup/backup.js` exports every collection as canonical Extended JSON (keeps `_id`, dates, types) with a manifest; prunes to the newest `BACKUP_KEEP` (30). `npm run backup` (reads `.env`), `npm run restore -- <folder> [--uri <target>] --yes` (dry run without `--yes`). `backups/` is git-ignored.
- Tests added: BE `test/backup.test.js` (round trip identical incl. ids/dates/booleans; pruning).
- Verified: BE 43/43 ✅ lint ✅. Restore drill on 2026-10-20: backup of Atlas `tailor` (2 customers, read-only) restored into a throwaway in-memory database → 2 documents; Atlas was not written.
- Side effects / follow-ups: scheduling (daily cron/launchd on the shop PC) and copying to a second location are documented in ARCH-009 README. Backup files contain customer data; keep them private.

### SEC-002: JSON errors without stack traces

- Branch / commit: BE `phase-2/sec-002-json-errors`
- Root cause: each handler swallowed errors in its own `try/catch` (6 lint errors); thrown validation errors reached Express's default HTML handler with stack traces.
- Fix: removed the redundant `try/catch`; `asyncHandler` forwards to `src/middleware/errors.js` (4xx → `{ error: message }`, others logged + generic 500); unknown `/api` paths → JSON 404. ESLint `argsIgnorePattern: "^_"` for the Express error-handler signature. Lint now blocking in BE CI.
- Tests added: missing-fields test asserts JSON; 500 asserts generic JSON with no stack/paths; unknown API path 404.
- Verified: BE 44/44 ✅ lint 0 errors ✅.
- Side effects / follow-ups: non-numeric id still 500 (SEC-003).

### ARCH-005 (+ ARCH-004, TEST-002, K-009): Create React App → Vite + Vitest

- Branch / commit: FE `phase-2/arch-005-vite` (2 commits: migration, lint fixes)
- Root cause: CRA unmaintained; Jest could not load ESM axios; ~95 audit findings from CRA tooling.
- Fix: Vite 5 (output `build/`, dev proxy `/api` → 5000, port 3000), Vitest + Testing Library + jsdom, ESLint 9 flat config (react, react-hooks). `.js` → `.jsx`; `VITE_API_BASE`. Removed `react-scripts`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `web-vitals`, `serve` (all unused after the move). Lint fixes: `class` → `className` (K-009), unused `React` imports, escaped quotes.
- Tests added: `DeviceGate.test.jsx` (4) replaces the stale CRA `App.test.js`. Unit tests blocking in CI.
- Verified: lint ✅ unit 4/4 ✅ build 1.9 s (was 16.4 s) ✅ E2E 44/44 incl. visual (identical screenshots) ✅; dev server + proxy checked.
- Side effects / follow-ups: done earlier than the skill's default order (before dependency step) so the reliability fixes get component tests. The owner's running CRA dev server must be restarted with `npm install && npm start` (now Vite).

### UX-003 (+ UX-011): Loading, error and empty states

- Branch / commit: FE `phase-2/ux-003-states`
- Root cause: one `someData.length > 0` check drove every state and all `catch` blocks only logged, so loading, offline and empty looked the same; search showed "Customer Not Found." for every failure; failed status/delete actions closed silently. New bug found while testing (UX-011): pressing Enter in the search box submitted the form and reloaded the page.
- Fix: `src/api/errors.js` maps errors to actionable messages (offline vs server message). List: explicit loading / error + Retry / empty / ready; a failed refresh keeps rows on screen; "could not open" message. Search: 404/400 → not found, other errors explained, button disabled while searching, Enter handled with `preventDefault`. Status change and delete keep their dialog open with the error and disable the action button while running.
- Tests added: component tests `AllCustomer.test.jsx` (5), `SearchScreen.test.jsx` (4), `ShowDetailModal.test.jsx` (3); 9 failed on the old code. E2E: UX-003 test flipped to "error with Retry", new "searches when Enter is pressed".
- Verified: lint ✅ unit 16/16 ✅ build ✅ E2E 46/46 incl. visual ✅ (desktop + tablet).
- Side effects / follow-ups: messages use existing styles; Phase 3 designs proper Empty/Error/Loading components (UI-003).
