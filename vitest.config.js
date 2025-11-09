// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Pengaturan environment (misalnya, jika menguji komponen UI)
    environment: 'jsdom',
    // Konfigurasi Coverage Report
    coverage: {
      enabled: true,
      provider: 'v8',
      // 'json-summary' wajib untuk mengambil data persentase di Sprint 2
      // 'lcov' wajib untuk tool coverage badge
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: './coverage/vitest',
      thresholds: {
        lines: 50, // Ambang batas awal
      },
    },
  },
});