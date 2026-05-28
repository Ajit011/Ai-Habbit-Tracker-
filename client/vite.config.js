import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Is plugin ko import karein

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // <-- 2. Isko plugins array ke andar add karein
  ],
})