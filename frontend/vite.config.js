import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".", 
  build: {
    outDir: "dist",
  },
  server: {
    open: true,
    port: 3000,
    proxy: {
      "/api/v1": {
        target: "http://localhost:4000",
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
});
