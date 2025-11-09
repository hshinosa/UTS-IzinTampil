// (PENTING) Impor wrapper konfigurasi dari Next.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

// Buat fungsi untuk memuat konfigurasi Next.js
const createJestConfig = nextJest({
  // Berikan path ke proyek Next.js Anda (root folder)
  dir: './',
})

// Konfigurasi Jest kustom Anda
/** @type {import('jest').Config} */
const customJestConfig = {
  // Menambahkan matcher kustom (spt. .toBeInTheDocument())
  // File ini akan kita buat di langkah berikutnya
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Menggunakan environment JSDOM untuk simulasi browser
  testEnvironment: 'jest-environment-jsdom',
}

// Ekspor konfigurasi gabungan
module.exports = createJestConfig(customJestConfig)