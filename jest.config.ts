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
      branches: 60,
      functions: 75,
      lines: 30,
      statements: 30,
    },
  },
};
