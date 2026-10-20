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
