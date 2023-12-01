module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],

  rules: {
    strict: ['error', 'global'],
  },

  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
};
