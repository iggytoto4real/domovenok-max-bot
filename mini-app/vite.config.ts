import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages: приложение по адресу https://<user>.github.io/domovenok-max-bot/
  base: '/domovenok-max-bot/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});

