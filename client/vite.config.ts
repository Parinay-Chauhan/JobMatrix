import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@tanstack/react-query/')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/socket.io-client/')) {
            return 'vendor-socket';
          }
          if (id.includes('node_modules/sonner/')) {
            return 'vendor-ui';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
