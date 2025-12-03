

// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { PROJECT_ROOT } from "./packages/utils/projectRoot";

export default defineConfig({
  plugins: [react(),tailwindcss(),],

  // Critical: Makes Vite resolve paths exactly like TypeScript
  resolve: {
    alias: {
      // Main app source — most common import
      "@": path.join(PROJECT_ROOT, "apps/rentals/src"),
      "@pg": path.resolve(__dirname, "apps/pg/src"),
      // Shared UI, hooks, utils, services — clean and scalable
      "@rentalsshared": path.join(PROJECT_ROOT, "apps/rentals/src/app/shared"),
       "@rentalsroutes": path.join(PROJECT_ROOT, "apps/rentals/src/routes"),
       "@rentalsservices/*": path.join(PROJECT_ROOT, "apps/rentals/src/app/shared/services/*"),
      // Truly shared packages (ui, config, types, etc.) — future-proof
      "@packages": path.join(PROJECT_ROOT, "packages"),

      // Optional shortcuts (used by 90% of senior teams)
      "@ui": path.join(PROJECT_ROOT, "apps/rentals/src/shared/ui"),
      "@hooks": path.join(PROJECT_ROOT, "apps/rentals/src/hooks"),
     
      "@utils": path.join(PROJECT_ROOT, "apps/rentals/src/utils"),
      "@store": path.join(PROJECT_ROOT, "apps/rentals/src/store"),
    },
  },

  // Your app lives here — Vite serves from rentals/
  root: "apps/rentals",

  // Build output
  build: {
    outDir: "../../dist/rentals",
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    open: true,
    host: true,
  },
});