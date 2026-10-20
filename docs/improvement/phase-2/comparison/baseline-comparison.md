# Phase 2 vs Phase 0 Baseline

Measured 2026-10-20 on the production build. Phase 0 served the build with `serve` and the API separately; Phase 2 measures the shop setup: the server serves the build and API from one origin, the device is unlocked with the PIN cookie, and the database holds 5 fake customers in memory. Lighthouse 12.8.2, median of 3 runs.

## Checks

| Check                       | Phase 0                                    | Phase 2                                                                                       | Target                   | Result                                                                |
| --------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| Build                       | ✅ (CRA)                                   | ✅ (Vite 8)                                                                                   | pass                     | ✅                                                                    |
| Build time                  | 16.4 s                                     | 0.67 s                                                                                        | not worse by > 10%       | ✅ −96%                                                               |
| Lint errors / warnings      | 0 / 0 (CRA rules); server: no lint         | 0 / 0 both repos (stricter ESLint 9 + react, react-hooks)                                     | 0 errors                 | ✅                                                                    |
| Type errors                 | n/a (JavaScript)                           | n/a                                                                                           | 0                        | ➖                                                                    |
| Tests (total / passing)     | 0 working (1 broken CRA test)              | Server 76/76, web unit 31/31, E2E 38/38 in CI (+8 visual locally)                             | all pass, 0 flaky        | ✅ 3× runs, no flakes                                                 |
| E2E key flows covered       | 0 / 6                                      | 6 / 6 (happy + failure path), plus PIN, navigation, 404                                       | 100%                     | ✅                                                                    |
| Coverage                    | not measured                               | not measured                                                                                  | higher than Phase 0      | ➖ (no coverage tool added; tests went from 0 to 145)                 |
| Vulnerabilities crit/high   | server 1/6, web 5/37                       | server 0/0, web 0/1                                                                           | 0 or accepted            | ✅ web 1 high accepted: lint-only `brace-expansion` (see upgrades.md) |
| Outdated majors             | many (see Phase 0)                         | runtime: React 18 (19 available), react-router 7 (8 needs React 19); dev tools only otherwise | as planned               | ✅ deferred as DEP-001                                                |
| Lighthouse (key pages)      | see below                                  | see below                                                                                     | not worse by > 5 points  | ✅ all equal or better                                                |
| Bundle size (gzip)          | JS 84.2 KB, CSS 33.6 KB                    | JS 95.8 KB, CSS 32.1 KB                                                                       | not significantly larger | ⚠️ JS +11.6 KB (+14%), reason below; owner acceptance requested       |
| Console errors on key pages | CORS errors (API unreachable on port 5000) | 0                                                                                             | 0                        | ✅                                                                    |

## Lighthouse (median of 3)

| Page          | Device  | Perf P0 → P2 | A11y | BP  | SEO | LCP P0 → P2   | FCP P0 → P2   | CLS P2 |
| ------------- | ------- | ------------ | ---- | --- | --- | ------------- | ------------- | ------ |
| Welcome `/`   | mobile  | 64 → **73**  | 80   | 96  | 92  | 9.91 → 9.01 s | 3.68 → 2.24 s | 0.000  |
| Welcome `/`   | desktop | 91 → 91      | 80   | 96  | 92  | 1.80 → 1.84 s | 0.97 → 0.94 s | 0.001  |
| Dashboard     | mobile  | 77 → **89**  | 77   | 96  | 92  | 4.32 → 3.38 s | 3.72 → 2.26 s | 0.002  |
| Dashboard     | desktop | 98 → 98      | 77   | 100 | 92  | 0.94 → 0.96 s | 0.87 → 0.88 s | 0.000  |
| All Customers | mobile  | 80* → **93** | 86   | 100 | 100 | 3.92 → 2.68 s | 3.47 → 2.38 s | 0.001  |
| All Customers | desktop | 97* → 97     | 86   | 100 | 100 | 1.01 → 0.95 s | 0.93 → 0.90 s | 0.047  |
| Search        | mobile  | 78 → **95**  | 98   | 100 | 100 | 4.15 → 2.52 s | 3.70 → 2.23 s | 0.000  |
| Search        | desktop | 98 → 98      | 98   | 100 | 100 | 0.92 → 0.96 s | 0.88 → 0.88 s | 0.000  |

\* Phase 0 measured All Customers with the API unreachable; Phase 1 with data: 78 mobile / 97 desktop.

The first Phase 2 measurement was worse (mobile 64–72, desktop 86–93, FCP 4.4 s). Cause: Express served JS/CSS uncompressed (the Phase 0 static server compressed them), and the PIN gate waited for `/api/session` before drawing. Both fixed (`compression`, gate renders at once); the table shows the re-measurement. Raw numbers: `lighthouse-phase-2.md`.

## Bundle size reason

| Step                                                                     | JS gzip |
| ------------------------------------------------------------------------ | ------- |
| Phase 0 (CRA)                                                            | 84.2 KB |
| After Vite move                                                          | 79.9 KB |
| axios 1.4 → 1.20, React 18.2 → 18.3, react-router 6.15 → 6.30 (security) | 89.5 KB |
| react-router 6 → 7 (open-redirect fix)                                   | 95.7 KB |
| + PIN gate, error boundary, 404, state handling                          | 95.8 KB |

The growth comes from security upgrades of axios and react-router. Phase 4 targets ≤ 80 KB (PERF-005: replace axios with `fetch`; PERF-004: route splitting). React 19 was not adopted because it would add another 23 KB.

## Visual check

- `npm run test:visual` (desktop 1440 + tablet 768, 4 pages): passes against the baseline taken at the start of Phase 2 → no unintended changes through every Phase 2 commit.
- Phase 2 screenshots at 375 / 768 / 1440 (`screenshots/`) compared with Phase 0 `../phase-0/screenshots/`: same layout and styling on all pages, including the known mobile overflow (RESP-001/002, Phase 3).
- Intended visible changes (all bug fixes or Phase 2 items, existing styles):
  - PIN screen on a new device (SEC-001), `pin-*.png`
  - "Loading customers…", error + Retry, and "could not reach the shop computer" messages (UX-003)
  - Delete confirmation dialog (UX-005)
  - Save error in the add dialog, "Saving…", and "Customer added: …" message (UX-004a)
  - Not-found page and error-boundary page
