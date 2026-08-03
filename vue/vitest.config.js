import { configDefaults, defineConfig } from 'vitest/config';
import vue  from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./public', import.meta.url)),
      '&': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
  plugins: [
    vue(),
  ],
  test: {
    globals: true, // Jest-like global functions (describe, it, expect)
    environment: 'jsdom', // Simulates browser environment
    exclude: [...configDefaults.exclude, 'e2e/*'],
    setupFiles: './test/setup.ts',
  },
});
