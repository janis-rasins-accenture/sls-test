module.exports = {
  testMatch: ['**/tests/**/*.+(ts|tsx|js)'],
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 85,
    },
  },
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
}
