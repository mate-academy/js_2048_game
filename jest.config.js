'use strict';

module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  reporters: [
    'default',
    ['./jest-mochawesome.js', {
      outputDir: './raw_reports',
    }],
  ],
};
