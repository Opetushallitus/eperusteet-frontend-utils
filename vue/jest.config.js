module.exports = {
  globals: {
    'ts-jest': {
      tsoConfig: 'tsconfig.json',
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  setupFiles: [
  ],
  coverageReporters: [
    'text-summary',
    'json',
    'lcov',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|tsx|vue)',
    '!<rootDir>/src/generated/**/*.ts',
    '!<rootDir>/src/**/script.ts',
    '!<rootDir>/**/*.d.ts',
    '!<rootDir>/src/config/styles.ts',
    '!<rootDir>/src/api',
    '!<rootDir>/src/main.ts',
  ],
  moduleFileExtensions: [
    'vue',
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  'transformIgnorePatterns': [
    '/node_modules/(?!(@ckeditor|katex|vue-masonry|lodash-es|bootstrap-vue)/)',
  ],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^&/(.*)$': '<rootDir>/tests/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
    '<rootDir>/tests/integration/**/*.spec.(ts|tsx)',
  ],
  testURL: 'http://localhost/',
};
