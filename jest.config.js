module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', // <-- pastikan ini
  moduleDirectories: ['node_modules', 'components', 'app'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
};
