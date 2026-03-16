import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. Data Management (TanStack Query, Axios, Zod)
            if (id.includes('@tanstack') || id.includes('axios') || id.includes('zod')) {
              return 'vendor-data';
            }
            // 2. State Management
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'vendor-state';
            }
            // 3. Everything else (React, icons, utilities) — single chunk avoids circular deps
            return 'vendor-react';
          }
        },
      },
    },
    // Increase chunk size warning slightly now that we've intentionally split them
    chunkSizeWarningLimit: 600,
  },
})
