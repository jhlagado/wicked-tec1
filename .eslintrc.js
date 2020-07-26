module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'airbnb-base',
    'prettier',
  ],
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  globals: {
    process: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'array-element-newline': 0,
    'func-names': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'max-lines': ['error', { max: 400, skipComments: true }],
    'no-alert': 0,
    'no-bitwise': 0,
    'no-nested-ternary': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 0,
    'no-restricted-syntax': 0,
    'no-restricted-globals': 0,
    'no-plusplus': 0,
    'no-use-before-define': 0,
    'prefer-destructuring': 0,
    quotes: ['error', 'single'],
  },
};
