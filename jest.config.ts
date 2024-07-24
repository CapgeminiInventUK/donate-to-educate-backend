/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  maxWorkers: 1,
  forceExit: true,
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@middy/core)/)'],
  moduleNameMapper: {
    '^@middy/core$': '<rootDir>/node_modules/@middy/core',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
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
      branches: 60,
      functions: 50,
      lines: 35,
      statements: 35,
    },
  },
  globalTeardown: './tearDown.cjs',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'],
};

export default config;
