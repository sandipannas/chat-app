// vite.config.js
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ws: false, // prevent ws from being resolved
    },
  },
  optimizeDeps: {
    exclude: ["ws"], // don’t prebundle ws
  },
  build: {
    rollupOptions: {
      external: ["ws"], // extra safety
    },
  },
})
