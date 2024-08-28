module.exports = {
  extends: [
    '@mate-academy/eslint-config',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
  ],
  rules: {
    'prettier/prettier': ['error'],
  },
  plugins: ['prettier'],
  env: {
    browser: true,
    node: true,
    'cypress/globals': true,
  },
};
