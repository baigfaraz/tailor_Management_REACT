# 12 — New Features

Ideas from the owner (`01-context.md`). Briefs only; specs are written in Phase 6. Open questions were answered on 2026-10-20.

### NEW-001: Edit customer details
- Problem it solves / who it's for: Staff fix typos and update measurements when a customer returns. Today a record cannot change except its two statuses.
- Rough user flow:
  1. Open a customer.
  2. Tap "Edit".
  3. Change contact or measurements.
  4. Save; see confirmation; detail shows new values.
- Affected existing pages/features: customer detail (FEAT-006), add form (FEAT-004).
- Depends on: shared `CustomerForm` (ARCH-002, UX-004), Phase 3 form components, numeric data model (ARCH-006), server validation (SEC-003).
- Backend/API changes needed: yes, `PUT /customers/:id`.
- Owner answer: keep measurement history (old values are kept with a date when edited).
- Rough effort: M
- Business value (user's view): High

### NEW-002: Search by name or phone
- Problem it solves / who it's for: Staff find a customer without remembering the number.
- Rough user flow:
  1. Open Customers.
  2. Type part of a name or phone.
  3. List filters as you type.
  4. Tap a result to open it.
- Affected existing pages/features: replaces the Search page (FEAT-007) with a search box on the customer list (FEAT-005).
- Depends on: list redesign (RESP-002, Phase 3 DataTable); server query + paging (PERF-007).
- Backend/API changes needed: yes, `GET /customers?q=` (name/phone/ID, case-insensitive, paged).
- Owner answer: yes, add quick filters (pending orders, unpaid, due soon).
- Rough effort: M
- Business value (user's view): High

### NEW-003: Order history per customer
- Problem it solves / who it's for: A returning customer places new orders; today each person can hold only one order, so staff would create duplicates.
- Rough user flow:
  1. Open a customer.
  2. See measurements once, plus a list of orders (date, items, price, statuses).
  3. Tap "New order" to add one using saved measurements.
  4. Update each order's status and payment separately.
- Affected existing pages/features: data model, add customer, detail, list status columns, totals.
- Depends on: data model split `Customer` + `Order` (ARCH-006), NEW-001 (editing measurements), Phase 3 components.
- Backend/API changes needed: yes, new `orders` collection and endpoints; migration of existing records (none real today).
- Owner answer: track delivery/due date and advance + balance. Keep order statuses Pending/Complete (no extra stages). Measurement history is handled in NEW-001.
- Rough effort: XL
- Business value (user's view): High

### NEW-004: Printable bill
- Problem it solves / who it's for: Customer gets a printed bill with order details, amount paid and balance.
- Rough user flow:
  1. Open an order.
  2. Tap "Receipt".
  3. Preview (shop name, customer, items, price, paid/balance, due date).
  4. Print on the shop's A4/A5 printer (browser print with print stylesheet).
- Affected existing pages/features: detail/order view.
- Depends on: NEW-003 (receipts are per order), brand from Phase 3 (shop name/logo).
- Backend/API changes needed: no (render in browser; print CSS).
- Owner answer: bill only (no measurements); printed on an A4/A5 printer. Share is optional, not required.
- Rough effort: M
- Business value (user's view): Medium

## Conflicts and ordering

- NEW-002 replaces FEAT-007; build it on the redesigned list, not the current Search page.
- NEW-001 and NEW-003 both change the data model; do ARCH-006 numeric types in Phase 2 and the Customer/Order split as the first step of NEW-003.
- NEW-004 waits for NEW-003.
- Order: NEW-002 → NEW-001 → NEW-003 → NEW-004.
