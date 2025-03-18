module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
