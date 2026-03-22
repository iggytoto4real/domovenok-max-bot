import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages: приложение по адресу https://<user>.github.io/domovenok-max-bot/
  base: '/domovenok-max-bot/',
  server: {
    port: 5173,
    // В dev при пустом VITE_API_URL fetch идёт на /api → сюда, без CORS и без PNA (HTTPS→localhost).
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
  },
});

