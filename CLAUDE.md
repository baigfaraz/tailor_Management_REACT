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
- Phase 0: Setup & baseline  ← done (2026-10-20)
- Phase 1: Audit
- Phase 2: Stabilize
- Phase 3: UI foundation (design system)
- Phase 4: Performance
- Phase 5: Polish existing features
- Phase 6: New features
- Phase 7: QA & release

Baseline report: `docs/improvement/phase-0/baseline-report.md`. Known issues: `docs/improvement/phase-0/known-issues.md` (frontend K-0xx; server K-1xx in the server repo).

## Rules for changes
- Small, focused changes; one task per branch
- Run lint, build and tests before committing
- Compare against the Phase 0 baseline (Lighthouse, screenshots) when changing UI or performance
