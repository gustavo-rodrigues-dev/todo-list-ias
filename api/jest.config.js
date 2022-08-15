module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/test-setup.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/index.ts',
    '<rootDir>/src/config.ts',
  ],
};
