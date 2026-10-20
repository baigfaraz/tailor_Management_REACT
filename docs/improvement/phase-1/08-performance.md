# 08 — Performance root causes

Production build served by `serve`. Lighthouse 12.8.2 medians (Phase 0 + `raw/lighthouse-all-customers-live.md`), LCP phase breakdown from the Phase 0 reports, bundle composition from `source-map-explorer` (`raw/bundle-top.txt`).

Desktop scores are already 91–98. Mobile scores (64–80) are the target.

## Root-cause table

| Page | Metric | Value (mobile) | Root cause | Expected gain if fixed | Finding ID |
|---|---|---|---|---|---|
| All pages | FCP | 3.5–3.7 s | Google Fonts loaded by `@import` inside `main.css` (twice): HTML → CSS → fonts CSS → font files, all render-blocking. Lighthouse: fonts CSS blocks 1.18 s. | FCP −1.2 to −2 s on every page | PERF-001 |
| Welcome | LCP | 9.91 s | LCP image `mainImage.jpg` is 2048×3072, 1.3 MB, shown at ~half viewport. Breakdown: load delay 2.24 s (found only after JS renders), render delay 7.2 s (decode of a 6 MP progressive JPEG on throttled CPU + font chain). | LCP to ~2.5 s, or removed entirely with FEAT-001 | PERF-002 |
| Dashboard | LCP | 4.32 s | LCP = card image `customer.png`; render delay 2.6 s from fonts + client render. PNG photos (72–100 KB) not WebP, no `width/height`. | −1 s | PERF-001, PERF-003 |
| Search / All Customers | LCP | 3.9–4.2 s | LCP element is the script-font heading (`.companyName` / `.searchdescription`), so LCP waits on fonts. | −1 to −1.5 s | PERF-001 |
| All pages | Render delay | 2.6–3.7 s | Client-side only render: nothing paints until 264 KB JS is parsed and React renders. | −0.3 s (small app; acceptable for an internal tool) | PERF-004 |
| All Customers (desktop) | CLS | 0.047 | Table appears after the fetch with no reserved space. | CLS → 0 | PERF-006 |
| All | CSS size | 248 KB raw / 33.6 KB gz | Full `bootstrap.min.css` imported; few components used; Lighthouse unused CSS ~32 KB. | −25 KB gz | PERF-005 |
| All | JS size | 264 KB raw / 84 KB gz | `react-dom` 48%, **`axios` 11% (30 KB)**, `react-bootstrap` 7%, router 6%; app code ~8%. One chunk, no splitting. | −10 KB gz (axios → fetch) | PERF-005 |
| All | TBT | 0 ms | No long tasks. | — | — |
| API | Response time | < 25 ms | 5 rows; `/somedata` returns all customers without paging. | Matters only at hundreds of customers | PERF-007 |
| Preview server | Caching | `serve` sends no long cache headers | Static assets re-validated each visit. Production server on the shop PC not chosen yet. | Faster repeat loads on tablets | PERF-008 |

## Findings (ranked by expected gain)

### PERF-001: Render-blocking, chained Google Fonts (3 families)
- Severity: High
- Where: `App.css:2-3`
- Evidence: two identical `@import url(https://fonts.googleapis.com/…)`; Lighthouse render-blocking 1.18 s (mobile, All Customers); FCP 3.5–3.7 s on every page.
- Cause: `@import` in CSS forces a serial request chain; external host needs DNS/TLS; display fonts used for LCP text.
- Impact: Slow first paint everywhere; app depends on internet access even on a LAN.
- Suggested direction: One self-hosted UI font (woff2, `font-display: swap`, preload), drop script fonts (UI-002).
- Effort: S
- Related: UI-002, K-011

### PERF-002: 1.3 MB hero image on the Welcome page
- Severity: High
- Where: `src/assets/mainImage.jpg`, `WelcomePage.js:29`
- Evidence: 2048×3072 px, 1,296 KB; LCP 9.91 s; Lighthouse image savings 1.19 MB.
- Cause: Original photo shipped as-is; no responsive sizes or modern format.
- Impact: Worst page by far.
- Suggested direction: Remove with FEAT-001; otherwise WebP/AVIF ≤ 100 KB with `srcset`.
- Effort: S
- Related: FEAT-001, K-010

### PERF-003: Card images are PNG photos without dimensions
- Severity: Low
- Where: `src/assets/{customer,measure,payment}.png`, `Card.js:13`
- Evidence: 72–100 KB each, 286×180, LCP on dashboard.
- Cause: Photos saved as PNG.
- Impact: Dashboard LCP 4.3 s mobile.
- Suggested direction: Replace with SVG icons in Phase 3 (UI-005), or WebP with width/height.
- Effort: S
- Related: UI-005

### PERF-004: Client-only rendering, single JS chunk
- Severity: Low
- Where: CRA build
- Evidence: render delay 2.6–3.7 s; one 84 KB gz chunk.
- Cause: CSR, no route splitting.
- Impact: Small for an internal LAN tool once fonts are fixed.
- Suggested direction: Lazy-load the form/detail views after the Vite move; no SSR needed.
- Effort: S
- Related: ARCH-005

### PERF-005: Full Bootstrap CSS and axios in the bundle
- Severity: Low
- Where: `index.js:4`, `package.json`
- Evidence: CSS 33.6 KB gz with ~32 KB unused; axios 30 KB raw.
- Cause: Global framework CSS import; HTTP library for 6 simple calls.
- Impact: Extra download and parse on tablets.
- Suggested direction: Decide in Phase 3 whether Bootstrap stays; use `fetch` in the API layer.
- Effort: M
- Related: ARCH-001, UI-003

### PERF-006: Layout shift when the table loads
- Severity: Low
- Where: `AllCustomer.js`
- Evidence: CLS 0.047 desktop, element `.table-container`.
- Cause: No loading placeholder.
- Impact: Minor jump.
- Suggested direction: Skeleton rows (comes with UX-003).
- Effort: S
- Related: UX-003

### PERF-007: No pagination on the customer list endpoint
- Severity: Low
- Where: `getSomeDetail`
- Evidence: `find({})` with no limit.
- Cause: Small data assumed.
- Impact: Grows linearly with customers; fine for years at one shop.
- Suggested direction: Server-side search + paging together with NEW-002.
- Effort: S
- Related: K-112, NEW-002

### PERF-008: No production static server with caching/compression
- Severity: Low
- Where: deployment (not decided)
- Evidence: `serve` preview, Lighthouse cache-insight 1.4 MB.
- Cause: No production setup yet.
- Impact: Repeat loads on tablets re-download assets.
- Suggested direction: Let Express serve the built frontend from the same origin with long cache headers and gzip (also solves ARCH-001).
- Effort: S
- Related: ARCH-001, SEC-001
