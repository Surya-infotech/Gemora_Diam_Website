import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
  },
  optimizeDeps: {
    include: ['country-state-city', 'lucide-react', 'react-router-dom'],
  },
})
