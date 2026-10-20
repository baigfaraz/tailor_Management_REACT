# Phase 2 — Dependency Upgrades

Every change, both repos. BE = server, FE = web app. Commits on `improvement`.

## Runtime

| Package | From | To     | Type  | Reason                         | Breaking changes handled                                                                                                         | Backlog ID | Repo / branch                   |
| ------- | ---- | ------ | ----- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| Node.js | 20   | 24 LTS | major | Node 20 end-of-life April 2026 | `.nvmrc`, `engines`; npm 11 blocks install scripts → `allowScripts` denies esbuild, fsevents, mongodb-memory-server (not needed) | SEC-005    | BE+FE `phase-2/runtime-node-24` |

## Server (BE)

| Package                                                   | From   | To                             | Type                | Reason                                                          | Breaking changes handled                                                                                                                      | Backlog ID          | Branch                                                      |
| --------------------------------------------------------- | ------ | ------------------------------ | ------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------- |
| express                                                   | 4.18.2 | 4.22.3 → 5.3.0                 | minor, then major   | high advisories (body-parser, path-to-regexp, qs, cookie, send) | Express 5: `req.body` undefined without parsable body → `req.body ?? {}`; regex SPA route and error middleware unchanged                      | SEC-005             | `sec-005-patch-minor`, `deps-express-5`                     |
| mongoose                                                  | 7.4.5  | 7.8.12 → 8.24.5 → 9.11.2       | minor, major, major | critical advisory; v7 unmaintained                              | removed `useNewUrlParser`/`useUnifiedTopology`; `{ new: true }` → `{ returnDocument: "after" }`; pipeline update needs `updatePipeline: true` | SEC-005             | `sec-005-patch-minor`, `deps-mongoose-8`, `deps-mongoose-9` |
| dotenv                                                    | 16.3.1 | 18.0.8                         | major               | current major                                                   | logs by default → `config({ quiet: true })`                                                                                                   | SEC-005             | `deps-dotenv`                                               |
| cors                                                      | 2.8.5  | 2.8.6                          | patch               | current                                                         | —                                                                                                                                             | SEC-005             | `sec-005-patch-minor`                                       |
| compression                                               | —      | 1.8.2                          | new                 | restore gzip/brotli lost when Express started serving the UI    | —                                                                                                                                             | ARCH-001 regression | `fix-compression`                                           |
| nodemon (dev)                                             | 3.0.1  | removed                        | —                   | vulnerable chokidar/braces chain                                | `npm run dev` → `node --watch`                                                                                                                | SEC-005             | `deps-node-watch`                                           |
| vitest (dev)                                              | 2.1.4  | 2.1.9 → 5.0.5                  | patch, major        | critical (tinypool), vite/esbuild advisories                    | needs Node 22+ and `vite` peer → `vite` 8.3.4 added as dev dependency                                                                         | SEC-005             | `sec-005-patch-minor`, `deps-vitest-5`                      |
| eslint, @eslint/js (dev)                                  | 9.13.0 | 9.39.5                         | minor               | advisory                                                        | —                                                                                                                                             | SEC-005             | `sec-005-patch-minor`                                       |
| globals, supertest, prettier, mongodb-memory-server (dev) | —      | 15.15.0, 7.3.1, 3.9.10, 10.4.3 | minor               | current within major                                            | —                                                                                                                                             | SEC-005             | `sec-005-patch-minor`                                       |

Added in Phase 2 (dev): eslint 9, prettier 3, vitest, supertest, mongodb-memory-server (TEST-001/TEST-003).

## Web app (FE)

| Package                                                                             | From                 | To                           | Type              | Reason                                    | Breaking changes handled                                     | Backlog ID        | Branch                                                     |
| ----------------------------------------------------------------------------------- | -------------------- | ---------------------------- | ----------------- | ----------------------------------------- | ------------------------------------------------------------ | ----------------- | ---------------------------------------------------------- |
| react-scripts (CRA)                                                                 | 5.0.1                | removed → vite               | major (toolchain) | unmaintained; ~95 advisories; broken Jest | Vite config, `.jsx`, `VITE_API_BASE`, ESLint flat config     | ARCH-005          | `arch-005-vite`                                            |
| vite (dev)                                                                          | —                    | 5.4.10 → 5.4.21 → 8.3.4      | new, patch, major | toolchain; advisories                     | none needed                                                  | ARCH-005, SEC-005 | `arch-005-vite`, `deps-patch-minor`, `deps-vite-8`         |
| @vitejs/plugin-react (dev)                                                          | —                    | 4.3.3 → 6.1.2                | major             | with vite 8                               | none                                                         | SEC-005           | `deps-vite-8`                                              |
| vitest (dev)                                                                        | —                    | 2.1.4 → 2.1.9 → 5.0.5        | major             | advisories                                | none                                                         | SEC-005           | `deps-vite-8`                                              |
| jsdom (dev)                                                                         | —                    | 25.0.1 → 30.1.3              | major             | with vitest 5                             | none                                                         | SEC-005           | `deps-vite-8`                                              |
| axios                                                                               | 1.4.0                | 1.20.0                       | minor             | high advisories                           | none                                                         | SEC-005           | `deps-patch-minor`                                         |
| react, react-dom                                                                    | 18.2.0               | 18.3.1                       | minor             | current 18.x                              | none                                                         | SEC-005           | `deps-patch-minor`                                         |
| react-router-dom                                                                    | 6.15.0               | 6.30.6 → react-router 7.18.4 | minor, major      | open-redirect advisory                    | package renamed; a `Link` without `to` now throws → Card fix | SEC-005           | `deps-patch-minor`, `deps-react-router-7`, `fix-card-link` |
| bootstrap, react-bootstrap, react-bootstrap-icons                                   | 5.3.1, 2.8.0, 1.10.3 | 5.3.8, 2.10.10, 1.11.6       | patch/minor       | current                                   | none (visual baseline unchanged)                             | SEC-005           | `deps-patch-minor`                                         |
| @playwright/test (dev)                                                              | —                    | 1.48.2 → 1.64.1              | minor             | current                                   | browser download                                             | SEC-005           | `deps-patch-minor`                                         |
| testing-library, eslint 9.39.5, eslint-plugin-react 7.37.5, globals, prettier (dev) | —                    | latest in major              | minor             | current                                   | none                                                         | SEC-005           | `deps-patch-minor`                                         |

Removed (FE): `react-scripts`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `web-vitals` (unused, ARCH-004), `serve` (no longer used by E2E), `eslint-plugin-react-refresh` (added then unused).

## Tried and not kept

| Package          | Tried  | Why not                                                                                    | Follow-up                                       |
| ---------------- | ------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| react, react-dom | 19.3.1 | all tests pass but JS grows 95.7 → 118.5 KB gz (+24%); React 18.3.1 has no open advisories | DEP-001 (decide with Phase 3 UI library choice) |
| react-router     | 8.5.0  | requires React ≥ 19.2.7                                                                    | DEP-001                                         |

## Remaining (recorded, not done)

| Repo    | Package                         | Current         | Latest         | Note                     |
| ------- | ------------------------------- | --------------- | -------------- | ------------------------ |
| BE + FE | eslint, @eslint/js              | 9.39.5          | 10.x           | dev tool major; optional |
| BE + FE | globals                         | 15.15.0         | 17.x           | dev; optional            |
| BE      | mongodb-memory-server           | 10.4.3          | 11.x           | dev; optional            |
| FE      | @testing-library/jest-dom       | 6.6.2           | 7.x            | dev; optional            |
| FE      | eslint-plugin-react-hooks       | 5.0.0           | 7.x            | dev; optional            |
| FE      | react, react-dom / react-router | 18.3.1 / 7.18.4 | 19.3.1 / 8.5.0 | DEP-001                  |

## Audit after Phase 2

| Repo    | Phase 0                   | Phase 2    | Remaining                                                                                                                                                                                                 |
| ------- | ------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server  | 12 (1 critical, 6 high)   | **0**      | —                                                                                                                                                                                                         |
| Web app | 103 (5 critical, 37 high) | **1 high** | `brace-expansion` via `eslint-plugin-react` → `minimatch@3`: lint-time only, never shipped or run on user input. Accepted; goes away with eslint-plugin-react's next minimatch bump or ESLint 10 tooling. |

Raw outputs: `raw/backend-audit.txt`, `raw/frontend-audit.txt`, `raw/*-outdated.txt`.
