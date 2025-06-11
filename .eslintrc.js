module.exports = {
  extends: [
    '@mate-academy/eslint-config',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'], // синхронізує з Prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
        tabWidth: 2,
        printWidth: 80,
      },
    ],
  },
};
