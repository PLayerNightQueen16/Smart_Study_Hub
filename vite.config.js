import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcoords from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/Smart_Study_Hub/',
  plugins: [react(), tailwindcoords()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
