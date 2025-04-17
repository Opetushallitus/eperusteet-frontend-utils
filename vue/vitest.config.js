import { defineConfig } from 'vitest/config';
import createVuePlugin from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  optimizeDeps: {
    include: ['vue', 'bootstrap-vue'],
  },
  plugins: [
    createVuePlugin({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
  ],
  test: {
    globals: true, // Jest-like global functions (describe, it, expect)
    environment: 'jsdom', // Simulates browser environment
    coverage: {
      reporter: ['text', 'json', 'html'], // Optional coverage reports
    },
    alias: {
      'vue': '@vue/compat',
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./public', import.meta.url)),
      '&': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
});
