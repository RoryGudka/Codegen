/** @type {import('eslint').Linter.FlatConfig} */
const config = {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      window: 'readonly',
      document: 'readonly',
      console: 'readonly'
    }
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};

export default [config];
