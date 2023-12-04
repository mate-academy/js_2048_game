module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],

  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
};
