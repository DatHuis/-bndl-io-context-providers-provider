module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.ts',
    '<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
