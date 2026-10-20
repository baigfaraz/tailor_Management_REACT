import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // Dev: the API runs on port 5000 (backend `npm run dev`); same-origin /api.
    proxy: { "/api": "http://localhost:5000" },
  },
  // Keep CRA's output folder so the server's WEB_DIST stays ../frontend/build.
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    css: false,
  },
});
