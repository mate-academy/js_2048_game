module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],

  parseOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  }
};
