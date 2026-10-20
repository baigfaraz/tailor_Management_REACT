// End-to-end tests against a production-like setup: the server repo's API serves
// this app's build (WEB_DIST) from one origin, using an in-memory MongoDB
// (never Atlas). Port 5100 avoids the dev servers on 3000/5000.
const { defineConfig, devices } = require("@playwright/test");
const path = require("node:path");

const SERVER_DIR =
  process.env.SERVER_DIR || path.resolve(__dirname, "../backend");
const APP_PORT = 5100;
const CONTROL_PORT = 5155;

module.exports = defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Visual baselines are platform-specific; run them locally only.
  grepInvert: process.env.CI ? /@visual/ : undefined,
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "retain-on-failure",
  },
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
  webServer: {
    command: "npm run start:e2e",
    cwd: SERVER_DIR,
    url: `http://127.0.0.1:${CONTROL_PORT}/health`,
    env: {
      E2E_PORT: String(APP_PORT),
      E2E_CONTROL_PORT: String(CONTROL_PORT),
      WEB_DIST: path.resolve(__dirname, "build"),
    },
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
