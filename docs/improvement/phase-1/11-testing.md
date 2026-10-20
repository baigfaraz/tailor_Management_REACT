# 11 — Testing

## Current state

| Item | Frontend | Server |
|---|---|---|
| Test files | 1 (`src/App.test.js`, CRA template) | 0 |
| Pass rate | 0/0 — suite fails to load (`Cannot use import statement outside a module`, axios ESM) | — |
| Coverage | not measurable | — |
| Type | none working | none |
| E2E | none | — |
| CI | none (no `.github/workflows`) | none |

## Coverage map

| Key flow / hotspot | Unit | Integration | E2E | Risk if untested |
|---|---|---|---|---|
| Add customer (`DetailModal`, `POST /`) | ❌ | ❌ | ❌ | High: only way to create data; redesign planned |
| List + detail (`AllCustomer`, `ShowDetailModal`, `GET /somedata`, `GET /:id`) | ❌ | ❌ | ❌ | High: UX-001 lives here |
| Search (`SearchScreen`) | ❌ | ❌ | ❌ | Medium |
| Order/payment status (`PUT …Status/:id`) | ❌ | ❌ | ❌ | High |
| Delete (`DELETE /delete/:id`) | ❌ | ❌ | ❌ | High: data loss |
| Controller validation and ID generation | ❌ | ❌ | — | High: changes in Phase 2 |
| Data model | ❌ | ❌ | — | High: schema changes planned |
| `App.css` / layout | — | — | ❌ visual | Medium: Phase 3 rewrites styles |

## Findings

### TEST-001: No tests anywhere
- Severity: High
- Where: both repos
- Evidence: table above.
- Cause: Never set up; the only test is the CRA template.
- Impact: Every Phase 2–6 change is unverified; UX-001 shipped unnoticed.
- Suggested direction: Safety net below before any fix.
- Effort: M
- Related: K-008

### TEST-002: Frontend test runner is broken
- Severity: Medium
- Where: `src/App.test.js`, CRA Jest config
- Evidence: `raw/test.log` (Phase 0).
- Cause: Stale template test + `setupTests.js` deleted + Jest not transforming ESM `axios`.
- Impact: `npm test` always fails.
- Suggested direction: Vitest + Testing Library after the Vite move (ARCH-005).
- Effort: S
- Related: ARCH-005

### TEST-003: No CI
- Severity: Medium
- Where: both repos
- Evidence: no workflow files.
- Cause: Not set up.
- Impact: Broken builds or tests can reach `improvement`/`master` unnoticed.
- Suggested direction: GitHub Actions per repo: install, lint, build, test on push and PR.
- Effort: S
- Related: TEST-001

## Safety net needed before Phase 2 fixes

Write these first, against current behavior (mark known bugs as expected failures where needed):

1. **Server API integration tests** (Jest or Vitest + Supertest + in-memory MongoDB): create, list, get by id, 404, both status updates, delete. Covers controller + model.
2. **E2E smoke (Playwright, against built frontend + API + test DB)**:
   1. Add customer → appears in list.
   2. Open detail from list → shows correct data.
   3. Mark order complete → list and detail agree; open a second customer → status correct (guards UX-001).
   4. Mark payment complete.
   5. Search by ID → detail opens; unknown ID → not found.
   6. Delete customer → removed (later: after confirm).
3. **CI** running 1 and 2 on every push/PR.

Component unit tests come in Phase 3 with the new components.
