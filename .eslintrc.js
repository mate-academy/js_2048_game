module.exports = {
  extends: ['@mate-academy/eslint-config', 'plugin:cypress/recommended'],
  parser: "@babel/eslint-parser",
  parserOptions: { "requireConfigFile" : "false",
  babelOptions: { "configFile": "./node_modules/@parcel/fs/src/.babelrc", }
  },
  
};
