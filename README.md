# Tailor Management System — Web App

React app for a tailor shop: add customers with measurements, see all customers, search by number, and track order and payment status. It talks to the API in [tailor_Management_Server](https://github.com/baigfaraz/tailor_Management_Server), which also serves this app at the shop.

## Requirements

- Node 24 (`.nvmrc`; e.g. `fnm install 24 && fnm use`)
- The server repo cloned next to this one as `../backend` (for development and E2E tests)

## Development

```bash
npm ci
npm start            # Vite dev server, http://localhost:3000
```

Start the API too (`npm run dev` in `../backend`, port 5000); the dev server proxies `/api` to it. Each new browser asks for the shop PIN once (`SHOP_PIN` in the server's `.env`).

To call an API on another address, build with `VITE_API_BASE=http://<address>:5000` and list this app's origin in the server's `CORS_ORIGINS`. Normally not needed: at the shop the server serves the built app from the same address.

## Build

```bash
npm run build        # output in build/ (the server's WEB_DIST points here)
npm run preview      # serve the build locally on port 3000
```

## Checks

```bash
npm run lint
npm run format:check
npm test             # component tests (Vitest + Testing Library)
npm run build && npm run test:e2e    # Playwright E2E, desktop + tablet
npm run test:visual  # local-only screenshot comparison
```

E2E tests start the server from `../backend` (or `SERVER_DIR`) on port 5100 with an in-memory database, so they never touch real data and can run while your dev servers are up. See `docs/improvement/phase-2/testing-guide.md`.

CI (GitHub Actions) runs lint, format check, unit tests, build and E2E on every push and pull request.

## Running at the shop

See the server README's "Running at the shop" section: build this app, set `WEB_DIST=../frontend/build` in the server's `.env`, start the server, and open `http://<computer-address>:5000` on each tablet.

## Project docs

`docs/improvement/`: Phase 0 baseline, Phase 1 audit (backlog and roadmap), Phase 2 stabilization. `CLAUDE.md` has the short version.
