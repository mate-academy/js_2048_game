module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],
  overrides: [
    {
      files: ['src/modules/Game.class.js'],
      rules: {
        'comma-dangle': 'off',
        'function-paren-newline': 'off',
      },
    },
  ],
};
