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
      branches: 65,
      functions: 65,
      lines: 35,
      statements: 35,
    },
  },
  globalTeardown: './tearDown.cjs',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'],
};
