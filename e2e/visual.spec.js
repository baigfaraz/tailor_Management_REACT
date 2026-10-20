// Visual regression baseline (local only, tagged @visual). Snapshots are
// platform-specific, so CI skips them. Run: npm run test:visual
const { test, expect } = require("./fixtures");

const pages = [
  ["welcome", "/"],
  ["dashboard", "/Home"],
  ["all-customers", "/Home/AllCustomer"],
  ["search", "/Home/Search"],
];

for (const [name, path] of pages) {
  test(`${name} looks unchanged @visual`, async ({ page, api }) => {
    await api.createCustomer({ customer_name: "Ali Raza" });
    await api.createCustomer({
      customer_name: "Sara Khan",
      customer_orderStatus: "Complete",
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
