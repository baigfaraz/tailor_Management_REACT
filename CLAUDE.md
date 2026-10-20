# Project: Tailor Management System — Frontend

## What this app does

A web app for tailors to record customers, their measurements, order details and prices. It also tracks order status and payment status. This repo is the React UI. The API lives in the separate server repo `tailor_Management_Server` (Express + MongoDB), usually cloned next to this one as `../backend`. At the shop the server also serves this app's build (one address for tablets).

## Stack

- React 18.3 + Vite 8, JavaScript only (no TypeScript), files `.jsx`
- Node 24 LTS (`.nvmrc`)
- npm only (`package-lock.json`); do not use yarn or pnpm. npm 11 install scripts are controlled by `allowScripts` in `package.json`
- Routing: `react-router` 7 (import from `"react-router"`)
- Styling: Bootstrap 5 + `react-bootstrap`, one global `src/App.css`, Google Fonts
- Data: `src/api/` (axios client with `/api` base, cookies, 15 s timeout; `customers.js`, `session.js`; `errors.js` maps errors to messages); `src/format.js` adds units (API stores numbers)
- Access: `DeviceGate` shows the shop PIN screen on a locked device; any 401 locks again
- Tests: Vitest + Testing Library (`src/**/*.test.jsx`), Playwright E2E (`e2e/`)

## Commands

- Install: `npm ci`
- Dev: `npm start` (http://localhost:3000; proxies `/api` to the server on port 5000)
- Build: `npm run build` (output `build/`, served by the server via `WEB_DIST`)
- Lint / format: `npm run lint`, `npm run format:check`
- Unit tests: `npm test`
- E2E: `npm run build && npm run test:e2e` (starts `../backend` on port 5100 with an in-memory DB; never touches Atlas)
- Visual baseline (local only): `npm run test:visual` (`-- --update-snapshots` after intended UI changes)
- Judge checks by exit code, not by the summary line

Testing guide: `docs/improvement/phase-2/testing-guide.md`.

## Structure

- `src/App.jsx`: `ErrorBoundary` → `DeviceGate` → routes (`/`, `/Home`, `/Home/AllCustomer`, `/Home/Search`, `*` → NotFound)
- `src/components/`: pages (`WelcomePage`, `HomePage`, `AllCustomer`, `SearchScreen`, `NotFound`) and pieces (`Header`, `Card`, `Searchbar`, `DetailModal` = add customer, `ShowDetailModal` = customer detail, `DeviceGate`, `ErrorBoundary`)
- `src/api/`: all server calls; `src/format.js`: display formatting
- `src/assets/`: images; `src/App.css`: all styles
- `e2e/`: Playwright specs and fixtures
- `docs/improvement/`: improvement-plan reports

## Conventions

- Branches: `master` = stable, `improvement` = integration, task branches `phase-N/<backlog-id>-<name>`
- Commits: `fix(<area>): ... [<backlog-id>]`, `test:`, `chore(deps):`, `ci:`, `docs:`; end with the Co-Authored-By line
- Bug fixes: failing test first (lowest level that covers it), then fix
- Tests query by role/label/text, never CSS classes
- Never commit `.env` files; env names in `.env.example` (server)
- Components are function components with hooks, default exports, PascalCase file names
- API field names use the `customer_` prefix; numbers are plain numbers

## Current improvement plan

- Phase 0: Setup & baseline ✅ (2026-10-20)
- Phase 1: Audit ✅ (2026-10-20)
- Phase 2: Stabilize ✅ (2026-10-20, tag `v1-stabilized`)
- Phase 3: UI foundation (design system) ← next
- Phase 4: Performance
- Phase 5: Polish existing features
- Phase 6: New features
- Phase 7: QA & release

Reports: `docs/improvement/phase-0/baseline-report.md`, `docs/improvement/phase-1/audit-report.md`, `docs/improvement/phase-2/phase-2-report.md`. Backlog (statuses): `docs/improvement/phase-1/backlog.md`; roadmap: `docs/improvement/phase-1/roadmap.md`.

## Owner decisions

- One shop; desktop/tablet first; runs on the shop Wi-Fi (PC serves, tablets connect)
- No login; API protected by a shop PIN per device
- New brand (Claude proposes); WCAG 2.2 AA; no deadline; anything may change
- Owner pre-approved modernising screens/patterns within the roadmap
- Database: MongoDB Atlas (free tier); daily backups via the server's `npm run backup`
- Direct merges into `improvement` (solo), no PRs

## Handle with care

1. `src/App.css` (global, overrides Bootstrap `.row`/`.col`)
2. `src/components/DetailModal.jsx` (only create path, 16 `useState`s)
3. `src/components/ShowDetailModal.jsx` (status updates)
4. `src/components/AllCustomer.jsx` (list states, delete)
5. `src/components/DeviceGate.jsx` + `src/api/client.js` (access, 401 handling)
6. server `src/controllers/customerDetailController.js`, `src/models/customerDetailModel.js`, `src/app.js`

## Rules for changes

- Small, focused changes; one task per branch
- Run lint, unit tests, build and E2E before merging (exit code 0)
- Compare against the baseline (Lighthouse median of 3, screenshots) when changing UI or performance
