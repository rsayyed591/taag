import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['uuid'],
    },
  },
  optimizeDeps: {
    include: ['uuid'],
  },
})
