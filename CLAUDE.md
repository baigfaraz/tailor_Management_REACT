# Project: Tailor Management System — Frontend

## What this app does
A web app for tailors to record customers, their measurements, order details and prices. It also tracks order status and payment status. This repo is the React UI. The API lives in the separate server repo `tailor_Management_Server` (Express + MongoDB), usually cloned next to this one as `../backend`.

## Stack
- React 18.2 with Create React App (`react-scripts` 5.0.1, unmaintained), JavaScript only (no TypeScript)
- Node 20 (`.nvmrc`)
- npm only (`package-lock.json`); do not use yarn or pnpm
- Routing: `react-router-dom` 6
- Styling: Bootstrap 5 + `react-bootstrap`, one global `src/App.css`, Google Fonts. `@mui/material` and Emotion are installed but unused.
- Data: `axios` called directly in components; local `useState` only
- Tests: Jest + Testing Library via CRA (currently broken, see K-008)

## Commands
- Install: `npm ci`
- Dev: `npm start` (http://localhost:3000)
- Build: `npm run build`
- Preview production build: `npx serve@14.2.4 -s build -l 3000`
- Test: `CI=true npm test -- --watchAll=false`
- Lint: `npx eslint src`

The API must run on http://localhost:5000 (hardcoded, K-001). On macOS, turn off AirPlay Receiver to free port 5000.

## Structure
- `src/App.js`: routes (`/`, `/Home`, `/Home/AllCustomer`, `/Home/Search`)
- `src/components/`: pages (`WelcomePage`, `HomePage`, `AllCustomer`, `SearchScreen`) and pieces (`Header`, `Card`, `Searchbar`, `DetailModal` = add customer, `ShowDetailModal` = customer detail)
- `src/assets/`: images
- `src/App.css`: all styles
- `docs/improvement/`: improvement-plan reports

## Conventions
- Branches: `master` = stable, `improvement` = integration, task branches `phase-N/...`, `fix/...`, `feat/...`
- Never commit `.env` files
- Components are function components with hooks, default exports, PascalCase file names
- API field names use the `customer_` prefix (for example `customer_orderStatus`)

## Current improvement plan
- Phase 0: Setup & baseline ✅ (2026-10-20)
- Phase 1: Audit ✅ (2026-10-20)
- Phase 2: Stabilize  ← next (starts with safety-net tests)
- Phase 3: UI foundation (design system)
- Phase 4: Performance
- Phase 5: Polish existing features
- Phase 6: New features
- Phase 7: QA & release

Baseline report: `docs/improvement/phase-0/baseline-report.md`. Known issues: `docs/improvement/phase-0/known-issues.md` (frontend K-0xx; server K-1xx in the server repo).

Phase 1 (system-wide, both repos): `docs/improvement/phase-1/audit-report.md`, backlog `docs/improvement/phase-1/backlog.md`, roadmap `docs/improvement/phase-1/roadmap.md`.

## Owner decisions (Phase 1)
- One shop; desktop/tablet first; runs on the shop Wi-Fi (PC serves, tablets connect)
- No login. Protect the API with a shop PIN per device
- New brand (Claude proposes); WCAG 2.2 AA; no deadline; anything may change
- Owner pre-approved modernising screens/patterns within the roadmap

## Handle with care (Top-10 hotspots)
1. `src/components/ShowDetailModal.js` (stale status bug UX-001)
2. `src/components/DetailModal.js` (only create path)
3. `src/App.css` (global, overrides Bootstrap `.row`/`.col`)
4. `src/components/AllCustomer.js` (delete without confirm)
5. server `backend/controllers/customerDetailController.js`
6. server `backend/models/customerDetailModel.js`
7. server `backend/server.js`
8. `src/components/SearchScreen.js`
9. `src/components/Card.js`
10. `src/App.js`

## Rules for changes
- Small, focused changes; one task per branch
- Run lint, build and tests before committing
- Compare against the Phase 0 baseline (Lighthouse, screenshots) when changing UI or performance
