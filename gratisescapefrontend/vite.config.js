import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      global: "globalthis", // ✅ per fixare `global is not defined`
      process: "process/browser",
      buffer: "buffer",
    },
  },
  define: {
    global: "globalThis",
  },
});
