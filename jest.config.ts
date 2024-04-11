module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'api/config', 'api/app.ts', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html']
};
