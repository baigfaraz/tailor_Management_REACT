// End-to-end tests. The API runs from the server repo on an in-memory MongoDB
// (never Atlas). Ports avoid the dev servers on 3000/5000.
const { defineConfig, devices } = require("@playwright/test");
const path = require("node:path");

const SERVER_DIR =
  process.env.SERVER_DIR || path.resolve(__dirname, "../backend");
const WEB_PORT = 3100;
const API_PORT = 5100;
const CONTROL_PORT = 5155;

module.exports = defineConfig({
  testDir: "./e2e",
  globalSetup: require.resolve("./e2e/global-setup.js"),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Visual baselines are platform-specific; run them locally only.
  grepInvert: process.env.CI ? /@visual/ : undefined,
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: "retain-on-failure",
  },
  metadata: { apiPort: API_PORT, controlPort: CONTROL_PORT },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
  ],
  webServer: [
    {
      command: "npm run start:e2e",
      cwd: SERVER_DIR,
      url: `http://127.0.0.1:${CONTROL_PORT}/health`,
      env: { PORT: String(API_PORT), E2E_CONTROL_PORT: String(CONTROL_PORT) },
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: `npx serve -s build -l ${WEB_PORT}`,
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
