import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 3000,
    // Dev: the API runs on port 5000 (backend `npm run dev`); same-origin /api.
    // VITE_API_PROXY lets local tooling point the dev server at another API.
    proxy: { "/api": process.env.VITE_API_PROXY || "http://localhost:5000" },
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
