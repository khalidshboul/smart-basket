import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'aleah-nonoperational-cordia.ngrok-free.dev',
      'all',
    ],
    hmr: {
      clientPort: 443,
    },
    /*proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },*/
  }
})
