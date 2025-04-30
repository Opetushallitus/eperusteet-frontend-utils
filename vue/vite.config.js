import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./public', import.meta.url)),
      '&': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
  test: {
    globals: true, // Jest-like global functions (describe, it, expect)
    environment: 'jsdom', // Simulates browser environment
    coverage: {
      reporter: ['text', 'json', 'html'], // Optional coverage reports
    },
  },
});
