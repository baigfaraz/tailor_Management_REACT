# Testing Guide

Both repos. Tests never use the real (Atlas) database: the server tests and the E2E server run MongoDB in memory (`mongodb-memory-server`) and refuse any non-local address.

## What runs where

| Suite            | Repo   | Tool                                   | Command                                | In CI                                     |
| ---------------- | ------ | -------------------------------------- | -------------------------------------- | ----------------------------------------- |
| API integration  | server | Vitest + Supertest + in-memory MongoDB | `npm test`                             | ✅ blocking                               |
| Component / unit | web    | Vitest + Testing Library + jsdom       | `npm test`                             | ✅ blocking                               |
| End-to-end       | web    | Playwright (desktop 1440 + tablet 768) | `npm run build && npm run test:e2e`    | ✅ blocking                               |
| Visual baseline  | web    | Playwright `toHaveScreenshot`          | `npm run test:visual`                  | ❌ local only (screenshots differ per OS) |
| Lint / format    | both   | ESLint 9, Prettier 3                   | `npm run lint`, `npm run format:check` | ✅ blocking                               |

Judge a run by its exit code (`echo $?` → `0`), not by the summary line: Vitest can print "all passed" and still fail on an uncaught error.

## Server tests (`backend/test/`)

- `test/helpers/db.js`: `startDb()`, `clearDb()` (empties every collection), `stopDb()`.
- `test/helpers/fixtures.js`: `customerInput(overrides)` builds a valid create body.
- Build an app with `createApp({ shopPin: "2468", sessionSecret: "<32+ chars>" })`. For protected routes use a Supertest agent unlocked with `POST /api/session { pin }`.
- File naming: `test/<area>.test.js`. One `describe` per endpoint or module.
- The first run downloads the MongoDB binary (cached in `~/.cache/mongodb-binaries`).

## Component tests (`frontend/src/**/*.test.jsx`)

- Mock the API modules, not axios: `vi.mock("../api/customers", () => ({ ... }))`.
- Wrap components that use links in `<MemoryRouter>` (from `react-router`).
- Query by role, label or visible text (`getByRole`, `getByLabelText`); avoid CSS classes, because Phase 3 changes the markup.
- Setup: `src/test/setup.js` (jest-dom matchers, cleanup).

## End-to-end tests (`frontend/e2e/`)

- `playwright.config.js` starts `npm run start:e2e` in the server repo (`../backend`, or set `SERVER_DIR`). That server:
  - runs on port 5100 with an in-memory MongoDB and serves `frontend/build` (production-like, one origin);
  - uses fixed PIN `2468` and never reads `.env`;
  - offers test-only control endpoints on `127.0.0.1:5155` (`/health`, `/reset`).
- Fixtures (`e2e/fixtures.js`):
  - `api`: resets the database and gives `createCustomer`, `listCustomers`, `getCustomer` for seeding and checking.
  - `page`: unlocks the device (PIN) unless the spec sets `test.use({ unlocked: false })`; aborts any request to port 5000 (dev API with real data); fails the test on any uncaught page error.
- Build first: E2E tests the built app (`npm run build`).
- To simulate failures, intercept with `page.route(...)`. Use `route.fallback()`, not `route.continue()`, when another handler must still apply.
- To check that something never appears (e.g. stale data), use an immediate check (`expect(await locator.count()).toBe(0)`), because `toHaveCount(0)` retries and can hide a brief flash.
- Visual baselines live in `e2e/visual.spec.js-snapshots/`. After an intended UI change: `npm run test:visual -- --update-snapshots`, review the images, commit.

## Writing a regression test for a bug

1. Reproduce it in the lowest level that covers it (API test < component test < E2E).
2. Write the test, run it, see it fail for the right reason.
3. Fix, see it pass, run the full suite (exit code 0).
4. Name the test after the behavior and put the backlog ID in the title, e.g. `(UX-001)`.

## Test data

- Server tests and E2E start empty every test. Seed through the API helpers.
- For a local demo database, create customers through the app or the API; never copy production data into tests or fixtures.
