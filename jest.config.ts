/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: ['__test__'],
  testMatch: ['**.test.ts'],
  preset: '@shelf/jest-mongodb',
  testTimeout: 30000,
  watchPathIgnorePatterns: ['globalConfig'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 20,
      statements: 20,
    },
  },
};
