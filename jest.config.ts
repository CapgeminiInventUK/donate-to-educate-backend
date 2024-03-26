/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  maxWorkers: 1,
  forceExit: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: ['__test__', 'testUtils.ts'],
  testMatch: ['**.test.ts'],
  preset: '@shelf/jest-mongodb',
  testTimeout: 30000,
  watchPathIgnorePatterns: ['globalConfig'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 40,
      statements: 40,
    },
  },
  globalTeardown: './tearDown.cjs',
};
