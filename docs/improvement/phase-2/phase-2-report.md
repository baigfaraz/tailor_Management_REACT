# Phase 2 Stabilization Report

Date: 2026-10-20 Commits: web `improvement` (see `git log v0-baseline..v1-stabilized`), server `improvement` (same tags)

## 1. Summary

The app is now safe to run on the shop Wi-Fi and safe to change.

- **Access and data protection.** Tablets load the app and data from one address on the shop computer. A shop PIN per device protects every customer endpoint. Daily backups are possible, and restore is tested.
- **Bugs fixed.** The wrong-status bug and the stale customer detail are fixed. Deleting now asks first. The screens show loading, error and success states instead of failing silently.
- **Server hardening.** Input is validated and numbers are stored as numbers. Customer numbers can no longer collide when several tablets save at once.
- **Tooling and dependencies.** The toolchain moved from Create React App to Vite and both repos run on Node 24 LTS. Every runtime dependency is on a current, patched version. The server has 0 known vulnerabilities; the web app has 1, which is lint-only.
- **Tests.** From 0 working tests to 145: 76 API, 31 component, 38 end-to-end. All of them run in CI on every push, plus 8 local screenshot checks.
- **Look and behaviour.** Nothing else changed visibly. The screenshot baseline and the Phase 0 comparison show only the intended changes.

| Items                                   | Count                                                                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 2 backlog items done              | 17 / 17                                                                                                                                |
| New bugs found and fixed during Phase 2 | 4 (UX-011 search reload; Express 5 empty body; card link crash after react-router 7; two performance regressions from Phase 2 changes) |
| Moved to later phases                   | 2 new items (DEP-001 React 19 / router 8 → Phase 3; DEP-002 optional dev-tool majors → Phase 4)                                        |
| Blocked                                 | 0                                                                                                                                      |

Order note: the move to Vite (ARCH-005) was done before the reliability fixes rather than in the dependency step, so those fixes could get component tests (the CRA test runner was broken).

## 2. CI & Tests

**Pipelines** (GitHub Actions, every push to `improvement`/`main`/`master` and every PR; all steps blocking):

- Server: `npm ci` → lint → Prettier check → API tests (in-memory MongoDB).
- Web: `npm ci` → lint → Prettier check → unit tests → build; then an E2E job that checks out the server repo (`improvement`), builds, and runs Playwright against the server serving the build.

**Tests added**

| Suite                                       | Count       | Covers                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server API (Vitest + Supertest)             | 76          | all 6 customer endpoints, PIN/session (401, lockout, PIN change, forged cookie), CORS allowlist, validation per field, invalid ids, counter concurrency, JSON errors, static serving + SPA fallback, compression, security headers, logging, env validation, backup/restore round trip, numeric migration |
| Web component (Vitest + Testing Library)    | 31          | PIN gate, list loading/error/retry/delete failure, search (Enter, 404/400/offline), detail status + total + failure, add-form errors/success/double submit, error boundary, 404, API client, formatting                                                                                                   |
| E2E (Playwright, desktop 1440 + tablet 768) | 19 × 2 = 38 | all 6 key flows (happy + failure), PIN unlock, navigation, 404, stale-status and stale-detail regressions, API down                                                                                                                                                                                       |
| Visual (local only)                         | 4 × 2 = 8   | Welcome, Dashboard, All Customers, Search                                                                                                                                                                                                                                                                 |

The suites were run 3 times with no flakes. Every E2E test fails on any uncaught page error. Testing guide: [testing-guide.md](testing-guide.md).

## 3. Fixes

**Security**

- SEC-001: shop PIN per device: signed httpOnly cookie, brute-force lockout, signs out all devices on PIN change, and CORS limited to an allowlist.
- SEC-002: JSON errors with no stack traces.
- SEC-003: server validation and numeric data.
- SEC-004: security headers.
- SEC-005: dependency upgrades.
- SEC-006: backups.
- SEC-007: logs.

No secrets were committed, so there are no keys to rotate. The temporary development PIN set during SEC-001 was written into an earlier version of `work-log.md` (public repo), so set a new `SHOP_PIN` in `backend/.env` before the app is used at the shop. Changing the PIN signs out every device.

**Bugs (with regression tests)**

- UX-001 / UX-002: the detail showed the wrong status after another update, and showed the previous customer while loading.
- UX-005: delete had no confirmation.
- UX-003 / UX-011: failures looked like "no data"; Enter in search reloaded the page.
- UX-004a / UX-010: the add form gave no feedback and could submit twice.
- ARCH-007: customer numbers could collide or be reused.
- Express 5: a request without a body caused a 500.
- Card link: crash after react-router 7.

**Data changes in Atlas (approved by owner)**

- Backup `backups/2026-10-20T12-57-31-102Z`. Then the 2 placeholder-text customers were deleted. The database is now empty and uses the numeric format.

## 4. Reliability

- **Error boundary and 404:** an error boundary around the app (message + Reload) and a not-found route with a link home.
- **API failures:** every call shows a clear message ("Could not reach the shop computer…", or the server's message). Dialogs stay open with the error and keep everything that was typed. Action buttons are disabled while a request runs.
- **Timeouts and retries:** requests time out after 15 s. The list offers Retry. Nothing retries automatically, because the writes are not idempotent.
- **Server errors:** JSON 4xx/5xx and an unknown-path 404. Start-up validates `.env` and fails with a clear list.
- **Monitoring:** daily JSON log files (requests and errors, 14 days), with no personal data or secrets. No external monitoring service; none was requested.

## 5. Dependencies & Cleanup

See [upgrades.md](upgrades.md).

- **Runtime:** Node 20 (end-of-life) → 24 LTS.
- **Server:** Express 5, Mongoose 9, dotenv 18; nodemon replaced by `node --watch`.
- **Web:** Vite 8 + Vitest 5, axios 1.20, React 18.3.1, react-router 7.
- **Removed:** `react-scripts`, `@mui/material`, `@emotion/*`, `web-vitals` (unused), the stale CRA test, dead `console.log`s (one logged a customer name).

| Audit  | Phase 0          | Phase 2                     |
| ------ | ---------------- | --------------------------- |
| Server | 12 (1 critical)  | 0                           |
| Web    | 103 (5 critical) | 1 high, lint-only, accepted |

## 6. Baseline Comparison

Full table: [comparison/baseline-comparison.md](comparison/baseline-comparison.md).

| Metric                                                       | Phase 0              | Phase 2                                                |
| ------------------------------------------------------------ | -------------------- | ------------------------------------------------------ |
| Build time                                                   | 16.4 s               | 0.67 s                                                 |
| Lighthouse mobile (Welcome / Dashboard / Customers / Search) | 64 / 77 / 78–80 / 78 | 73 / 89 / 93 / 95                                      |
| Lighthouse desktop                                           | 91 / 98 / 97 / 98    | 91 / 98 / 97 / 98                                      |
| First Contentful Paint (mobile)                              | 3.5–3.7 s            | 2.2–2.4 s                                              |
| JS bundle (gzip)                                             | 84.2 KB              | 95.8 KB ⚠️ (security upgrades; Phase 4 target ≤ 80 KB) |
| Console errors                                               | API/CORS errors      | 0                                                      |

Visual: no unintended changes. The intended changes are the PIN screen, state messages, the delete and save dialogs, and the 404 page.

Two regressions from Phase 2 changes were found by this comparison and fixed before closing: missing compression and the PIN-gate request waterfall.

## 7. Open Items

- **Owner decisions:**
  - Accept the +11.6 KB JS bundle until Phase 4.
  - Merge `improvement` into `main`/`master` and deploy at the shop (recommended now).
- **DEP-001 (Phase 3):** React 19 and react-router 8, decided together with the UI library choice.
- **DEP-002 (Phase 4):** optional dev-tool majors.
- **PERF-008 (Phase 4):** cache headers. Compression is already done.
- **Owner to do:**
  - Change `SHOP_PIN` in `backend/.env`.
  - Schedule the daily backup on the shop computer and point `BACKUP_DIR` at a second location.
  - Add the shop's IP address to Atlas Network Access.

## 8. Ready for Phase 3

- **Safe to change:** every key flow is covered end-to-end on desktop and tablet using roles and labels, not CSS classes, so the component rewrite can change the markup freely. Update the visual baselines intentionally (`--update-snapshots`).
- **Data layer:** all API access goes through `src/api/`. Errors map to messages in `src/api/errors.js`. Display formatting lives in `src/format.js`. These are good seams for the new components.
- **Screens built in existing styles, to be redesigned:** PIN screen, loading/error/empty messages, delete and save dialogs, 404 and error pages.
- **Still fragile:**
  - `App.css` (global, overrides Bootstrap).
  - `DetailModal.jsx` (16 `useState`s, 400 lines; the Phase 5 redesign).
  - Mobile layout (RESP-001/002/004).
- **Starting point for the design system:** the draft token list in `../phase-1/04-ui-consistency.md`. Self-hosting one font (UI-002) also lets the CSP drop Google Fonts.
