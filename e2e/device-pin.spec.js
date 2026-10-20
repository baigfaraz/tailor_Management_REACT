// Shop PIN per device (SEC-001).
const { test, expect, SHOP_PIN } = require("./fixtures");

test.use({ unlocked: false });

test("a new device must enter the shop PIN before seeing customers", async ({
  page,
  api,
}) => {
  await api.createCustomer({ customer_name: "Ali Raza" });
  await page.goto("/Home/AllCustomer");

  await expect(
    page.getByLabel("Enter the shop PIN to use this device"),
  ).toBeVisible();
  await expect(page.getByText("Ali Raza")).toHaveCount(0);

  await page.getByLabel("Enter the shop PIN to use this device").fill(SHOP_PIN);
  await page.getByRole("button", { name: "Unlock" }).click();

  await expect(page.getByRole("row", { name: /Ali Raza/ })).toBeVisible();

  // The device stays unlocked after a reload.
  await page.reload();
  await expect(page.getByRole("row", { name: /Ali Raza/ })).toBeVisible();
});

test("a wrong PIN shows an error and keeps the device locked", async ({
  page,
}) => {
  await page.goto("/Home");
  await page.getByLabel("Enter the shop PIN to use this device").fill("0000");
  await page.getByRole("button", { name: "Unlock" }).click();

  await expect(page.getByRole("alert")).toHaveText("Wrong PIN.");
  await expect(page.getByRole("link", { name: "All Customers" })).toHaveCount(
    0,
  );
});
