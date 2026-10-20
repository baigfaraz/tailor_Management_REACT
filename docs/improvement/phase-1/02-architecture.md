# 02 — Architecture & Code Quality

Commits audited: frontend `7e656ee`, server `e28e135`. Raw outputs in `raw/`.

## 2a. Structure map

```
frontend/ (CRA 5, React 18, client-side rendering only)
├── public/            index.html (title "React App"), CRA manifest/icons
└── src/
    ├── index.js       mounts <App/>, imports bootstrap.min.css globally
    ├── App.js         BrowserRouter + 4 routes
    ├── App.css        all styles (473 lines, global)
    ├── assets/        4 images (1 × 1.3 MB JPG)
    └── components/    10 files: pages + modals + small pieces, no sub-folders

server/backend/ (Express 4 + Mongoose 7, CommonJS)
├── server.js          app, cors(), body parsers, mounts router, listen(PORT||5000)
├── config/db.js       dotenv + mongoose.connect, exit(1) on failure
├── models/            CustomerDetail (1 collection, 17 fields)
├── controllers/       6 handlers
└── routes/            route table
```

**Request path, end to end (All Customers):**
`BrowserRouter` → `AllCustomer` page → `useEffect` → `axios.get("http://localhost:5000/api/customerDetail/somedata")` → Express router → `getSomeDetail` → `CustomerDetail.find({}, projection)` → JSON → `setSomeData` → table. Row click → second `axios.get(/:id)` → `setCustomerData` → `ShowDetailModal` (opens before the data arrives).

There is no layout component, no service/API layer, no shared state, no error boundary. Each page renders its own `<Header/>`.

## 2b. Component inventory

| Component | Path | Lines | Used by | Role | Flags |
|---|---|---|---|---|---|
| `DetailModal` | `src/components/DetailModal.js` | 415 | HomePage | Add-customer form + confirm modal + POST | **God component**: 16 `useState`, 11 near-identical field blocks, API call inline |
| `ShowDetailModal` | `src/components/ShowDetailModal.js` | 292 | AllCustomer, SearchScreen | Detail view + status mutations + confirm modal | **God component**; local "updated" state shadows server data (cause of UX-001) |
| `AllCustomer` | `src/components/AllCustomer.js` | 182 | route | List, delete, open detail | 3 API calls inline, same `onClick` repeated on 6 cells |
| `HomePage` | `src/components/HomePage.js` | 66 | route | Dashboard cards, hosts DetailModal | empty `searchCustomer` handler |
| `SearchScreen` | `src/components/SearchScreen.js` | 66 | route | ID lookup | API call inline |
| `WelcomePage` | `src/components/WelcomePage.js` | 33 | route | Landing | promises Google login |
| `Searchbar` | `src/components/Searchbar.js` | 30 | SearchScreen | Input + button | Bootstrap 4 class `mr-sm-2` |
| `Card` (`MainCard`) | `src/components/Card.js` | 28 | HomePage ×3 | Image card + button | `Button` wraps `Link` (nested interactive), inline style |
| `Header` | `src/components/Header.js` | 22 | 3 pages | Brand + nav | nav items are `h3`; fake "Logout" |
| `App` | `src/App.js` | 26 | index | Routes | no 404 |

Duplicates: 3 confirm-modal implementations (add, status change, none for delete). 4 button styles (see `04-ui-consistency.md`). Unused components: none. Dead files: none (`App.test.js` is stale, see TEST).

## 2c. Code health scans

| Scan | Result | File |
|---|---|---|
| Largest files | `App.css` 473, `DetailModal.js` 415, `ShowDetailModal.js` 292, controller 183 | `raw/file-sizes.txt`, `raw/backend-file-sizes.txt` |
| Churn | Only 3 frontend commits, 1 server commit. Churn is not a useful signal. | `raw/churn.txt` |
| Duplication (jscpd, ≥10 lines) | 1 clone, 16 lines: `updateOrderStatus` vs `updatePaymentStatus` in the controller. JSX repetition in `DetailModal` falls under the 10-line threshold per block but repeats 11 times. | `raw/jscpd/` |
| Circular deps (madge) | None | `raw/madge.txt` |
| Unused exports (knip 5.27) | Tool crashed (`ts.getDefaultLibFilePath is not a function`, JS-only project). Covered by depcheck (Phase 0) + manual CSS scan. | `raw/knip.txt` |
| TODO/FIXME | 0 | `raw/todos.txt` |
| `console.*` in src | 11 calls (debug `console.log(name)` and status logs left in) | — |
| Inline styles | 1 (`Card.js:10`) | `raw/inline-styles.txt` |
| CSS classes | 61 defined, 13 unused, 4 used but undefined | `raw/css-unused.txt`, `raw/css-used-undefined.txt` |

## 2d. Findings

### ARCH-001: No API layer; API base URL hardcoded in 7 call sites
- Severity: High
- Where: `AllCustomer.js:25,36,47`, `DetailModal.js:51`, `SearchScreen.js:16`, `ShowDetailModal.js:46,65`
- Evidence: `grep -rn "localhost:5000" src` → 7 hits. From a tablet on the shop Wi-Fi, `localhost` is the tablet itself, so every call fails; the UI shows "No data availaible to show!" (`screenshots/all-customers-api-down-1440.png`).
- Cause: Components call `axios` directly with literal URLs. No env variable, no shared client.
- Impact: The owner's target setup (PC + tablets over LAN) cannot work. Any URL change needs 7 edits. Errors are handled 4 different ways.
- Suggested direction: One API module (`src/api/customers.js`) with a base URL from build-time env or same-origin `/api` served by the PC; components call functions, not URLs.
- Effort: M
- Related: K-001, K-110, SEC-001, PERF-005

### ARCH-002: God components for add and detail modals
- Severity: Medium
- Where: `DetailModal.js` (415 lines, 16 `useState`), `ShowDetailModal.js` (292 lines)
- Evidence: 11 copy-paste `Form.Group` blocks differ only in label/state; reset code repeats every setter (`DetailModal.js:78-93`).
- Cause: No reusable field component; form state as separate hooks; data fetching, mutation and presentation in one file.
- Impact: Hard to add Edit (NEW-001) or validation without duplicating everything again.
- Suggested direction: Field config array + one form state object (or a form library), shared `CustomerForm` for add and edit.
- Effort: M
- Related: UX-004, NEW-001

### ARCH-003: Global stylesheet overrides Bootstrap and leaks across pages
- Severity: Medium
- Where: `src/App.css`
- Evidence: `.row { margin: 1rem 0 }` and `.col {…}` (`App.css:306-314`) redefine Bootstrap grid classes for the whole app. `.mainImage` defined twice (`:137`, `:223`). 13 unused classes (`CustomerDetails`, `Measurement*`, `CompleteButton`, …). Used but undefined: `textField`, `adjustContainer`, `mt-5`/`mr-sm-2` (`mr-sm-2` is Bootstrap 4; no effect in Bootstrap 5). Mixed naming: `PendingStatus`, `customModalHeader`, `table-container`.
- Cause: One global file grown by copy-paste; leftovers from the CRA template and an earlier version.
- Impact: Any style change can break another page. Phase 3 cannot build on it.
- Suggested direction: Scoped styles (CSS Modules) on top of design tokens; drop the global Bootstrap overrides.
- Effort: M
- Related: UI-001, UI-003

### ARCH-004: Unused and overlapping dependencies
- Severity: Low
- Where: `package.json`
- Evidence: depcheck (Phase 0): `@mui/material`, `@emotion/react`, `@emotion/styled`, `web-vitals` unused. Two UI kits installed.
- Cause: Experiments not cleaned up.
- Impact: Slower installs, more audit noise; no bundle impact (tree-shaken).
- Suggested direction: Remove during the toolchain move.
- Effort: S
- Related: K-014, ARCH-005

### ARCH-005: Create React App toolchain is unmaintained
- Severity: Medium
- Where: `react-scripts` 5.0.1
- Evidence: Build and test print the `babel-preset-react-app` "not maintained anymore" warning. 103 audit findings, nearly all under `react-scripts`. Jest cannot transform ESM `axios`.
- Cause: CRA was deprecated in 2025.
- Impact: Security noise that cannot be fixed in place; test setup friction; slower dev server.
- Suggested direction: Move to Vite + Vitest before writing the Phase 2 frontend tests.
- Effort: M
- Related: K-012, K-013, K-008, TEST-002

### ARCH-006: Data model stores numbers as strings with units; one order per customer
- Severity: Medium
- Where: `models/customerDetailModel.js`, `controllers/customerDetailController.js:78-88`
- Evidence: Saved document: `"customer_waist": "31 Inches"`, `"customer_orderPrice": "2500 Rs"`, `customer_noOfSuits` is `String`. Total is computed in the browser with `parseFloat("2500 Rs") * parseFloat("2")` (`ShowDetailModal.js:227`). Order fields (price, suits, statuses, design) live on the customer document.
- Cause: Display formatting mixed into storage; no separate Order entity.
- Impact: Edit (NEW-001) must strip units; sorting/totals fragile; order history (NEW-003) impossible without a schema change.
- Suggested direction: Numeric fields + unit in UI; split `Customer` (contact, measurements) and `Order` (design, price, suits, statuses, dates).
- Effort: L (split), S (numeric types)
- Related: K-108, NEW-001, NEW-003

### ARCH-007: Customer ID generated by max+1
- Severity: Medium
- Where: `customerDetailController.js:69-72`
- Evidence: `findOne().sort("-customer_id")` then `create(newId)`. Two tablets saving at once can read the same max; the second insert fails on the unique index → 500.
- Cause: Read-then-write without a counter or retry.
- Impact: Rare lost save once several devices are used (the LAN setup).
- Suggested direction: Atomic counter document (`findOneAndUpdate` with `$inc`) or retry on duplicate key.
- Effort: S
- Related: K-107

### ARCH-008: No error handling layer (frontend or server)
- Severity: Medium
- Where: server: no error middleware (`server.js`); frontend: no error boundary, every catch only logs.
- Evidence: Missing-field POST returns Express HTML stack trace (Phase 0). Frontend: 11 `console.*`, 0 user-visible error messages.
- Cause: Error paths never designed.
- Impact: Users see "No data" or nothing when something fails; details leak from the API.
- Suggested direction: Express error middleware returning JSON `{error}`; frontend API layer maps errors to a toast/inline message; one error boundary.
- Effort: M
- Related: SEC-002, UX-003, K-103

### ARCH-009: No project documentation
- Severity: Low
- Where: both repos
- Evidence: Frontend README is CRA boilerplate; server repo has no README.
- Cause: Never written.
- Impact: Setup knowledge lives only in CLAUDE.md files.
- Suggested direction: Short README per repo: what it is, how to run on the shop PC, how tablets connect.
- Effort: S
- Related: K-020, K-114

## 2e. Top 10 hotspots ("Handle with care")

Churn is too low to use, so ranking = size × responsibilities × known bugs × usage in key flows.

| # | File | Why risky |
|---|---|---|
| 1 | `src/components/ShowDetailModal.js` | Confirmed stale-status bug (UX-001), used by 2 pages, mutations + view mixed |
| 2 | `src/components/DetailModal.js` | Largest component, only path to create data, no validation |
| 3 | `src/App.css` | Global, overrides Bootstrap; every visual change touches it |
| 4 | `src/components/AllCustomer.js` | List + delete + detail; delete has no confirm |
| 5 | `backend/controllers/customerDetailController.js` | All business logic, ID race, no validation |
| 6 | `backend/models/customerDetailModel.js` | Schema change ripples to every screen |
| 7 | `backend/server.js` | CORS, port, error handling, LAN exposure |
| 8 | `src/components/SearchScreen.js` | Error = "not found" for every failure |
| 9 | `src/components/Card.js` | Nested interactive button/link pattern copied 3× |
| 10 | `src/App.js` | Routing, no 404, no layout |
