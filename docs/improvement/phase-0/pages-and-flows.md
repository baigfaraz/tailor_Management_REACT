# Pages and Key Flows

Source: `src/App.js` (react-router-dom v6, `BrowserRouter`). Confirmed with owner on 2026-10-20.

## Routes

| Route | Page name | Component | Auth needed | Notes |
|---|---|---|---|---|
| `/` | Welcome | `WelcomePage` | No | Split screen hero. Text promises "login with Google", but no login exists. "Get Started" links to `/Home`. |
| `/Home` | Dashboard | `HomePage` | No (should be) | Three cards: Add Customer (opens modal), All Customers, Search. |
| `/Home/AllCustomer` | All Customers | `AllCustomer` | No (should be) | Table from `GET /somedata`. Row click opens detail modal. Trash icon deletes at once. |
| `/Home/Search` | Search | `SearchScreen` | No (should be) | Lookup by numeric customer ID only. |
| any other path | (none) | — | — | No catch-all route. Unknown URLs render a blank page. |

Modals (not routes): `DetailModal` (add customer, full screen, with confirm modal), `ShowDetailModal` (customer detail, with confirm modal for status changes).

There is no authentication. "Logout" in the header is a plain link to `/`.

## Key flows

1. **Add customer**
   1. `/Home`, click "Add Customer" card button.
   2. Fill name, contact, 7 measurements, dress type (Kurta/Shalwar), neck type (Color/Ban), upper pocket, number of suits, price per suit, payment status, order status.
   3. Click "Add Detail", then "Confirm" in the small modal.
   4. `POST /api/customerDetail`. On success the form clears; the large modal stays open. No success or error message is shown.
2. **View all customers and detail**
   1. `/Home`, click "All Customers".
   2. `GET /api/customerDetail/somedata` fills the table.
   3. Click a row: `GET /api/customerDetail/:id`, detail modal opens.
3. **Search customer by ID**
   1. `/Home`, click "Search".
   2. Type a customer ID, click "Check".
   3. Found: detail modal opens. Any error: "Customer Not Found."
4. **Mark order complete**
   1. Open a customer detail (flow 2 or 3) whose order status is "Pending".
   2. Click "Order Complete", then "Confirm".
   3. `PUT /api/customerDetail/orderStatus/:id`. Modal closes.
5. **Mark payment complete**
   1. Same as flow 4 with "Complete Payment".
   2. `PUT /api/customerDetail/paymentStatus/:id`.
6. **Delete customer**
   1. `/Home/AllCustomer`, click the trash icon on a row.
   2. `DELETE /api/customerDetail/delete/:id` runs at once. No confirmation. Table reloads.

Missing flow promised by the UI: Google login (see K-002).
