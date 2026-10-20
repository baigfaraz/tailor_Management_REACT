// Shared E2E setup: empty test database per test, API helpers, and a reroute of
// the app's hardcoded http://localhost:5000 calls (ARCH-001) to the test API.
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

const test = base.test.extend({
  api: async ({ request }, use) => {
    const health = await request.get(`http://127.0.0.1:${CONTROL_PORT}/health`);
    base.expect((await health.json()).e2e).toBe(true);
    await request.post(`http://127.0.0.1:${CONTROL_PORT}/reset`);

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
  page: async ({ page, api }, use) => {
    void api; // ensure the database is reset before the page loads
    await page.route("http://localhost:5000/**", (route) =>
      route.continue({
        url: route.request().url().replace(":5000", `:${API_PORT}`),
      }),
    );
    await use(page);
  },
});

module.exports = { test, expect: base.expect, customerInput };
