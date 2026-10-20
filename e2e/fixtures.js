// Shared E2E setup: empty test database per test and API helpers. The app and
// API share one origin (port 5100, in-memory MongoDB).
const base = require("@playwright/test");

const API_PORT = 5100;
const CONTROL_PORT = 5155;
const API = `http://localhost:${API_PORT}/api/customerDetail`;

function customerInput(overrides = {}) {
  return {
    customer_name: "Ali Raza",
    customer_contact: "0300-1234567",
    customer_waist: "32",
    customer_bust: "38",
    customer_upperArm: "12",
    customer_neckToSleeve: "30",
    customer_back: "16",
    customer_neckToShoulder: "7",
    customer_legLength: "40",
    customer_upperPocket: true,
    customer_dressDesign: "Kurta",
    customer_neckStyle: "Ban",
    customer_orderPrice: "2500",
    customer_orderStatus: "Pending",
    customer_paymentStatus: "Pending",
    customer_noOfSuits: "2",
    ...overrides,
  };
}

// PIN of the E2E server (scripts/e2e-server.js in the server repo).
const SHOP_PIN = "2468";
const SESSION = `http://localhost:${API_PORT}/api/session`;

const test = base.test.extend({
  // Set to false in a spec to start on a device that has not entered the PIN.
  unlocked: [true, { option: true }],
  api: async ({ request }, use) => {
    const health = await request.get(`http://127.0.0.1:${CONTROL_PORT}/health`);
    base.expect((await health.json()).e2e).toBe(true);
    await request.post(`http://127.0.0.1:${CONTROL_PORT}/reset`);
    await request.post(SESSION, { data: { pin: SHOP_PIN } });

    await use({
      createCustomer: async (overrides) => {
        const res = await request.post(API, { data: customerInput(overrides) });
        base.expect(res.status()).toBe(201);
        return res.json();
      },
      listCustomers: async () => (await request.get(`${API}/somedata`)).json(),
      getCustomer: async (id) => (await request.get(`${API}/${id}`)).json(),
    });
  },
  page: async ({ page, api, unlocked }, use) => {
    void api; // ensure the database is reset before the page loads
    // Defense in depth: nothing may reach the dev API on port 5000 (real Atlas data).
    await page.route("http://localhost:5000/**", (route) => route.abort());
    // Any uncaught error in the page fails the test.
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    if (unlocked) {
      // page.request shares the browser context's cookies.
      const res = await page.request.post(SESSION, { data: { pin: SHOP_PIN } });
      base.expect(res.status()).toBe(200);
    }
    await use(page);
    base.expect(pageErrors, "uncaught errors in the page").toEqual([]);
  },
});

module.exports = { test, expect: base.expect, customerInput, SHOP_PIN };
