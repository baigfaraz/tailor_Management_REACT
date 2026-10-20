# 09 — Security & Reliability (quick audit)

Front-line review, not a penetration test. The app stores names, phone numbers and body measurements of customers: personal data, but no payments or health data. Target setup: one shop PC on the shop Wi-Fi, no login (owner's choice).

Scans: `raw/raw-html.txt` (0 hits), `raw/token-storage.txt` (0 hits; no auth tokens exist). Build output checked for secrets: none (no env vars used).

| Area | Result |
|---|---|
| Secrets in bundle | ✅ none |
| Auth & sessions | ➖ none by design |
| Authorization | ❌ every endpoint open to anyone who can reach the PC (SEC-001) |
| Raw HTML rendering | ✅ none; React escapes output |
| Server-side validation | ❌ partial (SEC-003) |
| NoSQL injection | ✅ route params are strings; `{"$ne":1}` as status → CastError 500, not a query bypass |
| Headers | ❌ `X-Powered-By: Express`, `Access-Control-Allow-Origin: *`, no security headers (SEC-004) |
| Error exposure | ❌ stack traces with absolute paths (SEC-002) |
| Dependencies | ❌ server: 1 critical / 6 high (reconstructed 2023 versions); frontend: 103, mostly dev tooling (SEC-005) |
| Reliability: API down | ❌ UI shows "no data" (UX-003) |
| Reliability: backups | ❌ none; single MongoDB on one PC (SEC-006) |
| Logging / monitoring | ❌ console only |

## Findings

### SEC-001: Anyone on the shop Wi-Fi can read and delete all customer data
- Severity: High (becomes Critical as soon as the LAN setup goes live)
- Where: `server.js:10` (`cors()`), all routes; Express listens on all interfaces
- Evidence: `curl http://192.168.18.141:5000/api/customerDetail/somedata` → 200 from the LAN address. `Access-Control-Allow-Origin: *`. `DELETE /delete/:id` needs nothing.
- Cause: No access control by design (no login), open CORS, no network restriction.
- Impact: Shop Wi-Fi is often shared with customers. Any device on it, or any web page a staff tablet opens, can list names and phone numbers or delete every record.
- Suggested direction: Without adding login: serve UI and API from the same origin (no CORS), allow only that origin, add a simple shop access PIN or device key checked by the API, keep the PC on a staff-only network. Owner decides the PIN question in Phase 2.
- Effort: M
- Related: K-102, ARCH-001, PERF-008

### SEC-002: Stack traces and internal paths in API error responses
- Severity: Medium
- Where: `customerDetailController.js:64-65`, `server.js` (no error middleware)
- Evidence: `POST {}` → 400 HTML page with `at …/backend/controllers/customerDetailController.js:65:11`.
- Cause: `throw new Error` inside `asyncHandler` falls through to Express's default handler (dev mode).
- Impact: Leaks file paths; client gets HTML instead of JSON.
- Suggested direction: JSON error middleware; `NODE_ENV=production` on the shop PC.
- Effort: S
- Related: K-103, ARCH-008

### SEC-003: Incomplete server-side validation
- Severity: Medium
- Where: `setCustomerDetails`, `updateOrderStatus`, `updatePaymentStatus`
- Evidence: Status accepts any string (`"anything"` → 200). `GET /abc` → 500. Missing `customer_upperPocket` → 500. Numeric `0` rejected by truthiness check. `PUT {}` → 200 with no change.
- Cause: Hand-written truthiness checks; schema has no enums or numeric types.
- Impact: Bad data saved; wrong status codes confuse the UI.
- Suggested direction: Schema validation (enums, numbers, min/max) + request validation returning 400 with field errors.
- Effort: S
- Related: K-104, K-105, K-106, ARCH-006

### SEC-004: Missing security headers, framework fingerprint
- Severity: Low
- Where: `server.js`
- Evidence: `curl -I` shows `X-Powered-By: Express`; no CSP, `X-Content-Type-Options`, `frame-ancestors`.
- Cause: Express defaults.
- Impact: Low on a LAN; cheap to fix.
- Suggested direction: `helmet` (or equivalent headers) when Express serves the UI.
- Effort: S
- Related: SEC-001

### SEC-005: Vulnerable dependency versions
- Severity: Medium
- Where: server `package-lock.json`, frontend `package-lock.json`
- Evidence: Phase 0 audits. Reachable at runtime on the server: `express` 4.18.2 / `body-parser` / `path-to-regexp` (high), `mongoose` 7.4.5 (critical). Frontend runtime: `axios` 1.4.0, `react-router-dom` 6.15.0 (high). The other ~95 frontend items are CRA build tooling, not shipped.
- Cause: Versions from 2023.
- Impact: Known request-handling flaws reachable by anyone on the LAN.
- Suggested direction: Upgrade server to current Express/Mongoose majors; move frontend off CRA (ARCH-005) and upgrade runtime libs.
- Effort: M
- Related: K-012, K-109, ARCH-005

### SEC-006: No backup of the shop's data
- Severity: High
- Where: MongoDB on the shop PC (Docker volume or local install)
- Evidence: No backup script, export, or documented restore. Phase 0 runs MongoDB in a container without a named volume (`docker run … mongo:7`).
- Cause: Never planned.
- Impact: Disk failure, a bad delete (UX-005), or removing the container loses every customer's measurements.
- Suggested direction: Named volume + scheduled `mongodump` to a second location (USB/cloud) + documented restore; consider soft delete.
- Effort: S
- Related: UX-005

### SEC-007: No logging beyond the console
- Severity: Low
- Where: server
- Evidence: Only `console.log` at start-up; errors swallowed into generic 500 bodies.
- Cause: Not designed.
- Impact: Hard to diagnose problems at the shop.
- Suggested direction: Request + error logging to a file with rotation.
- Effort: S
- Related: ARCH-008

No **Critical** finding today, because the app is not running on the shop Wi-Fi yet. SEC-001 must be fixed before it does; the owner was told during the audit review.
