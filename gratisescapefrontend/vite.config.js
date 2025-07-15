import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      global: "globalthis",
      process: "process/browser",
      buffer: "buffer",
    },
  },
  define: {
    global: "globalThis",
  },
  server: {
    proxy: {
      "/richieste": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/chat": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      // aggiungi altre rotte se necessario
    },
  },
});
