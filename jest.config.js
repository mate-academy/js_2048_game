'use strict';

module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  reporters: [
    ['@mate-academy/jest-mochawesome-reporter', {
      outputDir: './raw_reports',
      createDirIfMissing: true,
    }],
  ],
  testEnvironment: 'jsdom',
};
