# 03 — Feature Inventory

Decisions confirmed by the owner on 2026-10-20. The owner also gave general approval to modernise any screen or pattern that improves the system.

Walked in the production build (`serve -s build`) against the API on port 5000 with 5–6 fake customers.

| ID | Feature | Pages/Routes | Main files | Status | UX quality | Decision | Notes / finding IDs |
|---|---|---|---|---|---|---|---|
| FEAT-001 | Welcome / landing | `/` | `WelcomePage.js` | Works | Poor | **Remove (confirmed)**: open the app straight on the dashboard | Promises Google login that will not exist. Extra click on every visit. Hosts the 1.3 MB image (PERF-002). |
| FEAT-002 | Header navigation | all except `/` | `Header.js` | Works with bugs | Poor | Redesign | "Logout" goes to `/`; no login exists. No active-page state. UX-008 |
| FEAT-003 | Dashboard cards | `/Home` | `HomePage.js`, `Card.js` | Works with bugs | Acceptable | Redesign | Three photo cards. Overflow on tablet and phone (RESP-001). Nested button/link (A11Y-005). |
| FEAT-004 | Add customer | modal on `/Home` | `DetailModal.js` | Works with bugs | Poor | **Redesign (confirmed)**: own page or side panel, shared with Edit | No validation, no error/success feedback, 2-step confirm, fixed-width fields cut off on phone. UX-004, RESP-004 |
| FEAT-005 | Customer list | `/Home/AllCustomer` | `AllCustomer.js` | Works with bugs | Acceptable | Improve | Loading and API errors look like "no data" (UX-003). Not usable by keyboard (A11Y-001). Overflows on phone (RESP-002). |
| FEAT-006 | Customer detail | modal | `ShowDetailModal.js` | Works with bugs | Poor | **Redesign (confirmed)** | Shows wrong status after another update (UX-001, confirmed). Shows previous customer while loading (UX-002). Long single column. |
| FEAT-007 | Search by ID | `/Home/Search` | `SearchScreen.js`, `Searchbar.js` | Partially broken | Poor | **Merge into list (confirmed)** with NEW-002 | Text says "Name or Customer-ID"; only ID works. Every error shows "Customer Not Found." UX-007 |
| FEAT-008 | Mark order complete | detail modal | `ShowDetailModal.js` | Works with bugs | Acceptable | Fix | One-way in the UI; a mistake cannot be undone. UX-006 |
| FEAT-009 | Mark payment complete | detail modal | `ShowDetailModal.js` | Works with bugs | Acceptable | Fix | Same as FEAT-008. |
| FEAT-010 | Delete customer | list trash icon | `AllCustomer.js` | Works | Poor | Fix | No confirmation, no undo (UX-005). Icon not keyboard reachable. |
| FEAT-011 | Total payment | detail modal | `ShowDetailModal.js:227` | Works | Acceptable | Improve | Computed from strings with `parseFloat`; no advance/balance. ARCH-006, NEW-003 |

No dead or unused features found.

## Key flow walk-through notes

Friction points from each flow are logged in `05-ux.md`:
1. Add customer → UX-004, UX-010, RESP-004
2. View list and detail → UX-001, UX-002, UX-003, A11Y-001
3. Search → UX-007
4. Mark order complete → UX-001, UX-006
5. Mark payment complete → UX-001, UX-006
6. Delete → UX-005
