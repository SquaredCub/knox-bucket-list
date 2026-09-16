import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// GitHub Pages serves the site from /<repo-name>/.
// The deploy workflow sets BASE_PATH automatically; locally it stays "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        bingo: resolve(import.meta.dirname, 'bingo/index.html'),
      },
    },
  },
});
