# Backlog (single source of truth, both repos)

Score = (Impact × 2) + Effort + Risk reduction + Unblocks, each 1–5 (Effort 5 = S … 1 = XL). Max 25.
**Override** = Critical/High security, data loss, or broken key flow: always at the top of its phase.
Repo: FE = `tailor_Management_REACT`, BE = `tailor_Management_Server`.

| Rank | ID | Title | Area | Severity | Impact | Effort | Risk | Unblocks | Score | Phase | Depends on | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | SEC-001 | Restrict API access on shop Wi-Fi (same origin, allowed origin, shop PIN per device — owner decision) — BE+FE | SEC | High · Override | 5 | 3 | 5 | 3 | 21 | 2 | ARCH-001 | Done (P2: BE 146d9a8, FE 93d05f4) |
| 2 | UX-001 | Detail shows correct status after updates; no stale customer while loading (incl. UX-002) — FE | UX | High · Override | 5 | 5 | 4 | 1 | 20 | 2 | TEST-001 | Done (P2: FE, with UX-002) |
| 3 | UX-005 | Confirm (or undo) before deleting a customer — FE | UX | High · Override | 4 | 5 | 5 | 1 | 19 | 2 | TEST-001 | Done (P2: FE 147d738) |
| 4 | SEC-006 | Persistent DB volume, scheduled backup, tested restore — BE/ops | SEC | High · Override | 4 | 5 | 5 | 1 | 19 | 2 | — | Done (P2: BE 2ff2f6d; restore drill 2026-10-20) |
| 5 | ARCH-001 | API module + configurable/same-origin base URL; Express serves built UI — FE+BE | ARCH | High | 5 | 3 | 4 | 5 | 22 | 2 | — | Done (P2: BE d4d222c, FE 6dd467c) |
| 6 | TEST-001 | Safety net: API integration tests + 6 E2E flows + seed script — FE+BE | TEST | High | 4 | 3 | 5 | 5 | 21 | 2 | — | Done (P2: BE 12cf8dd, FE E2E) |
| 7 | SEC-003 | Server validation: enums, numeric measurement/price types, proper 400s (incl. ARCH-006 numeric part) — BE | SEC | Medium | 4 | 3 | 4 | 3 | 18 | 2 | TEST-001 | Done (P2: BE ce06314, FE 41cff4c) |
| 8 | ARCH-005 | Move CRA → Vite + Vitest; remove unused deps (ARCH-004); upgrade runtime libs; add Prettier — FE | ARCH | Medium | 3 | 3 | 4 | 4 | 17 | 2 | TEST-001 (E2E) | Done (P2: FE 33a95f9, moved before deps) |
| 9 | TEST-003 | GitHub Actions CI: lint, build, tests, E2E — FE+BE | TEST | Medium | 3 | 4 | 4 | 3 | 17 | 2 | TEST-001 | Done (P2: CI both repos, all blocking) |
| 10 | SEC-002 | JSON error middleware, no stack traces, `NODE_ENV=production` — BE | SEC | Medium | 3 | 5 | 4 | 2 | 17 | 2 | — | Done (P2: BE c6f97d7) |
| 11 | UX-003 | Distinct loading / error (retry) / empty states on list, detail, search (incl. PERF-006) — FE | UX | High | 4 | 4 | 3 | 1 | 16 | 2 | ARCH-001 | Done (P2: FE 9f2dc5e, + UX-011) |
| 12 | UX-004a | Add form: show API errors, success message, close on success, saving state (incl. UX-010) — FE | UX | High | 4 | 4 | 3 | 1 | 16 | 2 | ARCH-001 | Done (P2: FE b32e2a6, + UX-010) |
| 13 | SEC-005 | Upgrade server deps (Express, Mongoose) to current majors; drop deprecated options — BE | SEC | Medium | 3 | 3 | 4 | 2 | 15 | 2 | TEST-001 | Done (P2: see phase-2/upgrades.md) |
| 14 | SEC-007 | Request/error logging to rotating file — BE | SEC | Low | 2 | 5 | 3 | 1 | 13 | 2 | SEC-002 | Done (P2: BE 6c41c8f) |
| 15 | ARCH-009 | README per repo + "run at the shop" guide (PC, tablets, backup) — FE+BE | ARCH | Low | 2 | 5 | 2 | 2 | 13 | 2 | ARCH-001, SEC-006 | Done (P2: BE 99fcf2e, FE c3d9c8f) |
| 16 | ARCH-007 | Atomic customer number counter — BE | ARCH | Medium | 2 | 5 | 3 | 1 | 12 | 2 | TEST-001 | Done (P2: BE be7447f) |
| 17 | SEC-004 | Security headers, hide `X-Powered-By` — BE | SEC | Low | 1 | 5 | 2 | 1 | 10 | 2 | ARCH-001 | Done (P2: BE) |
| 18 | UI-003 | Component library + migrate all screens (Button, TextField, RadioGroup, Dialog, ConfirmDialog, StatusBadge, Toast, Empty/Error/Loading, Card); covers A11Y-003/004/005/008, RESP-006, K-009 — FE | UI | Medium | 5 | 2 | 3 | 5 | 20 | 3 | UI-001 | To do |
| 19 | UI-001 | New brand direction + design tokens (color, type, spacing, radius, shadow); accessible status colors (A11Y-002) — FE | UI | Medium | 4 | 3 | 2 | 5 | 18 | 3 | owner approval | To do |
| 20 | UX-008 | AppShell: header/nav/main, active state, page `h1`, 404, start on dashboard, remove Logout + Welcome (FEAT-001, UI-006, A11Y-006, RESP-003, RESP-005) — FE | UX | Medium | 4 | 4 | 1 | 4 | 17 | 3 | UI-003 | To do |
| 21 | ARCH-003 | Scoped styles on tokens; remove global Bootstrap overrides and dead CSS (K-019); decide Bootstrap's future — FE | ARCH | Medium | 3 | 3 | 3 | 4 | 16 | 3 | UI-001 | To do |
| 22 | UI-002 | One self-hosted UI font, no script fonts, no `@import` (fixes PERF-001) — FE | UI | Medium | 4 | 5 | 1 | 2 | 16 | 3 | UI-001 | To do |
| 23 | A11Y-001 | Responsive, keyboard-accessible DataTable for customers (incl. RESP-002) — FE | A11Y | High | 4 | 3 | 3 | 2 | 16 | 3 | UI-003 | To do |
| 24 | RESP-001 | Dashboard grid that fits 320–1920 (tablet first) — FE | RESP | High | 4 | 5 | 1 | 1 | 15 | 3 | UI-003 | To do |
| 25 | RESP-004 | Fluid form and detail layouts, labels above inputs, fieldset/legend groups (incl. A11Y-009) — FE | RESP | High | 4 | 4 | 1 | 2 | 15 | 3 | UI-003 | To do |
| 26 | UI-005 | Replace photos with brand icons/illustrations; correct alt (A11Y-007, PERF-003) — FE | UI | Low | 2 | 5 | 1 | 1 | 11 | 3 | UI-001 | To do |
| 27 | PERF-002 | Hero image: close (Welcome removed) or ship ≤100 KB WebP with srcset — FE | PERF | High | 3 | 5 | 1 | 1 | 13 | 4 | UX-008 | To do |
| 28 | PERF-008 | Production serving: long cache headers + gzip/brotli for static assets — BE | PERF | Low | 3 | 4 | 1 | 1 | 12 | 4 | ARCH-001 | In progress (compression added in P2; cache headers left) |
| 29 | PERF-009 | Lighthouse CI budgets (mobile perf ≥ 90, LCP < 2.5 s) — FE | PERF | Low | 2 | 4 | 2 | 1 | 11 | 4 | TEST-003 | To do |
| 30 | PERF-004 | Route-level code splitting (form/detail views) — FE | PERF | Low | 2 | 4 | 1 | 1 | 10 | 4 | ARCH-005 | To do |
| 31 | PERF-005 | Trim CSS (unused Bootstrap) and remaining heavy deps — FE | PERF | Low | 2 | 3 | 1 | 1 | 9 | 4 | ARCH-003 | To do |
| 32 | UX-004b | Redesign add customer (page/panel, inline validation, numeric inputs with units, single Save, discard warning) as shared CustomerForm — FE | UX | High | 5 | 3 | 2 | 3 | 18 | 5 | UI-003, SEC-003 | To do |
| 33 | UI-004 | Redesign customer detail (summary header, measurements grid, actions on top) — FE | UI | Medium | 4 | 3 | 1 | 2 | 14 | 5 | UI-003 | To do |
| 34 | UX-006 | Reversible status changes with specific confirm text — FE | UX | Medium | 3 | 5 | 2 | 1 | 14 | 5 | UI-004 | To do |
| 35 | A11Y-010 | Full a11y verification: axe 0 serious, VoiceOver on 3 flows, 200% zoom — FE | A11Y | Medium | 3 | 4 | 3 | 1 | 14 | 5 | Phase 3 | To do |
| 36 | SEO-001 | App name, per-page titles, brand icons, installable manifest for tablets — FE | SEO | Low | 3 | 5 | 1 | 1 | 13 | 5 | UI-001 | To do |
| 37 | UX-009 | Copy pass + glossary; fix typos; neck labels Color/Ban → Collar/Band — FE+BE | UX | Low | 2 | 5 | 1 | 1 | 11 | 5 | — | To do |
| 38 | SEO-002 | `robots.txt` disallow + `noindex` — FE | SEO | Low | 1 | 5 | 1 | 1 | 9 | 5 | — | To do |
| 39 | ARCH-006 | Data model split: Customer + Order collections, migration — BE+FE | ARCH | Medium | 4 | 2 | 3 | 3 | 16 | 6 | SEC-003 | To do |
| 40 | NEW-002 | Search by name/phone/ID + quick filters (pending, unpaid, due soon) in customer list, server query + paging (replaces FEAT-007; incl. UX-007, PERF-007) — FE+BE | NEW | — | 5 | 3 | 1 | 1 | 15 | 6 | A11Y-001 | To do |
| 41 | NEW-001 | Edit customer details with measurement history — FE+BE | NEW | — | 5 | 3 | 1 | 1 | 15 | 6 | UX-004b | To do |
| 42 | NEW-003 | Order history per customer (due date, advance + balance) — FE+BE | NEW | — | 4 | 1 | 1 | 2 | 12 | 6 | ARCH-006, NEW-001 | To do |
| 43 | NEW-004 | Printable A4/A5 bill (no measurements) — FE | NEW | — | 3 | 3 | 1 | 1 | 11 | 6 | NEW-003 | To do |

### Added during Phase 2

| Rank | ID | Title | Area | Severity | Impact | Effort | Risk | Unblocks | Score | Phase | Depends on | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| — | UX-011 | Enter in the search box reloaded the page — FE | UX | Medium | 3 | 5 | 2 | 1 | 14 | 2 | — | Done (P2: FE 9f2dc5e) |
| — | DEP-001 | Decide React 19 (+ react-router 8, needs React 19) together with the Phase 3 UI library choice; React 19 adds ~23 KB gz — FE | ARCH | Low | 2 | 3 | 2 | 2 | 11 | 3 | UI-003 decision | To do |
| — | DEP-002 | Optional dev-tool majors: ESLint 10, globals 17, mongodb-memory-server 11, jest-dom 7, react-hooks plugin 7 (clears the lint-only brace-expansion advisory) — FE+BE | ARCH | Low | 1 | 4 | 2 | 1 | 9 | 4 | — | To do |

## Phase 0 known issues → backlog

| Phase 0 ID | Backlog item | | Phase 0 ID | Backlog item |
|---|---|---|---|---|
| K-001 | ARCH-001 | | K-101 | Closed: reconstruction accepted (original unavailable) |
| K-002 | SEC-001, UX-008 (login removed by owner decision) | | K-102 | SEC-001 |
| K-003 | UX-005 | | K-103 | SEC-002 |
| K-004 | RESP-001, A11Y-001, UX-008, RESP-004 | | K-104, K-105, K-106 | SEC-003 |
| K-005 | UX-001 (confirmed) | | K-107 | ARCH-007 |
| K-006 | UX-004a, UX-004b | | K-108 | SEC-003 (numeric), ARCH-006 (split) |
| K-007 | NEW-002 | | K-109 | SEC-005 |
| K-008 | ARCH-005 | | K-110 | ARCH-001 |
| K-009 | UI-003 | | K-111 | NEW-001 |
| K-010 | PERF-002 | | K-112 | NEW-002 |
| K-011 | UI-002 | | K-113 | SEC-002, SEC-005 |
| K-012, K-013, K-014 | ARCH-005 | | K-114 | ARCH-009, TEST-001 |
| K-015 | SEO-001 | | K-115 | TEST-001 (seed script) |
| K-016 | UI-003, A11Y-001, UI-005 | | | |
| K-017 | UX-009 | | | |
| K-018 | UX-008 | | | |
| K-019 | ARCH-003 | | | |
| K-020 | ARCH-009 | | | |
| K-021 | ARCH-005 (Prettier), TEST-003 | | | |
| K-022 | Done in Phase 0 | | | |
