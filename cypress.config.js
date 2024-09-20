const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://Stepan31.github.io/js_2048_game/',
    supportFile: false,
    specPattern: 'cypress/integration/**/*.spec.{js,ts,jsx,tsx}',
  },
  video: true,
  viewportHeight: 1920,
  viewportWidth: 1080,
  screenshotOnRunFailure: true,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'raw_reports',
    overwrite: false,
    html: false,
    json: true,
  },
});
