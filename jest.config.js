// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '^.*.test.(ts|tsx)$',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/icons/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!src/index.tsx',
    '!src/types/**',
    '!**/tests/**',
  ],
  setupFiles: ['<rootDir>/testSetup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/empty.js',
    '\\.(css|less)$': '<rootDir>/empty.js',
    '\\.md$': '<rootDir>/empty-md.js',
  },
  testURL: 'https://localhost/',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
