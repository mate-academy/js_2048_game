module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],
  rules: {
    'no-proto': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
