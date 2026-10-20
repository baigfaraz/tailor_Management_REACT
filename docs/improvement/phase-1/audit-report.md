# Phase 1 Audit Report
Date: 2026-10-20   Commit: frontend `7e656ee`, server `e28e135`   Based on: Phase 0 baseline (`v0-baseline`)

## 1. Executive Summary

The Tailor Management System is a small app (about 2,000 lines across both repos) that does its basic job: staff can add a customer with measurements, see a list, open details, mark orders and payments complete, and delete. The code is simple and easy to follow, which makes the planned changes affordable.

It is not ready for the way the shop wants to use it. Tablets on the shop Wi-Fi cannot reach the data, because the app looks for the server on the tablet itself. Once that is fixed, anyone on the same Wi-Fi could read or delete every customer, since there is no access control. The detail screen can show the wrong order status after another update. Deleting takes one tap with no confirmation, and there is no backup. Failures look like "no customers" instead of an error. On phones and even tablets, some pages are wider than the screen. There are no working tests.

The good news: desktop speed is already good (Lighthouse 91–98), the data is small, and there is no real customer data yet, so the data model and toolchain can change freely.

**Scorecard**

| Code | UI consistency | UX | Responsive | Accessibility | Performance | Security | Testing |
|---|---|---|---|---|---|---|---|
| Fair | Poor | Poor | Poor | Fair | Fair | Poor | Poor |

**Top 10 issues**
1. ARCH-001: API address hardcoded to `localhost:5000`; tablets on the LAN cannot load data.
2. SEC-001: No access control; anyone on the shop Wi-Fi could read or delete all customers.
3. UX-001: Detail shows the wrong order/payment status after another update (confirmed).
4. UX-005: Delete with one tap, no confirmation or undo.
5. SEC-006: No backups of the shop's data.
6. UX-003: Loading and server errors look like an empty customer list.
7. UX-004: Add-customer form gives no validation, error or success feedback.
8. TEST-001: No working tests in either repo; no CI.
9. RESP-001/RESP-002/RESP-004: Dashboard overflows on tablet; list and forms break on phones.
10. PERF-001/PERF-002: Render-blocking fonts (FCP 3.5 s) and a 1.3 MB image (LCP 9.9 s) on mobile.

**Biggest opportunities**
- Serve UI and API from the shop PC on one address: fixes LAN access, removes CORS, enables a simple shop PIN, and gives caching (ARCH-001, SEC-001, PERF-008).
- A small component library on new brand tokens fixes most UI, responsive and accessibility findings at once (UI-001, UI-003).
- Dropping the script fonts and the Welcome page removes the two largest mobile performance costs.

## 2. Findings Count

| Area | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Architecture (ARCH) | 0 | 1 | 6 | 2 | 9 |
| UI consistency (UI) | 0 | 0 | 4 | 2 | 6 |
| UX | 0 | 4 | 4 | 2 | 10 |
| Responsive (RESP) | 0 | 3 | 2 | 1 | 6 |
| Accessibility (A11Y) | 0 | 1 | 7 | 1 | 9 |
| Performance (PERF) | 0 | 2 | 0 | 6 | 8 |
| Security & reliability (SEC) | 0 | 2 | 3 | 2 | 7 |
| SEO & metadata (SEO) | 0 | 0 | 0 | 2 | 2 |
| Testing (TEST) | 0 | 1 | 2 | 0 | 3 |
| **Total** | **0** | **14** | **28** | **18** | **60** |

Plus 11 features inventoried (`03-feature-inventory.md`) and 4 new-feature briefs (`12-new-features.md`). SEC-001 becomes Critical the day the app runs on the shop Wi-Fi.

## 3. Key Findings by Area

- **Architecture** ([02](02-architecture.md)): no API layer (ARCH-001); 400-line form component (ARCH-002); global CSS overriding Bootstrap (ARCH-003); CRA unmaintained (ARCH-005); numbers stored as strings with units, one order per customer (ARCH-006).
- **UI** ([04](04-ui-consistency.md)): 19 colors, 11 font sizes, 3 fonts incl. 2 script fonts, 4 button styles; draft token roles listed for Phase 3.
- **UX** ([05](05-ux.md)): wrong status (UX-001), stale detail while loading (UX-002), errors shown as empty (UX-003), silent add form (UX-004), unconfirmed delete (UX-005). Lowest heuristics: system status, error prevention, error recovery.
- **Responsive** ([06](06-responsive.md)): dashboard overflows by 80px on tablet and 277–304px on phones; table +165–220px on phones; forms fixed at 370px.
- **Accessibility** ([07](07-accessibility.md)): list unusable by keyboard (A11Y-001); 3 contrast failures; unnamed dialogs; nested button/link; missing alt text. Screen-reader check done via accessibility tree; a live VoiceOver pass is planned for Phase 5.
- **Performance** ([08](08-performance.md)): chained Google Fonts block first paint on every page; hero image 2048×3072 / 1.3 MB; axios is 11% of JS; full Bootstrap CSS.
- **Security & reliability** ([09](09-security-reliability.md)): open API on LAN (SEC-001), no backups (SEC-006), stack traces (SEC-002), weak validation (SEC-003), outdated server deps (SEC-005).
- **SEO** ([10](10-seo-metadata.md)): private LAN tool; only app name, titles and installable manifest matter.
- **Testing** ([11](11-testing.md)): 0 working tests, no CI; safety-net list defined.

## 4. Feature Decisions

| Feature | Decision |
|---|---|
| Welcome page (FEAT-001) | Remove; open on the dashboard (confirmed) |
| Header "Logout" (FEAT-002) | Remove; new navigation |
| Add customer (FEAT-004) | Redesign as a page/panel shared with Edit (confirmed) |
| Customer detail (FEAT-006) | Redesign (confirmed) |
| Search page (FEAT-007) | Merge into the customer list as name/phone search with filters (NEW-002, confirmed) |
| List, status changes, delete, total | Fix / improve |

## 5. New Features

| ID | Feature | Effort | Value | Depends on |
|---|---|---|---|---|
| NEW-002 | Search by name/phone | M | High | Phase 3 DataTable |
| NEW-001 | Edit customer | M | High | Shared CustomerForm (UX-004b) |
| NEW-003 | Order history | XL | High | Customer/Order split (ARCH-006) |
| NEW-004 | Print/share receipt | M | Medium | NEW-003 |

## 6. Roadmap Overview

Details and targets in [roadmap.md](roadmap.md); scored items in [backlog.md](backlog.md).

| Phase | Goal | Items | Size | Key target |
|---|---|---|---|---|
| 2 Stabilize | Safe on shop Wi-Fi, safe to change | 17 | ~2–3 weeks | 6 E2E flows in CI; 0 High open; PIN-protected API |
| 3 UI foundation | New brand, components, every screen migrated | 9 | ~2–3 weeks | ≤12 colors, 1 font, 0 overflow 320–1920 |
| 4 Performance | Fast on tablets and phones | 5 | ~1 week | Mobile Lighthouse ≥ 90, LCP < 2.5 s |
| 5 Polish | Every flow finished | 7 | ~2 weeks | axe 0 serious, heuristics ≥ 4 |
| 6 New features | Owner's 4 ideas | 5 | ~4–5 weeks | Each with tests |

## 7. Risks & Open Questions

Questions asked in the review (answers in section 8):
1. Remove the Welcome page and open straight on the dashboard?
2. Redesign Add customer and Customer detail (pages/panels instead of large modals)?
3. LAN protection: simple shop PIN on each device, or rely on a staff-only Wi-Fi?
4. NEW-001: keep a history of old measurements, or overwrite?
5. NEW-002: also filter by status?
6. NEW-003: delivery date? advance payment/balance? more order stages?
7. NEW-004: include measurements? printer type (thermal 58/80 mm or A4/A5)?
8. Neck options "Color" / "Ban": do they mean "Collar" / "Band"?

Risks:
- The reconstructed server dependency versions (K-101) are a guess; the Phase 2 upgrade replaces them anyway.
- Moving off CRA (ARCH-005) touches every build path; do it only after E2E tests exist.
- The audit used fake data (6 customers); performance with hundreds of customers is untested (PERF-007 covers paging).

## 8. Owner Decisions (review 2026-10-20)

| # | Question | Answer |
|---|---|---|
| 1 | Remove Welcome page | Yes |
| 2 | Redesign Add customer and detail | Yes. Plus general approval to modernise anything that fits the system. |
| 3 | LAN protection | Shop PIN per device |
| 4 | Measurement history | Keep history |
| 5 | Status filters | Yes: pending orders, unpaid, due soon |
| 6 | Order fields | Delivery/due date, advance + balance; statuses stay Pending/Complete |
| 7 | Receipt | Bill only, A4/A5 printer |
| 8 | Neck labels | Collar / Band |
| — | Roadmap | Approved as written |
