# 01 — Context

Interview with the owner, 2026-10-20. This file is the reference for priorities in every later phase.

## Scope

Phase 1 covers both repos:
- `tailor_Management_REACT` (this repo): UI. All Phase 1 docs live here.
- `tailor_Management_Server`: API. Its `docs/improvement/phase-1/README.md` points here.

Findings use one ID space across both repos.

## Answers

| Topic | Answer | What it means for the plan |
|---|---|---|
| Purpose & users | One tailor shop. Shop owner and staff record customers, measurements, orders and payments. | Single tenant. No multi-shop data separation needed. |
| Devices | Desktop and tablet first. Mobile also matters (goal below). | Tablet (768–1024px) is the primary breakpoint. Phone must work but is secondary. |
| Hosting | Shop Wi-Fi (LAN). A shop PC runs frontend, API and database; tablets and phones connect over Wi-Fi. | The frontend must call the API by the PC's LAN address, not `localhost`. Anyone on the Wi-Fi can reach the API, so access control matters even without login. |
| Goals | Modern, consistent look. Works great on mobile. Reliable, tested code. | Phase 3 (design system), responsive work and Phase 2 tests carry the most weight. |
| Login | Not needed. | Remove the "login with Google" promise and the fake "Logout" link. Protect the API another way (see SEC-001). |
| Brand | New brand; Claude proposes a direction for approval in Phase 3. | Current purple palette is not a constraint. Draft tokens in `04-ui-consistency.md` are a starting point only. |
| Accessibility target | WCAG 2.2 AA. No legal requirement. | axe 0 serious/critical as the Phase 5 target. |
| Constraints | No deadline. Anything can change, including stack, data model and API. | Data model changes and the move off Create React App are allowed. No real customer data exists yet, so migrations are free. |
| Known complaints | None. | Priorities come from the audit and the goals. |
| Analytics / monitoring | None. | No usage data to rank pages. All 4 pages treated as key. |
| Original backend `package.json` | Not available anywhere. | The Phase 0 reconstruction is now the source of truth (K-101 closed as accepted). |
| Branch protection | Skipped by owner. | Keep work on `improvement` and task branches anyway. |

## Review decisions (2026-10-20)

- Approved: remove Welcome page, redesign Add customer and Customer detail, merge Search into the customer list.
- General approval: "anything that can be modified according to modern style and should be in the system, do it." Claude may modernise patterns and screens within the roadmap without asking each time; the Phase 3 brand direction is still shown before the migration.
- LAN protection: shop PIN per device.
- Neck style labels: "Color" / "Ban" mean Collar / Band.
- Roadmap order and targets approved as written.

## New feature ideas (details in `12-new-features.md`)

1. Edit customer details after creation.
2. Search by name or phone, not only numeric ID.
3. Order history per customer (several orders over time).
4. Print or share a receipt.
