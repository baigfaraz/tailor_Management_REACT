# Roadmap (Phases 2–6)

Approved by the owner on 2026-10-20.

Baseline numbers are from Phase 0 (`../phase-0/baseline-report.md`) unless noted. Effort sizes: S ≈ ½–1 day, M ≈ 2–3 days, L ≈ 1 week, XL ≈ 2+ weeks (one developer with Claude).

## Phase 2 — Stabilize

**Goal:** Make the app safe to run on the shop Wi-Fi and safe to change.

Order of work:
1. TEST-001 safety net (API integration tests, 6 E2E flows, seed script)
2. TEST-003 CI in both repos
3. UX-001 wrong/stale status in detail
4. UX-005 delete confirmation
5. SEC-006 backups + restore test
6. ARCH-001 API module; Express serves the built UI from one origin
7. SEC-001 access control on the LAN: shop PIN per device (owner decision)
8. SEC-002 JSON errors, SEC-003 validation + numeric fields, ARCH-007 counter
9. UX-003 loading/error/empty states, UX-004a add-form feedback
10. ARCH-005 move to Vite + Vitest, runtime lib upgrades
11. SEC-005 server dependency upgrades
12. SEC-007 logging, SEC-004 headers, ARCH-009 READMEs

Dependencies: TEST-001 before every fix. ARCH-001 before SEC-001, UX-003, UX-004a. ARCH-005 after E2E exists (E2E proves the migration).
Parallel: BE items (SEC-002/003/005/007, ARCH-007) run in parallel with FE items (UX-001/005, UX-003, ARCH-005).
Size: 17 items ≈ 3 M + 1 L-ish + many S → about 2–3 weeks.

**Definition of done**
- 0 open Override/High items from Phase 2.
- API integration tests cover all 6 endpoints; 6 E2E flows pass in CI on every push (from 0 tests).
- `npm run build`, lint and tests pass in CI in both repos.
- Server `npm audit`: 0 critical/high (from 1/6). Frontend runtime deps: 0 high (from axios + react-router).
- A tablet on the same Wi-Fi loads real data from the PC; a device without the shop PIN/key gets 401.
- Backup runs on schedule; one restore done and documented.

## Phase 3 — UI foundation

**Goal:** A new, consistent brand built from tokens and accessible components, with every screen migrated onto it.

Order: UI-001 (brand + tokens, owner approves) → UI-002 font → ARCH-003 styling architecture → UI-003 components → UX-008 AppShell (Welcome removed, nav, 404) → A11Y-001 DataTable → RESP-001 dashboard grid → RESP-004 form/detail layout → UI-005 imagery.
Parallel: UI-005 imagery alongside components.
Size: 9 items ≈ 1 L + 4 M + S → about 2–3 weeks.

**Definition of done**
- ≤ 12 color tokens in use (from 19 raw values); 1 font family (from 3); 1 type scale (from 11 sizes); 1 spacing scale (from 15 values).
- 1 Button component with defined variants (from 4 styles); every screen uses library components; 0 global Bootstrap overrides.
- 0 horizontal overflow at 320, 375, 768, 1440, 1920 on every page (from 3 pages overflowing).
- axe: 0 critical (from 4 nodes `image-alt`).
- Components documented (usage page or README per component).

## Phase 4 — Performance

**Goal:** Fast first paint on tablets and phones.

Order (by expected gain): PERF-002 → PERF-008 → PERF-009 → PERF-004 → PERF-005. (The largest gain, PERF-001 fonts, lands in Phase 3 via UI-002; Phase 4 verifies it.)
Size: 5 items, mostly S → about 1 week.

**Definition of done**
- Lighthouse mobile performance ≥ 90 on every page (from 64–80).
- Mobile LCP < 2.5 s (from 3.9–9.9 s); FCP < 1.8 s (from 3.5–3.7 s); CLS < 0.1 (already 0–0.05).
- JS ≤ 80 KB gz (from 84.2 KB); CSS ≤ 15 KB gz (from 33.6 KB).
- 0 requests to external font hosts; budgets enforced in CI.

## Phase 5 — Polish existing features

**Goal:** Every existing page and flow feels finished on tablet and phone.

Order: UX-004b add customer → UI-004 detail → UX-006 status changes → UX-009 copy → SEO-001 app metadata/installable → SEO-002 → A11Y-010 verification pass.
Size: 7 items ≈ 2 M + S → about 2 weeks.

**Definition of done**
- axe 0 serious/critical on all pages and dialogs; Lighthouse accessibility ≥ 95 (from 77–96).
- VoiceOver pass on add, view/update, delete flows without blockers.
- Responsive matrix all ✅ (`06-responsive.md`).
- Heuristic scores ≥ 4 on every flow (from 1–4, `05-ux.md`).
- App installs to a tablet home screen with brand name and icon.

## Phase 6 — New features

**Goal:** Ship the owner's four ideas on the new foundation.

Order: NEW-002 search → NEW-001 edit → ARCH-006 Customer/Order split → NEW-003 order history → NEW-004 receipt.
Size: 1 XL + 3 M + 1 M/L → about 4–5 weeks.

**Definition of done**
- Each feature meets its brief in `12-new-features.md` with the owner's answers applied.
- Each feature has API tests and at least one E2E flow in CI.
- No Phase 4 budget or Phase 5 a11y target regresses.
