// Key flows from docs/improvement/phase-0/pages-and-flows.md (TEST-001).
// Tests marked "current bug" record today's behavior; the backlog item named in
// the test changes them.
const { test, expect } = require("./fixtures");

async function openAddCustomer(page) {
  await page.goto("/Home");
  await page.getByRole("link", { name: "Add Customer" }).click();
  await expect(
    page.getByRole("dialog").getByText("Add Customer Details"),
  ).toBeVisible();
}

async function fillCustomerForm(page, name) {
  const fields = [
    ["Name", name],
    ["Contact", "0300-7654321"],
    ["Waist", "34"],
    ["Bust", "40"],
    ["Upper Arm", "13"],
    ["Neck To Sleeve", "31"],
    ["Back", "17"],
    ["Neck To Shoulder", "8"],
    ["Leg Length", "41"],
    ["No of Suits", "3"],
    ["Price Per Suit", "2000"],
  ];
  for (const [label, value] of fields) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await page.getByLabel("Shalwar").check();
  await page.getByLabel("Color").check();
}

function customerRow(page, name) {
  return page.getByRole("row", { name: new RegExp(name) });
}

async function openCustomerFromList(page, name) {
  await customerRow(page, name)
    .getByRole("cell", { name, exact: true })
    .click();
  await expect(page.getByRole("dialog").getByText(name)).toBeVisible();
}

test.describe("1. Add customer", () => {
  test("creates a customer that appears in the list", async ({ page, api }) => {
    await openAddCustomer(page);
    await fillCustomerForm(page, "Bilal Ahmed");
    await page.getByRole("button", { name: "Add Detail" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByRole("status")).toHaveText(
      /Customer added: Bilal Ahmed \(Customer No 1\)/,
    );
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const [created] = await api.listCustomers();
    expect(created.customer_name).toBe("Bilal Ahmed");

    await page.goto("/Home/AllCustomer");
    await expect(customerRow(page, "Bilal Ahmed")).toBeVisible();
  });

  test("an incomplete form shows the error and keeps the form open (UX-004a)", async ({
    page,
    api,
  }) => {
    await openAddCustomer(page);
    const response = page.waitForResponse(
      (r) => r.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Add Detail" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    expect((await response).status()).toBe(400);
    expect(await api.listCustomers()).toHaveLength(0);
    await expect(page.getByRole("alert")).toHaveText(
      "Please add all details. Thankyou!",
    );
    await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
  });
});

test.describe("2. View customers and detail", () => {
  test("lists customers and shows full detail with total", async ({
    page,
    api,
  }) => {
    await api.createCustomer({ customer_name: "Ali Raza" });
    await api.createCustomer({
      customer_name: "Sara Khan",
      customer_noOfSuits: "3",
    });

    await page.goto("/Home/AllCustomer");
    await expect(customerRow(page, "Ali Raza")).toBeVisible();
    await expect(customerRow(page, "Sara Khan")).toBeVisible();

    await openCustomerFromList(page, "Sara Khan");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("38 Inches")).toBeVisible();
    await expect(dialog.getByText("7500 Rs")).toBeVisible();
  });

  test("shows the empty message when there are no customers", async ({
    page,
  }) => {
    await page.goto("/Home/AllCustomer");
    await expect(page.getByText("No data availaible to show!")).toBeVisible();
  });

  test("an unreachable API shows an error with Retry, not an empty list (UX-003)", async ({
    page,
    api,
  }) => {
    await api.createCustomer({ customer_name: "Ali Raza" });
    await page.route("**/api/customerDetail/**", (route) => route.abort());
    await page.goto("/Home/AllCustomer");

    const alert = page.getByRole("alert");
    await expect(alert).toContainText("Could not reach the shop computer");
    await expect(page.getByText("No data availaible to show!")).toHaveCount(0);

    await page.unroute("**/api/customerDetail/**");
    await alert.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByRole("row", { name: /Ali Raza/ })).toBeVisible();
  });
});

test.describe("3. Search by ID", () => {
  test("opens the customer for a known ID", async ({ page, api }) => {
    await api.createCustomer({ customer_name: "Usman Tariq" });
    await page.goto("/Home/Search");
    await page.getByPlaceholder("Enter Customer-ID").fill("1");
    await page.getByRole("button", { name: "Check" }).click();
    await expect(
      page.getByRole("dialog").getByText("Usman Tariq"),
    ).toBeVisible();
  });

  test("searches when Enter is pressed (UX-011)", async ({ page, api }) => {
    await api.createCustomer({ customer_name: "Usman Tariq" });
    await page.goto("/Home/Search");
    await page.getByPlaceholder("Enter Customer-ID").fill("1");
    await page.getByPlaceholder("Enter Customer-ID").press("Enter");
    await expect(
      page.getByRole("dialog").getByText("Usman Tariq"),
    ).toBeVisible();
  });

  test("says not found for an unknown ID", async ({ page }) => {
    await page.goto("/Home/Search");
    await page.getByPlaceholder("Enter Customer-ID").fill("999");
    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByText("Customer Not Found.")).toBeVisible();
  });
});

test.describe("4–5. Mark order and payment complete", () => {
  for (const [button, column, field] of [
    ["Order Complete", "order", "customer_orderStatus"],
    ["Complete Payment", "payment", "customer_paymentStatus"],
  ]) {
    test(`"${button}" updates the ${column} status`, async ({ page, api }) => {
      await api.createCustomer({ customer_name: "Ayesha Malik" });
      await page.goto("/Home/AllCustomer");
      await openCustomerFromList(page, "Ayesha Malik");

      await page.getByRole("button", { name: button }).click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect
        .poll(async () => (await api.getCustomer(1))[field])
        .toBe("Complete");
      await expect(page.getByRole("dialog")).toHaveCount(0);
    });
  }

  test("closing the confirmation keeps the status unchanged", async ({
    page,
    api,
  }) => {
    await api.createCustomer({ customer_name: "Ayesha Malik" });
    await page.goto("/Home/AllCustomer");
    await openCustomerFromList(page, "Ayesha Malik");

    await page.getByRole("button", { name: "Order Complete" }).click();
    await page
      .getByRole("dialog")
      .filter({ hasText: "Confirmation" })
      .getByRole("button", { name: "Close" })
      .click();

    expect((await api.getCustomer(1)).customer_orderStatus).toBe("Pending");
  });

  test("detail shows the stored status after another customer was updated (UX-001)", async ({
    page,
    api,
  }) => {
    await api.createCustomer({ customer_name: "Ayesha Malik" });
    await api.createCustomer({ customer_name: "Ali Raza" });
    await page.goto("/Home/AllCustomer");

    await openCustomerFromList(page, "Ayesha Malik");
    await page.getByRole("button", { name: "Order Complete" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await openCustomerFromList(page, "Ali Raza");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(/Order Status :\s*Pending/, {
      timeout: 3000,
    });
  });
});

test.describe("Detail data freshness (UX-002)", () => {
  test("never shows the previous customer while the next one loads", async ({
    page,
    api,
  }) => {
    await api.createCustomer({ customer_name: "Ali Raza" });
    await api.createCustomer({ customer_name: "Sara Khan" });
    await page.goto("/Home/AllCustomer");

    await openCustomerFromList(page, "Ali Raza");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Close" })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.route("**/api/customerDetail/2", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // fallback() keeps the fixture's reroute to the test API; continue() would skip it.
      await route.fallback();
    });
    await customerRow(page, "Sara Khan")
      .getByRole("cell", { name: "Sara Khan", exact: true })
      .click();
    await page.waitForTimeout(500);
    // Immediate check (no auto-retry): retrying would wait for the real data and hide the flash.
    expect(await page.locator(".modal").getByText("Ali Raza").count()).toBe(0);
    await expect(page.getByRole("dialog").getByText("Sara Khan")).toBeVisible();
  });
});

test.describe("6. Delete customer", () => {
  // Trash icon has no accessible name yet (A11Y-001); select it by position.
  const trash = (page, name) =>
    customerRow(page, name).locator("td").last().locator("svg");

  test("asks for confirmation, then removes the customer", async ({
    page,
    api,
  }) => {
    await api.createCustomer({ customer_name: "Hina Shah" });
    await api.createCustomer({ customer_name: "Sara Khan" });
    await page.goto("/Home/AllCustomer");

    await trash(page, "Hina Shah").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Hina Shah");
    expect(await api.listCustomers()).toHaveLength(2);

    await dialog.getByRole("button", { name: "Delete" }).click();

    await expect(customerRow(page, "Hina Shah")).toHaveCount(0);
    await expect(customerRow(page, "Sara Khan")).toBeVisible();
    expect((await api.listCustomers()).map((c) => c.customer_name)).toEqual([
      "Sara Khan",
    ]);
  });

  test("cancel keeps the customer", async ({ page, api }) => {
    await api.createCustomer({ customer_name: "Hina Shah" });
    await page.goto("/Home/AllCustomer");

    await trash(page, "Hina Shah").click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Cancel" })
      .click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(customerRow(page, "Hina Shah")).toBeVisible();
    expect(await api.listCustomers()).toHaveLength(1);
  });
});

test.describe("Navigation", () => {
  test("Welcome → Dashboard → All Customers via links", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(page).toHaveURL(/\/Home$/);
    await page.getByRole("link", { name: "All Customers" }).click();
    await expect(page).toHaveURL(/\/Home\/AllCustomer$/);
  });

  test("unknown routes show a not-found page with a way home", async ({
    page,
  }) => {
    await page.goto("/does-not-exist");
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Go to Home" }).click();
    await expect(page).toHaveURL(/\/Home$/);
  });
});
