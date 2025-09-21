import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 Important for production deployments like Render
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
