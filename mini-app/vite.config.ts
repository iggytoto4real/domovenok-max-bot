import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages учти, что приложение может открываться не из корня домена.
  // Если репозиторий публичный и Pages по адресу:
  //   https://<user>.github.io/domovenok-max-bot/
  // то base имеет смысл выставить в '/domovenok-max-bot/'.
  // По умолчанию оставляем корень, чтобы не ломать локальный dev.
  base: '/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});

